import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { atlasSchema, visibleNodes } from "../src/model.ts";
const data = JSON.parse(
  readFileSync(
    new URL("../public/data/electron-density.json", import.meta.url),
    "utf8",
  ),
);
test("reject dangling relationships, duplicate IDs and ungrounded literature claims", () => {
  for (const mutate of [
    (d: any) => (d.edges[0].target = "missing"),
    (d: any) => d.nodes.push(d.nodes[0]),
    (d: any) => (d.nodes[0].status = "literature"),
    (d: any) =>
      (d.edges.find((e: any) => e.relation === "may_explain").status =
        "example"),
  ]) {
    const d = structuredClone(data);
    mutate(d);
    assert.equal(atlasSchema.safeParse(d).success, false);
  }
});
test("search matches tags and filters compose", () => {
  const a = atlasSchema.parse(data);
  assert.ok(visibleNodes(a, "Thomson", "all", "all").length > 0);
  assert.ok(visibleNodes(a, "", "hypothesis", "hypothesis").length > 0);
  assert.equal(visibleNodes(a, "no-such-object", "all", "all").length, 0);
  assert.equal(visibleNodes(a, "", "hypothesis", "example").length, 0);
});
