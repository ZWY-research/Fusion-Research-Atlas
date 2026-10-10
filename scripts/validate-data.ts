import { readFileSync } from "node:fs";
import { atlasSchema, kinds } from "../src/model.ts";
const atlas = atlasSchema.parse(
  JSON.parse(
    readFileSync(
      new URL("../public/data/electron-density.json", import.meta.url),
      "utf8",
    ),
  ),
);
for (const kind of kinds)
  if (!atlas.nodes.some((n) => n.kind === kind))
    throw Error("Missing scientific object type: " + kind);
console.log(
  `Validated ${atlas.nodes.length} nodes, ${atlas.edges.length} relationships; all seven object types covered.`,
);
