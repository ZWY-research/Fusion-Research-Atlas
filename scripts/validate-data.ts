import { readFileSync } from "node:fs";
import { parseAtlas, kinds, frameworkSchema } from "../src/model.ts";
import { compareMetadata } from "../src/doi.ts";
const read = (path: string) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const atlas = parseAtlas(read("../public/data/electron-density.json")),
  framework = frameworkSchema.parse(read("../src/content/framework.json"));
for (const kind of kinds)
  if (!atlas.nodes.some((n) => n.kind === kind))
    throw Error("Missing object type " + kind);
for (const item of [...atlas.nodes, ...atlas.edges])
  for (const domain of item.domainIds)
    if (!framework.domains.some((d) => d.id === domain))
      throw Error("Unknown domain " + domain);
const legacy = read("../tests/fixtures/v0.1.json");
for (const field of ["nodes", "edges"] as const) {
  const ids = atlas[field].map((n) => n.id);
  for (const n of legacy[field])
    if (!ids.includes(n.id)) throw Error("Lost legacy ID " + n.id);
}
for (const e of legacy.edges) {
  const current = atlas.edges.find((r) => r.id === e.id)!;
  if (
    e.source !== current.source ||
    e.target !== current.target ||
    e.relation !== current.relation
  )
    throw Error("Changed legacy relationship " + e.id);
}
const snapshots = read("../tests/fixtures/crossref-metadata.json");
for (const s of atlas.sources) {
  if (s.sourceType === "journal_article") {
    const actual = snapshots.find((a: { doi: string }) => a.doi === s.doi);
    if (!actual || !Object.values(compareMetadata(s, actual)).every(Boolean))
      throw Error("Offline DOI metadata mismatch: " + s.id);
  }
}
console.log(
  `Validated ${atlas.nodes.length} objects, ${atlas.edges.length} relationships, ${atlas.sources.length} sources and ${framework.domains.length} domains; legacy IDs preserved.`,
);
