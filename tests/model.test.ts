import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  atlasSchema,
  parseAtlas,
  sourceSchema,
  visibleNodes,
  kinds,
  frameworkSchema,
} from "../src/model.ts";
import { normalizeDoi, doiUrl, compareMetadata } from "../src/doi.ts";
import { contributionKinds, contributionUrl } from "../src/collaboration.ts";
const read = (p: string) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const data = read("../public/data/electron-density.json"),
  legacy = read("./fixtures/v0.1.json"),
  snapshots = read("./fixtures/crossref-metadata.json"),
  framework = read("../src/content/framework.json");
test("legacy migration preserves every identity, endpoint, position and method type", () => {
  const a = parseAtlas(legacy);
  assert.deepEqual(
    a.nodes.map((n) => n.id),
    legacy.nodes.map((n: { id: string }) => n.id),
  );
  assert.deepEqual(
    a.edges.map((e) => [e.id, e.source, e.target, e.relation]),
    legacy.edges.map((e: any) => [e.id, e.source, e.target, e.relation]),
  );
  assert.deepEqual(
    a.nodes.map((n) => n.position),
    legacy.nodes.map((n: any) => n.position),
  );
  assert.ok(a.nodes.some((n) => n.kind === "method"));
  assert.ok(a.nodes.every((n) => n.contentStatus === "demonstration"));
  assert.ok(a.nodes.every((n) => n.epistemicStatus !== "supported"));
});
test("reject dangling IDs, duplicate IDs and counterfeit demo conclusions", () => {
  for (const mutate of [
    (d: any) => (d.edges[0].target = "missing"),
    (d: any) => d.nodes.push(d.nodes[0]),
    (d: any) => (d.edges[0].id = d.nodes[0].id),
    (d: any) => (d.nodes[0].epistemicStatus = "supported"),
    (d: any) =>
      (d.edges.find((e: any) => e.relation === "may_explain").epistemicStatus =
        "background"),
  ]) {
    const d = structuredClone(data);
    mutate(d);
    assert.equal(atlasSchema.safeParse(d).success, false);
  }
});
test("real literature can contextualize a hypothesis without verifying it", () => {
  const a = parseAtlas(data),
    n = a.nodes.find((n) => n.id === "h-pinch")!;
  assert.ok(n.citations.length);
  assert.equal(n.epistemicStatus, "candidate_hypothesis");
  assert.equal(n.contentStatus, "demonstration");
  assert.ok(n.citations.every((c) => c.role === "context" && !c.claimVerified));
});
test("refuse fabricated claim verification and reading scope", () => {
  for (const mutate of [
    (d: any) =>
      (d.nodes.find((n: any) => n.id === "h-pinch").citations[0].claimVerified =
        true),
    (d: any) => {
      d.sources[0].verificationStatus.claim = "checked";
      d.sources[0].verificationStatus.abstract = "not_checked";
    },
    (d: any) => (d.sources[0].verificationStatus.fullText = "checked"),
    (d: any) => (d.sources[0].readingScope = "metadata_only"),
    (d: any) =>
      (d.nodes.find((n: any) => n.id === "h-pinch").citations[0].scope =
        "full_text"),
    (d: any) =>
      (d.nodes.find((n: any) => n.id === "h-pinch").citations[0].sourceId =
        "fake-source"),
  ]) {
    const d = structuredClone(data);
    mutate(d);
    assert.equal(atlasSchema.safeParse(d).success, false);
  }
});
test("support and challenge cite an explicit finding; one source is not multiple-source support", () => {
  const d = structuredClone(data);
  const n = d.nodes.find((n: any) => n.id === "h-pinch");
  n.citations[0].role = "support";
  n.citations[0].findingId = null;
  assert.equal(atlasSchema.safeParse(d).success, false);
  const formal = structuredClone(data);
  const claim = formal.nodes.find((n: any) => n.id === "h-pinch");
  claim.contentStatus = "research_record";
  claim.epistemicStatus = "supported";
  claim.citations = [claim.citations[0]];
  claim.citations[0].role = "support";
  claim.citations[0].claimVerified = true;
  formal.sources[0].verificationStatus.claim = "checked";
  assert.equal(atlasSchema.safeParse(formal).success, false);
});
test("legal DOI suffixes are preserved and resolver URLs encode reserved characters", () => {
  assert.equal(
    normalizeDoi(" DOI:10.1103/PhysRevLett.90.205003 "),
    "10.1103/physrevlett.90.205003",
  );
  assert.equal(
    normalizeDoi("https://doi.org/10.1000/A%28B%29;C"),
    "10.1000/a(b);c",
  );
  assert.equal(normalizeDoi("10.1000/a(b).c;d:1"), "10.1000/a(b).c;d:1");
  assert.equal(doiUrl("10.1000/a#b?c"), "https://doi.org/10.1000/a%23b%3Fc");
  assert.throws(() => normalizeDoi("https://evil.test/10.1000/fake"));
  assert.throws(() => normalizeDoi("10.1000/white space"));
  assert.throws(() => normalizeDoi("10.1000/a" + String.fromCharCode(0)));
});
test("DOI metadata comparisons check all five fields including author order", () => {
  for (const source of data.sources) {
    const snapshot = snapshots.find((s: any) => s.doi === source.doi);
    assert.ok(Object.values(compareMetadata(source, snapshot)).every(Boolean));
    assert.equal(
      compareMetadata(source, {
        ...snapshot,
        authors: [...snapshot.authors].reverse(),
      }).authors,
      false,
    );
    assert.equal(
      compareMetadata(source, { ...snapshot, year: 2000 }).year,
      false,
    );
    assert.equal(
      compareMetadata(source, { ...snapshot, title: "Different paper" }).title,
      false,
    );
  }
});
test("a journal source without DOI needs an explicit reason and alternative URL", () => {
  const source = structuredClone(data.sources[0]);
  source.doi = null;
  source.url = "https://example.org/archive";
  source.doiUnavailableReason = null;
  assert.equal(sourceSchema.safeParse(source).success, false);
  source.doiUnavailableReason = {
    zh: "未分配 DOI，使用档案记录",
    en: "No DOI assigned; use the archive record",
  };
  assert.equal(sourceSchema.safeParse(source).success, true);
});
test("bilingual fields, domains, all seven object types and search filters compose", () => {
  const a = parseAtlas(data),
    f = frameworkSchema.parse(framework);
  assert.equal(f.domains.length, 8);
  assert.equal(f.domains.filter((d) => d.hasSubgraph).length, 1);
  for (const kind of kinds) assert.ok(a.nodes.some((n) => n.kind === kind));
  for (const n of a.nodes) {
    assert.ok(n.label.zh && n.label.en);
    for (const domain of n.domainIds)
      assert.ok(f.domains.some((d) => d.id === domain));
  }
  assert.equal(visibleNodes(a, "Thomson", "all", "all").length, 1);
  assert.ok(visibleNodes(a, "source", "all", "all").length > 0);
  assert.equal(
    visibleNodes(a, "", "hypothesis", "candidate_hypothesis").length,
    2,
  );
  assert.equal(
    visibleNodes(a, "", "all", "all", "all", "research_record").length,
    6,
  );
});
test("GitHub contribution URLs select the corresponding existing Issue Form", () => {
  for (const kind of contributionKinds) {
    const url = new URL(contributionUrl(kind));
    assert.equal(url.origin, "https://github.com");
    assert.equal(
      url.pathname,
      "/ZWY-research/Fusion-Research-Atlas/issues/new",
    );
    assert.equal(url.searchParams.get("template"), kind + ".yml");
    assert.equal(url.searchParams.has("body"), false);
    assert.deepEqual([...url.searchParams.keys()], ["template"]);
    const form = readFileSync(
      new URL("../.github/ISSUE_TEMPLATE/" + kind + ".yml", import.meta.url),
      "utf8",
    );
    assert.ok(form.includes("id: question"));
    assert.ok(form.includes("id: sources"));
    assert.ok(form.includes("id: verification"));
  }
});
test("checked abstract rejects metadata-only reading even with no findings", () => {
  const source = structuredClone(data.sources[0]);
  source.reportedFindings = [];
  source.readingScope = "metadata_only";
  assert.equal(source.verificationStatus.abstract, "checked");
  const result = sourceSchema.safeParse(source);
  assert.equal(result.success, false);
  if (!result.success)
    assert.ok(
      result.error.issues.some(
        (i) =>
          i.message === "Abstract check requires abstract or full-text reading",
      ),
    );
  source.verificationStatus.abstract = "not_checked";
  assert.equal(sourceSchema.safeParse(source).success, true);
});
test("checked abstract accepts abstract and full-text reading scopes", () => {
  for (const scope of ["abstract", "full_text"]) {
    const source = structuredClone(data.sources[0]);
    source.readingScope = scope;
    assert.equal(source.verificationStatus.abstract, "checked");
    assert.equal(sourceSchema.safeParse(source).success, true);
  }
});

test("research additions preserve demonstration provenance and historical abstract findings", () => {
  const a = parseAtlas(data);
  for (const original of legacy.nodes) {
    const n = a.nodes.find((n) => n.id === original.id)!;
    assert.deepEqual(n.position, original.position);
    assert.equal(n.contentStatus, "demonstration");
    assert.ok(
      n.citations.every((c) => c.role === "context" && !c.claimVerified),
    );
  }
  const angioni = a.sources.find((s) => s.id === "paper-angioni-2007")!;
  assert.equal(angioni.readingScope, "full_text");
  assert.equal(
    angioni.reportedFindings.find((f) => f.id === "finding-2007")!.scope,
    "abstract",
  );
  assert.equal(
    a.sources.find((s) => s.id === "paper-angioni-2003")!.readingScope,
    "abstract",
  );
  assert.ok(
    a.sources.every((s) => s.verificationStatus.independent === "not_checked"),
  );
  const reachable = new Set(["q-density"]);
  for (let i = 0; i < a.nodes.length; i++)
    for (const edge of a.edges)
      if (reachable.has(edge.source)) reachable.add(edge.target);
  assert.ok(
    a.nodes
      .filter((n) => n.contentStatus === "research_record")
      .every((n) => reachable.has(n.id)),
  );
});
