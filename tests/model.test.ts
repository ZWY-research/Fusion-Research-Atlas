import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  buildStudyComparison,
  comparisonStudies,
  comparisonRecordPath,
} from "../src/studyComparisonData.ts";
import { labels } from "../src/i18n.ts";
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
import {
  buildQuestionOverview,
  questionOverviewSections,
  isOverviewNode,
} from "../src/questionOverviewData.ts";
const read = (p: string) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const data = read("../public/data/electron-density.json"),
  legacy = read("./fixtures/v0.1.json"),
  snapshots = read("./fixtures/crossref-metadata.json"),
  framework = read("../src/content/framework.json");

test("FRA-02 resolves five sources and every selected finding with live conditions, citations and limits", () => {
  const atlas = parseAtlas(data);
  const before = structuredClone(atlas);
  const result = buildStudyComparison(atlas, "q-density")!;
  assert.equal(result.studies.length, 5);
  assert.deepEqual(result.missing, []);
  assert.equal(new Set(comparisonStudies.map((s) => s.sourceId)).size, 5);
  for (const study of result.studies) {
    assert.equal(
      study.source,
      atlas.sources.find((s) => s.id === study.sourceId),
    );
    assert.equal(study.findings.length, study.findingIds.length);
    assert.equal(new Set(study.findingIds).size, study.findingIds.length);
    for (const { finding, relatedNodes, citation } of study.findings) {
      assert.equal(
        finding,
        study.source.reportedFindings.find((f) => f.id === finding.id),
      );
      assert.ok(citation, finding.id + " needs an existing citation");
      assert.equal(citation.sourceId, study.sourceId);
      assert.equal(citation.findingId, finding.id);
      assert.ok(
        [...atlas.nodes, ...atlas.edges].some((item) =>
          item.citations.includes(citation),
        ),
      );
      assert.ok(
        relatedNodes.every((n) =>
          n.citations.some(
            (c) => c.sourceId === study.sourceId && c.findingId === finding.id,
          ),
        ),
      );
    }
  }
  assert.deepEqual(atlas, before);
  atlas.sources[0].reportedFindings[0].statement.en = "Live source statement";
  atlas.sources[0].limitations.en = "Live limits";
  const updated = buildStudyComparison(atlas, "q-density")!.studies[0];
  assert.equal(
    updated.findings[0].finding.statement.en,
    "Live source statement",
  );
  assert.equal(updated.source.limitations.en, "Live limits");
});

test("FRA-02 preserves main scientific data, schema, IDs and 5/5/0 verification counts", () => {
  // Semantic JSON hash avoids Git checkout line-ending differences. Baseline:
  // main 4fabbf6d198e4870ca7fd86efbd64a29bfa09802.
  const digest = (s: string) => createHash("sha256").update(s).digest("hex");
  assert.equal(
    digest(JSON.stringify(data)),
    "1e70dc6a4a3cedc9ed51250c982128066d13d04537c96e0ba4e1782aba5138c8",
  );
  assert.equal(
    digest(
      readFileSync(new URL("../src/model.ts", import.meta.url), "utf8").replace(
        /\r\n/g,
        "\n",
      ),
    ),
    "68d77e42ca243b043bcaa0b55070842194d93af9fc8d6b29f36ec3a3c1419fd4",
  );
  assert.equal(data.nodes.length, 31);
  assert.equal(data.edges.length, 53);
  assert.equal(data.sources.length, 5);
  assert.equal(
    data.sources.filter(
      (s: { readingScope: string }) => s.readingScope === "full_text",
    ).length,
    5,
  );
  assert.ok(
    data.sources.every(
      (s: { verificationStatus: { independent: string } }) =>
        s.verificationStatus.independent === "not_checked",
    ),
  );
  assert.ok(
    data.sources.every((s: { reportedFindings: { id: string }[] }) =>
      s.reportedFindings.every((f) => !f.id.startsWith("FRA02-")),
    ),
  );
});

test("FRA-02 bilingual dimensions and study metadata link to the complete synthesis without attributing it to authors", () => {
  const record = readFileSync(
    new URL("../" + comparisonRecordPath, import.meta.url),
    "utf8",
  );
  for (const study of comparisonStudies) {
    for (const value of [study.evidenceType, study.observable, study.methods]) {
      assert.ok(value.zh.trim() && value.en.trim());
      assert.notEqual(value.zh, value.en);
    }
    for (const id of study.findingIds) assert.ok(record.includes(id), id);
    assert.ok(record.includes("../papers/" + study.reviewFile));
  }
  for (const [key, value] of Object.entries(labels).filter(
    ([key]) => key.startsWith("comparison") || key === "compareStudies",
  )) {
    assert.ok(value[0].trim() && value[1].trim(), key);
    assert.notEqual(value[0], value[1], key);
  }
  for (const id of [
    "FRA02-C01",
    "FRA02-C02",
    "FRA02-C03",
    "FRA02-C04",
    "FRA02-C05",
  ])
    assert.ok(record.includes(id));
  assert.match(record, /not graph `finding-\*`/);
  assert.match(record, /not_checked/);
  assert.match(record, /尚不能宣称获得普适/);
});

test("FRA-02 handles unknown questions and missing records without substituting unrelated science", () => {
  const atlas = parseAtlas(data);
  assert.equal(buildStudyComparison(atlas, "unknown"), null);
  assert.equal(buildStudyComparison(atlas, "p-peaking"), null);
  assert.equal(
    buildStudyComparison({ ...atlas, nodes: [] }, "q-density"),
    null,
  );
  const missingSource = buildStudyComparison(
    { ...atlas, sources: atlas.sources.slice(1) },
    "q-density",
  )!;
  assert.equal(missingSource.studies.length, 4);
  assert.deepEqual(missingSource.missing, ["paper-angioni-2003"]);
  atlas.sources[0].reportedFindings.shift();
  const missingFinding = buildStudyComparison(atlas, "q-density")!;
  assert.deepEqual(missingFinding.missing, ["paper-angioni-2003/finding-2003"]);
  assert.equal(missingFinding.studies[0].findings.length, 4);
});

test("question overview resolves six stable sections and only existing node/finding IDs", () => {
  const a = parseAtlas(data),
    overview = buildQuestionOverview(a, "q-density")!;
  assert.deepEqual(
    overview.sections.map((s) => s.id),
    ["question", "knowledge", "mechanisms", "evidence", "questions", "next"],
  );
  assert.ok(overview.sections.every((s) => s.missing.length === 0));
  for (const section of questionOverviewSections) {
    assert.equal(new Set(section.nodeIds).size, section.nodeIds.length);
    for (const id of section.nodeIds)
      assert.ok(a.nodes.some((n) => n.id === id));
    const keys = section.findings.map((r) => r.sourceId + "/" + r.findingId);
    assert.equal(new Set(keys).size, keys.length);
    for (const ref of section.findings)
      assert.ok(
        a.sources
          .find((s) => s.id === ref.sourceId)
          ?.reportedFindings.some((f) => f.id === ref.findingId),
      );
  }
  assert.equal(isOverviewNode("q-density"), true);
  assert.equal(isOverviewNode("h-pinch"), false);
});

test("overview reads live Atlas text and never mutates source records or verification states", () => {
  const a = parseAtlas(data),
    before = structuredClone(a);
  const result = buildQuestionOverview(a, "q-density")!;
  assert.deepEqual(a, before);
  assert.equal(
    result.question,
    a.nodes.find((n) => n.id === "q-density"),
  );
  const live = a.nodes.find((n) => n.id === "k-diiid-source-transport")!;
  live.summary.en = "Runtime summary from the authoritative graph";
  const liveFinding = a.sources[0].reportedFindings.find(
    (f) => f.id === "finding-a03-incremental-flux",
  )!;
  liveFinding.statement.zh = "运行时来源发现";
  const updated = buildQuestionOverview(a, "q-density")!;
  assert.equal(
    updated.sections[1].nodes.find((n) => n.id === live.id),
    live,
  );
  assert.equal(
    updated.sections[2].findings.find((f) => f.finding.id === liveFinding.id)!
      .finding,
    liveFinding,
  );
  assert.deepEqual(
    updated.sources.map((s) => s.verificationStatus),
    before.sources.map((s) => s.verificationStatus),
  );
});

test("overview keeps demonstrations in definitions and hypotheses unverified", () => {
  const a = parseAtlas(data),
    overview = buildQuestionOverview(a, "q-density")!;
  const demos = overview.sections.flatMap((s) =>
    s.nodes
      .filter((n) => n.contentStatus === "demonstration")
      .map((n) => [s.id, n.id]),
  );
  assert.deepEqual(demos, [
    ["question", "q-density"],
    ["question", "p-peaking"],
  ]);
  assert.ok(
    overview.sections
      .filter((s) => s.id !== "question")
      .every((s) =>
        s.nodes.every((n) => n.contentStatus === "research_record"),
      ),
  );
  const candidate = overview.sections[2].nodes[0];
  assert.equal(candidate.id, "h-diiid-coupled-turbulence");
  assert.equal(candidate.epistemicStatus, "candidate_hypothesis");
  assert.ok(candidate.citations.every((c) => !c.claimVerified));
  assert.ok(
    overview.sections[5].nodes.every(
      (n) => n.kind === "method" && n.epistemicStatus === "research_plan",
    ),
  );
  assert.ok(
    overview.sources.every(
      (s) => s.verificationStatus.independent === "not_checked",
    ),
  );
  candidate.contentStatus = "demonstration";
  const changed = buildQuestionOverview(a, "q-density")!;
  assert.equal(changed.sections[2].nodes.length, 0);
  assert.ok(changed.sections[2].missing.includes(candidate.id));
});

test("overview reports missing mappings and does not substitute an unknown question", () => {
  const a = parseAtlas(data);
  assert.equal(buildQuestionOverview(a, "unknown"), null);
  assert.equal(buildQuestionOverview(a, "q-perturbative-steady"), null);
  a.nodes = a.nodes.filter((n) => n.id !== "g-flux-identification");
  a.edges = a.edges.filter(
    (e) =>
      e.source !== "g-flux-identification" &&
      e.target !== "g-flux-identification",
  );
  a.sources[0].reportedFindings = a.sources[0].reportedFindings.filter(
    (f) => f.id !== "finding-a03-collision-ablation",
  );
  for (const item of [...a.nodes, ...a.edges])
    item.citations = item.citations.filter(
      (c) => c.findingId !== "finding-a03-collision-ablation",
    );
  const overview = buildQuestionOverview(parseAtlas(a), "q-density")!;
  assert.equal(overview.sections.length, 6);
  assert.ok(overview.sections[4].missing.includes("g-flux-identification"));
  assert.ok(
    overview.sections[3].missing.includes(
      "paper-angioni-2003/finding-a03-collision-ablation",
    ),
  );
});

test("all five overview sources and findings retain exact original associations", () => {
  const a = parseAtlas(data),
    overview = buildQuestionOverview(a, "q-density")!;
  assert.deepEqual(
    overview.sources.map((s) => s.id),
    a.sources.map((s) => s.id),
  );
  for (const section of overview.sections)
    for (const entry of section.findings) {
      assert.equal(
        a.sources.find((s) => s.id === entry.source.id),
        entry.source,
      );
      assert.equal(
        entry.source.reportedFindings.find((f) => f.id === entry.finding.id),
        entry.finding,
      );
      assert.ok(entry.relatedNodes.length > 0);
      assert.ok(
        entry.relatedNodes.every(
          (n) =>
            n.contentStatus === "research_record" &&
            n.citations.some(
              (c) =>
                c.sourceId === entry.source.id &&
                c.findingId === entry.finding.id,
            ),
        ),
      );
      assert.ok(
        entry.citation &&
          entry.citation.sourceId === entry.source.id &&
          entry.citation.findingId === entry.finding.id,
      );
    }
});
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
      d.sources[0].verificationStatus.fullText = "not_checked";
    },
    (d: any) => (d.sources[0].readingScope = "abstract"),
    (d: any) => (d.sources[0].readingScope = "metadata_only"),
    (d: any) => {
      d.sources[0].readingScope = "abstract";
      d.sources[0].verificationStatus.fullText = "not_checked";
      for (const f of d.sources[0].reportedFindings) f.scope = "abstract";
      d.nodes.find((n: any) => n.id === "h-pinch").citations[0].scope =
        "full_text";
    },
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
  assert.equal(visibleNodes(a, "Thomson", "all", "all").length, 2);
  assert.ok(visibleNodes(a, "source", "all", "all").length > 0);
  assert.equal(
    visibleNodes(a, "", "hypothesis", "candidate_hypothesis").length,
    3,
  );
  assert.equal(
    visibleNodes(a, "", "all", "all", "all", "research_record").length,
    16,
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
  source.verificationStatus.fullText = "not_checked";
  source.verificationStatus.claim = "not_checked";
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
    source.verificationStatus.fullText =
      scope === "full_text" ? "checked" : "not_checked";
    for (const f of source.reportedFindings) f.scope = scope;
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
    "full_text",
  );
  const angioni2003 = a.sources.find((s) => s.id === "paper-angioni-2003")!;
  assert.equal(angioni2003.reportedFindings[0].id, "finding-2003");
  assert.equal(angioni2003.reportedFindings[0].scope, "full_text");
  assert.match(angioni2003.reportedFindings[0].locator.en, /Fig\. 1/);
  assert.equal(angioni2003.verificationStatus.claim, "checked");
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

test("Mordijck full-text findings constrain transport without independent causal verification", () => {
  const a = parseAtlas(data);
  const source = a.sources.find((s) => s.id === "paper-mordijck-2020")!;
  assert.equal(source.readingScope, "full_text");
  for (const key of ["metadata", "abstract", "fullText", "claim"] as const)
    assert.equal(source.verificationStatus[key], "checked");
  assert.equal(source.verificationStatus.independent, "not_checked");
  assert.ok(source.reportedFindings.every((f) => f.scope === "full_text"));
  const hypothesis = a.nodes.find(
    (n) => n.id === "h-diiid-coupled-turbulence",
  )!;
  assert.equal(hypothesis.epistemicStatus, "candidate_hypothesis");
  assert.ok(
    hypothesis.citations.every((c) => c.role === "context" && !c.claimVerified),
  );
  const observation = a.nodes.find((n) => n.id === "p-diiid-peaking")!;
  assert.equal(observation.epistemicStatus, "conditional");
  assert.ok(observation.citations.every((c) => c.claimVerified && c.findingId));
  for (const id of ["q-perturbative-steady", "m-diiid-discriminating-tests"])
    assert.ok(
      a.nodes
        .find((n) => n.id === id)!
        .citations.every((c) => !c.claimVerified),
    );
  const inflated = structuredClone(data);
  inflated.nodes.find((n: any) => n.id === hypothesis.id).epistemicStatus =
    "supported";
  assert.equal(atlasSchema.safeParse(inflated).success, false);
});
