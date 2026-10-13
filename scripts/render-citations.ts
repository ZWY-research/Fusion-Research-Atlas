import MarkdownIt from "markdown-it";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Source } from "../src/model.ts";
import { parseAtlas } from "../src/model.ts";
import { natureReferences } from "../src/citations.ts";
import { citationResources } from "./citation-resources.ts";

export function renderCitations(markdown: string, sources: Source[]) {
  const md = new MarkdownIt({ html: false });
  const ids: string[] = [];
  // Let markdown-it handle code, escapes and Markdown structure before this rule.
  md.inline.ruler.before("link", "fra_citation", (state, silent) => {
    // Label lookahead must treat brackets as text, not as nested links.
    if (silent) return false;
    if (!state.src.startsWith("[@", state.pos)) return false;
    const end = state.src.indexOf("]", state.pos + 2);
    if (end < 0) return false;
    const sourceId = state.src.slice(state.pos + 2, end);
    if (!sources.some((s) => s.id === sourceId))
      throw Error(`Unknown sourceId: ${sourceId}`);
    if (state.linkLevel > 0)
      throw Error("Citation markers must appear outside Markdown links");
    if (!silent) {
      const token = state.push("fra_citation", "sup", 0);
      token.meta = { sourceId };
      ids.push(sourceId);
    }
    state.pos = end + 1;
    return true;
  });
  const tokens = md.parse(markdown, {});
  for (const token of tokens) {
    for (const child of token.children || []) {
      if (
        child.type === "image" &&
        child.children?.some((t) => t.type === "fra_citation")
      )
        throw Error(
          "Citation markers must appear outside Markdown image labels",
        );
    }
  }
  const entries = natureReferences(sources, ids, citationResources());
  const numbers = new Map(entries.map((e) => [e.sourceId, e.number]));
  md.renderer.rules.fra_citation = (tokens, index) => {
    const sourceId = tokens[index].meta!.sourceId as string;
    return `<sup><a href="#ref-${sourceId}" data-source-id="${sourceId}">${numbers.get(sourceId)}</a></sup>`;
  };
  const body = md.renderer.render(tokens, md.options, {});
  const references = entries.length
    ? `<section aria-label="References"><h2>References</h2>${entries
        .map(
          (entry) =>
            `<div class="reference-entry" id="ref-${entry.sourceId}" data-source-id="${entry.sourceId}">${entry.html}<a href="${md.utils.escapeHtml(entry.url)}">${md.utils.escapeHtml(entry.url)}</a></div>`,
        )
        .join("\n")}</section>`
    : "";
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>FRA cited document</title><style>body{max-width:900px;margin:2rem auto;padding:0 1rem;font-family:system-ui;line-height:1.6;overflow-wrap:anywhere}.csl-entry{display:flex;gap:.5rem}.csl-left-margin{min-width:1.5rem}.reference-entry{margin:1rem 0}pre{overflow:auto}sup a{padding:0 .1em}</style><main>${body}${references}</main><footer>Nature style · <a href="https://citationstyles.org/">CSL</a> · <a href="https://github.com/Juris-M/citeproc-js">citeproc-js, © Frank Bennett</a></footer></html>`;
}

function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output || process.argv.length !== 4)
    throw Error("Usage: npm run render:references -- input.md output.html");
  if (resolve(input) === resolve(output))
    throw Error("Output must not overwrite the input document");
  const atlas = parseAtlas(
    JSON.parse(
      readFileSync(
        new URL("../public/data/electron-density.json", import.meta.url),
        "utf8",
      ),
    ),
  );
  const html = renderCitations(readFileSync(input, "utf8"), atlas.sources);
  writeFileSync(output, html);
  console.log(`Rendered Nature references: ${output}`);
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    main();
  } catch (error) {
    console.error(String(error));
    process.exitCode = 1;
  }
}
