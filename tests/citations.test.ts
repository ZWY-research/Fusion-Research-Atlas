import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  existsSync,
  unlinkSync,
  rmdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { parseAtlas } from "../src/model.ts";
import { natureReferences, toCslItem } from "../src/citations.ts";
import { citationResources } from "../scripts/citation-resources.ts";
import { renderCitations } from "../scripts/render-citations.ts";
const atlas = parseAtlas(
  JSON.parse(
    readFileSync(
      new URL("../public/data/electron-density.json", import.meta.url),
      "utf8",
    ),
  ),
);
const A = "paper-angioni-2003",
  B = "paper-angioni-2007",
  G = "paper-greenwald-2007";
const resources = citationResources();
const refs = (ids: string[]) => natureReferences(atlas.sources, ids, resources);
const plain = (html: string) =>
  html
    .replace(/<\/div>/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&#38;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

test("Nature CSL formats existing papers: author threshold, journal, volume and page range", () => {
  const [a, b, g] = refs([A, B, G]);
  assert.match(a.html, /<i>et al\.<\/i>/); // five personal names plus the recorded team
  assert.match(
    a.html,
    /<i>Phys\. Rev\. Lett\.<\/i> <b>90<\/b>, 205003 \(2003\)/,
  );
  assert.match(b.html, /<i>et al\.<\/i>/);
  assert.match(b.html, /<i>Nucl\. Fusion<\/i> <b>47<\/b>, 1326–1335 \(2007\)/);
  assert.equal(
    plain(g.html),
    "3. Greenwald, M., Angioni, C., Hughes, J. W., Terry, J. & Weisen, H. Density profile peaking in low collisionality H-modes: comparison of Alcator C-Mod data to ASDEX Upgrade/JET scalings. Nucl. Fusion 47, L26–L29 (2007).",
  );
});
test("scope numbers follow first use, deduplicate, reset and exclude uncited sources", () => {
  assert.deepEqual(
    refs([G, A, G, B]).map((r) => [r.sourceId, r.number]),
    [
      [G, 1],
      [A, 2],
      [B, 3],
    ],
  );
  assert.deepEqual(
    refs([B, G]).map((r) => [r.sourceId, r.number]),
    [
      [B, 1],
      [G, 2],
    ],
  );
  assert.deepEqual(refs([]), []);
  assert.equal(
    refs([A])[0].url,
    "https://doi.org/10.1103/physrevlett.90.205003",
  );
  assert.equal(refs([G])[0].url, "https://doi.org/10.1088/0029-5515/47/9/l03");
});
test("formatting preserves original authors, source IDs, findings and scientific statuses", () => {
  const before = structuredClone(atlas);
  for (const source of atlas.sources) {
    const item = toCslItem(source);
    assert.equal(item.id, source.id);
    assert.deepEqual(
      item.author
        .slice(0, source.authors.length)
        .map((n) => ("family" in n ? n.family : n.literal)),
      source.authors.map((name) => name.slice(name.lastIndexOf(" ") + 1)),
    );
    assert.deepEqual(
      item.author.slice(source.authors.length),
      source.collectiveAuthors.map((literal) => ({ literal })),
    );
  }
  refs([A, B, G, A]);
  renderCitations(`First [@${B}]. Again [@${B}].`, atlas.sources);
  assert.deepEqual(atlas, before);
});
test("unknown IDs and unreliable metadata fail rather than fabricate references", () => {
  assert.throws(
    () => refs([A, "missing-paper"]),
    /Unknown sourceId: missing-paper/,
  );
  for (const modify of [
    (s: (typeof atlas.sources)[number]) => {
      delete s.journalAbbreviation;
    },
    (s: (typeof atlas.sources)[number]) => {
      s.pages = "";
    },
    (s: (typeof atlas.sources)[number]) => {
      s.authors = ["Ambiguous Full Name"];
    },
    (s: (typeof atlas.sources)[number]) => {
      s.sourceType = "experimental_data";
    },
  ]) {
    const source = structuredClone(atlas.sources[0]);
    modify(source);
    assert.throws(
      () => natureReferences([source], [source.id], resources),
      /Cannot format/,
    );
  }
});
test("a source without DOI retains its registered alternative link", () => {
  const source = structuredClone(atlas.sources[0]);
  source.doi = null;
  source.url = "https://example.org/archive";
  assert.equal(
    natureReferences([source], [source.id], resources)[0].url,
    source.url,
  );
});
test("Markdown numbers only prose citations and repeats the original number", () => {
  const html = renderCitations(
    `First [@${G}]. Next [@${A}]. Then [@${B}]. Again [@${G}].`,
    atlas.sources,
  );
  const numbers = [...html.matchAll(/<sup><a[^>]*>(\d+)<\/a><\/sup>/g)].map(
    (m) => m[1],
  );
  assert.deepEqual(numbers, ["1", "2", "3", "1"]);
  assert.equal((html.match(/class="reference-entry"/g) || []).length, 3);
  assert.ok(!html.includes("ref-paper-mordijck-2020"));
  assert.ok(html.includes("<i>Nucl. Fusion</i> <b>47</b>"));
});
test("code and escaped markers remain literal; link/image citation labels report unsupported", () => {
  const html = renderCitations(
    "`[@unknown]`\n\n```md\n[@unknown]\n```\n\n\\[@unknown]",
    atlas.sources,
  );
  assert.ok(!html.includes("<h2>References</h2>"));
  assert.throws(
    () => renderCitations(`[see [@${G}]](https://example.org)`, atlas.sources),
    /outside Markdown links/,
  );
  assert.throws(
    () => renderCitations(`![caption [@${G}]](figure.png)`, atlas.sources),
    /outside Markdown image labels/,
  );
});
test("HTML-like bibliography titles cannot inject active elements", () => {
  const source = structuredClone(atlas.sources[0]);
  source.title = "<img src=x onerror=alert(1)> & comparison";
  const html = natureReferences([source], [source.id], resources)[0].html;
  assert.ok(!html.includes("<img"));
});
test("CLI unknown source fails without writing output or altering input", () => {
  const dir = mkdtempSync(join(tmpdir(), "fra-citations-"));
  try {
    const input = join(dir, "input.md"),
      output = join(dir, "output.html");
    writeFileSync(input, "Unknown [@unregistered-source].");
    const result = spawnSync(
      process.execPath,
      [
        "--experimental-strip-types",
        fileURLToPath(
          new URL("../scripts/render-citations.ts", import.meta.url),
        ),
        input,
        output,
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unknown sourceId: unregistered-source/);
    assert.equal(existsSync(output), false);
    assert.equal(
      readFileSync(input, "utf8"),
      "Unknown [@unregistered-source].",
    );
  } finally {
    for (const name of ["input.md", "output.html"]) {
      const file = join(dir, name);
      if (existsSync(file)) unlinkSync(file);
    }
    rmdirSync(dir);
  }
});
