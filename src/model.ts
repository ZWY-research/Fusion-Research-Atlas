import { z } from "zod";
export const kinds = [
  "question",
  "phenomenon",
  "knowledge",
  "hypothesis",
  "evidence",
  "gap",
  "method",
] as const;
export const statuses = ["example", "hypothesis", "literature"] as const;
export const kindLabels: Record<string, string> = {
  question: "科学问题",
  phenomenon: "现象",
  knowledge: "知识",
  hypothesis: "假设",
  evidence: "证据",
  gap: "研究缺口",
  method: "验证方法",
};
export const statusLabels: Record<string, string> = {
  example: "示例 · 未经验证",
  hypothesis: "待验证假设",
  literature: "文献背景 · 非本项目证据",
};
export const colors: Record<string, string> = {
  question: "#547eff",
  phenomenon: "#e8af58",
  knowledge: "#52beb0",
  hypothesis: "#b28bf5",
  evidence: "#78b8eb",
  gap: "#e27991",
  method: "#92b97a",
};
const source = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.url().refine((v) => v.startsWith("https://")),
  scope: z.string().min(1),
});
const node = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(kinds),
  status: z.enum(statuses),
  summary: z.string().min(1),
  details: z.string().min(1),
  tags: z.array(z.string()),
  sourceIds: z.array(z.string()),
  position: z.object({ x: z.number(), y: z.number() }),
});
const edge = z.object({
  id: z.string().min(1),
  source: z.string(),
  target: z.string(),
  relation: z.enum([
    "motivates",
    "describes",
    "may_explain",
    "requires",
    "tests",
    "constrains",
    "contextualizes",
  ]),
  label: z.string().min(1),
  status: z.enum(statuses),
  rationale: z.string().min(1),
  sourceIds: z.array(z.string()),
});
export const atlasSchema = z
  .object({
    schemaVersion: z.literal("0.1"),
    title: z.string(),
    disclaimer: z.string(),
    sources: z.array(source),
    nodes: z.array(node),
    edges: z.array(edge),
  })
  .superRefine((a, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    const ids = a.nodes.map((n) => n.id),
      sources = new Set(a.sources.map((s) => s.id));
    if (new Set(ids).size !== ids.length) fail("Duplicate node IDs");
    if (new Set(a.edges.map((e) => e.id)).size !== a.edges.length)
      fail("Duplicate edge IDs");
    if (sources.size !== a.sources.length) fail("Duplicate source IDs");
    for (const e of a.edges) {
      if (!ids.includes(e.source) || !ids.includes(e.target))
        fail("Dangling edge: " + e.id);
    }
    for (const item of [...a.nodes, ...a.edges]) {
      for (const id of item.sourceIds)
        if (!sources.has(id)) fail("Unknown source: " + id);
      if (item.status === "literature" && !item.sourceIds.length)
        fail("Literature item needs source");
      if (item.status !== "literature" && item.sourceIds.length)
        fail("Demo items must not borrow literature authority");
    }
    for (const e of a.edges)
      if (e.relation === "may_explain" && e.status !== "hypothesis")
        fail("May-explain relationship must be a hypothesis");
  });
export type Atlas = z.infer<typeof atlasSchema>;
export type AtlasNode = Atlas["nodes"][number];
export function visibleNodes(
  a: Atlas,
  query: string,
  kind: string,
  status: string,
) {
  const q = query.trim().toLocaleLowerCase();
  return a.nodes.filter(
    (n) =>
      (kind === "all" || n.kind === kind) &&
      (status === "all" || n.status === status) &&
      (!q ||
        [n.label, n.summary, n.details, ...n.tags]
          .join(" ")
          .toLocaleLowerCase()
          .includes(q)),
  );
}
