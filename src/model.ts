import { z } from "zod";
import { normalizeDoi, doiUrl } from "./doi.ts";
export const kinds = [
  "question",
  "phenomenon",
  "knowledge",
  "hypothesis",
  "evidence",
  "gap",
  "method",
] as const;
export const epistemicStatuses = [
  "open_question",
  "unassessed",
  "background",
  "candidate_hypothesis",
  "research_plan",
  "conditional",
  "supported",
  "contested",
] as const;
export const contentStatuses = ["demonstration", "research_record"] as const;
export const sourceTypes = [
  "journal_article",
  "preprint",
  "experimental_data",
  "simulation",
  "theoretical_derivation",
  "research_report",
] as const;
export const colors: Record<string, string> = {
  question: "#547eff",
  phenomenon: "#e8af58",
  knowledge: "#52beb0",
  hypothesis: "#b28bf5",
  evidence: "#78b8eb",
  gap: "#e27991",
  method: "#92b97a",
};
export const localized = z
  .object({ zh: z.string().min(1), en: z.string().min(1) })
  .strict();
export type Localized = z.infer<typeof localized>;
export type Language = "zh" | "en";
export const text = (value: Localized, lang: Language) => value[lang];
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const https = z.url().refine((v) => v.startsWith("https://"));
const status = z.enum(["not_checked", "checked"]);
export const verification = z
  .object({
    metadata: status,
    abstract: status,
    fullText: status,
    claim: status,
    independent: status,
  })
  .strict();
const finding = z
  .object({
    id,
    statement: localized,
    locator: localized,
    scope: z.enum(["abstract", "full_text"]),
    conditions: localized,
    limitations: localized,
  })
  .strict();
export const sourceSchema = z
  .object({
    id,
    title: z.string().min(1),
    titleTranslation: localized,
    authors: z.array(z.string().min(1)).min(1),
    collectiveAuthors: z.array(z.string()),
    journal: z.string(),
    year: z.number().int().min(1600).max(2100),
    volume: z.string(),
    issue: z.string(),
    pages: z.string(),
    doi: z.string().nullable(),
    doiUnavailableReason: localized.nullable(),
    url: https,
    sourceType: z.enum(sourceTypes),
    contentStatus: z.enum(contentStatuses),
    researchConditions: localized,
    reportedFindings: z.array(finding),
    limitations: localized,
    verificationStatus: verification,
    verifiedAt: z.iso.date().nullable(),
    metadataSources: z.array(https),
    readingScope: z.enum(["metadata_only", "abstract", "full_text"]),
  })
  .strict()
  .superRefine((s, ctx) => {
    const fail = (m: string) => ctx.addIssue({ code: "custom", message: m });
    if (s.sourceType === "journal_article" && !s.journal.trim())
      fail("Journal article needs a publication source");
    if (
      s.contentStatus === "demonstration" &&
      Object.values(s.verificationStatus).includes("checked")
    )
      fail("Demonstration sources cannot claim completed verification");
    if (s.doi) {
      try {
        if (normalizeDoi(s.doi) !== s.doi || doiUrl(s.doi) !== s.url)
          fail("DOI must be normalized with a matching resolver URL");
      } catch {
        fail("Invalid DOI");
      }
    }
    if (s.sourceType === "journal_article" && !s.doi && !s.doiUnavailableReason)
      fail(
        "Journal source without DOI requires an explicit reason and alternative URL",
      );
    if (
      Object.values(s.verificationStatus).includes("checked") &&
      !s.verifiedAt
    )
      fail("Checked source needs a date");
    if (
      s.verificationStatus.metadata === "checked" &&
      !s.metadataSources.length
    )
      fail("Metadata check needs traceable providers");
    if (
      s.verificationStatus.abstract === "checked" &&
      s.readingScope === "metadata_only"
    )
      fail("Abstract check requires abstract or full-text reading");
    if (
      s.verificationStatus.fullText === "checked" &&
      s.readingScope !== "full_text"
    )
      fail("Full-text claim without full-text reading");
    if (
      s.verificationStatus.claim === "checked" &&
      s.verificationStatus.abstract !== "checked" &&
      s.verificationStatus.fullText !== "checked"
    )
      fail("Metadata alone cannot verify a scientific claim");
    if (
      s.verificationStatus.independent === "checked" &&
      s.verificationStatus.claim !== "checked"
    )
      fail("Independent verification needs claim verification");
    if (s.readingScope === "metadata_only" && s.reportedFindings.length)
      fail("Metadata-only sources cannot report scientific findings");
    if (
      s.reportedFindings.some((f) => f.scope === "full_text") &&
      s.readingScope !== "full_text"
    )
      fail("Cannot report unread full-text findings");
  });
const citation = z
  .object({
    sourceId: id,
    findingId: id.nullable(),
    role: z.enum(["context", "support", "challenge"]),
    scope: z.enum(["metadata_only", "abstract", "full_text"]),
    statement: localized,
    conditions: localized,
    locator: localized,
    claimVerified: z.boolean(),
  })
  .strict();
const scientific = z.object({
  id,
  contentStatus: z.enum(contentStatuses),
  epistemicStatus: z.enum(epistemicStatuses),
  domainIds: z.array(id).min(1),
  citations: z.array(citation),
});
const node = scientific
  .extend({
    label: localized,
    kind: z.enum(kinds),
    summary: localized,
    details: localized,
    tags: z.array(localized),
    position: z.object({ x: z.number(), y: z.number() }),
  })
  .strict();
const edge = scientific
  .extend({
    source: id,
    target: id,
    relation: z.enum([
      "motivates",
      "describes",
      "may_explain",
      "requires",
      "tests",
      "constrains",
      "contextualizes",
    ]),
    label: localized,
    rationale: localized,
  })
  .strict();
export const atlasSchema = z
  .object({
    schemaVersion: z.literal("0.2"),
    title: localized,
    disclaimer: localized,
    sources: z.array(sourceSchema),
    nodes: z.array(node).min(1),
    edges: z.array(edge),
  })
  .strict()
  .superRefine((a, ctx) => {
    const fail = (m: string) => ctx.addIssue({ code: "custom", message: m });
    const ids = new Set(a.nodes.map((n) => n.id));
    const sources = new Map(a.sources.map((s) => [s.id, s]));
    if (ids.size !== a.nodes.length) fail("Duplicate node IDs");
    if (
      new Set([...a.nodes, ...a.edges].map((i) => i.id)).size !==
      a.nodes.length + a.edges.length
    )
      fail("Node and edge IDs must be globally unique");
    if (new Set(a.edges.map((e) => e.id)).size !== a.edges.length)
      fail("Duplicate relationship IDs");
    if (sources.size !== a.sources.length) fail("Duplicate source IDs");
    const dois = a.sources.flatMap((s) => (s.doi ? [s.doi] : []));
    if (new Set(dois).size !== dois.length) fail("Duplicate DOI");
    for (const s of a.sources)
      if (
        new Set(s.reportedFindings.map((f) => f.id)).size !==
        s.reportedFindings.length
      )
        fail("Duplicate finding IDs");
    for (const e of a.edges) {
      if (!ids.has(e.source) || !ids.has(e.target))
        fail("Dangling relationship: " + e.id);
      if (
        e.relation === "may_explain" &&
        e.epistemicStatus !== "candidate_hypothesis"
      )
        fail("May-explain must remain a hypothesis");
    }
    for (const item of [...a.nodes, ...a.edges]) {
      if (
        item.contentStatus === "demonstration" &&
        ["conditional", "supported"].includes(item.epistemicStatus)
      )
        fail("Demonstration data cannot claim established support");
      for (const c of item.citations) {
        const s = sources.get(c.sourceId);
        if (!s) {
          fail("Unknown source " + c.sourceId);
          continue;
        }
        const f = s.reportedFindings.find((f) => f.id === c.findingId);
        if (c.findingId && !f) fail("Unknown source finding");
        if (c.role !== "context" && !f)
          fail("Support or challenge requires a specific finding");
        if (c.scope === "full_text" && s.readingScope !== "full_text")
          fail("Citation exceeds actual reading scope");
        if (c.scope === "abstract" && s.readingScope === "metadata_only")
          fail("Citation exceeds metadata scope");
        if (
          c.claimVerified &&
          (s.verificationStatus.claim !== "checked" ||
            c.role === "context" ||
            item.contentStatus === "demonstration")
        )
          fail("Citation falsely promotes verification");
      }
      if (
        item.epistemicStatus === "supported" &&
        new Set(
          item.citations
            .filter((c) => c.role === "support" && c.claimVerified)
            .map((c) => c.sourceId),
        ).size < 2
      )
        fail(
          "Multiple-source supported claim needs two distinct verified sources",
        );
    }
  });
export type Atlas = z.infer<typeof atlasSchema>;
export type AtlasNode = Atlas["nodes"][number];
export type AtlasEdge = Atlas["edges"][number];
export type Source = z.infer<typeof sourceSchema>;
export type Citation = z.infer<typeof citation>;
// Explicit legacy migration: never infer scientific verification from the old status field.
export function migrateLegacy(input: unknown): unknown {
  if (
    !input ||
    typeof input !== "object" ||
    !("schemaVersion" in input) ||
    input.schemaVersion !== "0.1"
  )
    return input;
  const legacy = z
    .object({
      schemaVersion: z.literal("0.1"),
      title: z.string(),
      disclaimer: z.string(),
      sources: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          url: z.string(),
          scope: z.string(),
        }),
      ),
      nodes: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          kind: z.enum(kinds),
          status: z.enum(["example", "hypothesis", "literature"]),
          summary: z.string(),
          details: z.string(),
          tags: z.array(z.string()),
          sourceIds: z.array(z.string()),
          position: z.object({ x: z.number(), y: z.number() }),
        }),
      ),
      edges: z.array(
        z.object({
          id: z.string(),
          source: z.string(),
          target: z.string(),
          relation: z.string(),
          label: z.string(),
          status: z.enum(["example", "hypothesis", "literature"]),
          rationale: z.string(),
          sourceIds: z.array(z.string()),
        }),
      ),
    })
    .parse(input);
  if (
    legacy.sources.length ||
    [...legacy.nodes, ...legacy.edges].some((n) => n.sourceIds.length)
  )
    throw Error(
      "Legacy bibliography requires explicit metadata migration; no fabricated fields",
    );
  const l = (zh: string) => ({ zh, en: "[Legacy translation pending] " + zh });
  const base = (item: { id: string; status: string }) => ({
    id: item.id,
    contentStatus: "demonstration",
    epistemicStatus:
      item.status === "hypothesis" ? "candidate_hypothesis" : "unassessed",
    domainIds: ["transport"],
    citations: [],
  });
  return {
    schemaVersion: "0.2",
    title: l(legacy.title),
    disclaimer: l(legacy.disclaimer),
    sources: [],
    nodes: legacy.nodes.map((n) => ({
      ...base(n),
      label: l(n.label),
      kind: n.kind,
      summary: l(n.summary),
      details: l(n.details),
      tags: n.tags.map(l),
      position: n.position,
    })),
    edges: legacy.edges.map((e) => ({
      ...base(e),
      source: e.source,
      target: e.target,
      relation: e.relation,
      label: l(e.label),
      rationale: l(e.rationale),
    })),
  };
}
export const parseAtlas = (input: unknown): Atlas =>
  atlasSchema.parse(migrateLegacy(input));
export function visibleNodes(
  a: Atlas,
  query: string,
  kind: string,
  epistemicStatus: string,
  domain = "all",
  contentStatus = "all",
) {
  const q = query.trim().toLocaleLowerCase();
  return a.nodes.filter(
    (n) =>
      (kind === "all" || n.kind === kind) &&
      (epistemicStatus === "all" || n.epistemicStatus === epistemicStatus) &&
      (domain === "all" || n.domainIds.includes(domain)) &&
      (contentStatus === "all" || n.contentStatus === contentStatus) &&
      (!q ||
        [n.label, n.summary, n.details, ...n.tags]
          .flatMap((t) => [t.zh, t.en])
          .join(" ")
          .toLocaleLowerCase()
          .includes(q)),
  );
}
export const frameworkSchema = z
  .object({
    mission: localized,
    goals: z.array(localized).length(7),
    domains: z.array(
      z.object({
        id,
        name: localized,
        scope: localized,
        questions: z.array(localized).min(1),
        hasSubgraph: z.boolean(),
      }),
    ),
    methodology: z
      .array(
        z.object({
          id,
          name: localized,
          action: localized,
          input: localized,
          output: localized,
          update: localized,
        }),
      )
      .length(7),
    principles: z.array(localized),
    participation: z.array(
      z.object({
        id: z.enum([
          "research-question",
          "evidence-contribution",
          "scientific-challenge",
          "verification-proposal",
        ]),
        name: localized,
        description: localized,
      }),
    ),
  })
  .strict()
  .superRefine((f, ctx) => {
    if (new Set(f.domains.map((d) => d.id)).size !== f.domains.length)
      ctx.addIssue({ code: "custom", message: "Duplicate domains" });
  });
export type Framework = z.infer<typeof frameworkSchema>;
