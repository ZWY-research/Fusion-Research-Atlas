import CSL from "citeproc";
import type { Source } from "./model.ts";
import { doiUrl } from "./doi.ts";
export type CslResources = { style: string; locales: Record<string, string> };
export type Reference = {
  sourceId: string;
  number: number;
  html: string;
  url: string;
};

// Never guess names from arbitrary prose: current FRA authors use initials + family.
export function toCslItem(source: Source) {
  const problem = (field: string): never => {
    throw Error(`Cannot format ${source.id}: ${field}`);
  };
  if (source.sourceType !== "journal_article")
    problem("only journal_article is supported by this minimal adapter");
  if (!source.journalAbbreviation)
    problem("missing verified journalAbbreviation");
  if (!source.volume || !source.pages)
    problem("missing volume or pages/article number");
  const author = source.authors.map((name) => {
    const match = /^((?:[\p{L}][.-]\s*)+)\s+(.+)$/u.exec(name);
    if (!match)
      return problem(
        `ambiguous author name ${JSON.stringify(name)}; needs structured metadata`,
      );
    return { given: match[1].trim(), family: match[2] };
  });
  return {
    id: source.id,
    type: "article-journal",
    title: source.title,
    author: [
      ...author,
      ...source.collectiveAuthors.map((literal) => ({ literal })),
    ],
    "container-title": source.journal,
    "container-title-short": source.journalAbbreviation,
    volume: source.volume,
    page: source.pages,
    issued: { "date-parts": [[source.year]] },
    DOI: source.doi || undefined,
    URL: source.url,
  };
}

// A fresh processor for each document/object scope; no numbering is persisted.
export function natureReferences(
  sources: Source[],
  citedIds: string[],
  resources: CslResources,
): Reference[] {
  const ids = [...new Set(citedIds)];
  if (!ids.length) return [];
  const byId = new Map(sources.map((s) => [s.id, s]));
  if (byId.size !== sources.length)
    throw Error("Duplicate sourceId in citation catalogue");
  const items = new Map(
    ids.map((id) => {
      const source = byId.get(id);
      if (!source) throw Error(`Unknown sourceId: ${id}`);
      return [id, toCslItem(source)] as const;
    }),
  );
  const engine = new CSL.Engine(
    {
      retrieveLocale: (language) => resources.locales[language] || false,
      retrieveItem: (id) => {
        const item = items.get(id);
        if (!item) throw Error(`Unknown sourceId: ${id}`);
        return item;
      },
    },
    resources.style,
    "en-GB",
  );
  engine.updateItems(ids);
  const bibliography = engine.makeBibliography();
  if (!bibliography || bibliography[0].bibliography_errors?.length)
    throw Error("Nature CSL could not format this bibliography");
  return bibliography[1].map((html, index) => {
    const sourceId = bibliography[0].entry_ids[index][0];
    if (sourceId !== ids[index])
      throw Error("Nature CSL bibliography order mismatch");
    const source = byId.get(sourceId)!;
    return {
      sourceId,
      number: index + 1,
      html: html.trim(),
      url: source.doi ? doiUrl(source.doi) : source.url,
    };
  });
}
