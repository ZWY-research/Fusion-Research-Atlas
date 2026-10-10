import { readFileSync, writeFileSync } from "node:fs";
import { parseAtlas } from "../src/model.ts";
import { compareMetadata, fromCrossref } from "../src/doi.ts";
const atlas = parseAtlas(
  JSON.parse(
    readFileSync(
      new URL("../public/data/electron-density.json", import.meta.url),
      "utf8",
    ),
  ),
);
const results = [];
for (const source of atlas.sources.filter((s) => s.doi)) {
  const provider =
    "https://api.crossref.org/works/" + encodeURIComponent(source.doi!);
  const response = await fetch(provider, {
    signal: AbortSignal.timeout(30000),
    headers: { "User-Agent": "FusionResearchAtlas/0.2 DOI metadata checker" },
  });
  if (!response.ok) throw Error("Crossref HTTP " + response.status);
  const fields = compareMetadata(
    source,
    fromCrossref((await response.json()).message),
  );
  results.push({
    sourceId: source.id,
    doi: source.doi,
    provider,
    fields,
    passed: Object.values(fields).every(Boolean),
  });
}
const result = {
  checkedAt: new Date().toISOString(),
  scope: "Metadata only; scientific claims are not verified by this tool",
  results,
};
const i = process.argv.indexOf("--output");
if (i >= 0) {
  if (!process.argv[i + 1]) throw Error("Missing output file");
  writeFileSync(process.argv[i + 1], JSON.stringify(result, null, 2));
}
console.log(JSON.stringify(result, null, 2));
if (results.some((r) => !r.passed)) process.exitCode = 1;
