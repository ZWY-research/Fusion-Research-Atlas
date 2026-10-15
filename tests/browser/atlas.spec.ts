import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import type { Core } from "cytoscape";

// Use actual rendered coordinates; adding research nodes changes the fitted viewport.
async function tapGraph(page: Page, id: string) {
  const graph = page.getByTestId("graph");
  const pos = await graph.evaluate((element, id) => {
    const cy = (element as HTMLElement & { _cyreg: { cy: Core } })._cyreg.cy;
    const item = cy.getElementById(id);
    return item.group() === "nodes"
      ? item.renderedPosition()
      : item.renderedMidpoint();
  }, id);
  const box = await graph.boundingBox();
  if (!box) throw Error("No graph");
  await page.mouse.click(box.x + pos.x, box.y + pos.y);
}
const screenshotDir =
  process.env.FRA_SCREENSHOT_DIR || "test-results/screenshots";
test("default atlas, bilingual mission, real canvas click, search, filters and old deep link", async ({
  page,
}) => {
  const errors: string[] = [],
    failures: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  await page.goto("");
  await expect(page.getByTestId("result-count")).toHaveText("28");
  await expect(page.locator(".version")).toHaveText("V0.2 · 科学研究原型");
  await expect(page.locator(".mission")).toContainText("开放协作");
  await expect(page.locator(".mission")).toContainText("open, collaborative");
  await expect(
    page.locator('[data-testid="graph"] canvas').first(),
  ).toBeVisible();
  await page.screenshot({
    path: screenshotDir + "/FRA-V0.2-home.png",
    fullPage: true,
  });
  await tapGraph(page, "q-density");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  await page.getByLabel("搜索科学对象").fill("Thomson");
  await expect(page.getByTestId("result-count")).toHaveText("2");
  await page.getByTestId("node-m-profile").click();
  await expect(page.getByTestId("detail-title")).toHaveText("密度剖面诊断");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await page.getByLabel("对象类型").selectOption("hypothesis");
  await expect(page.getByTestId("result-count")).toHaveText("3");
  await page.getByLabel("内容性质").selectOption("research_record");
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await page.goto("#h-pinch");
  await expect(page.getByTestId("detail-title")).toHaveText("向内对流贡献假设");
  await page.reload();
  await expect(page.getByTestId("detail-title")).toHaveText("向内对流贡献假设");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "Inward convection hypothesis",
  );
  expect(page.url()).toContain("#h-pinch");
  await expect(page.locator(".detail .status")).toHaveText(
    "Candidate hypothesis",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".version")).toHaveText(
    "V0.2 · Scientific Research Prototype",
  );
  await page.reload();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "Inward convection hypothesis",
  );
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
test("all research panels, domain exploration and complete bilingual methodology", async ({
  page,
}) => {
  await page.goto("");
  await page
    .getByRole("button", { name: "关于 FRA / About FRA", exact: true })
    .click();
  await expect(page.locator(".goals li")).toHaveCount(7);
  await page
    .getByRole("button", { name: "研究领域 / Scientific Domains", exact: true })
    .click();
  await expect(page.locator(".domain-card")).toHaveCount(8);
  await expect(page.getByTestId("domain-transport")).toContainText(
    "Particle, Heat & Momentum Transport",
  );
  await page.getByRole("button", { name: "查看子图" }).click();
  await expect(page.getByLabel("研究领域")).toHaveValue("transport");
  await expect(page.getByTestId("result-count")).toHaveText("28");
  await expect(page.locator(".version")).toHaveText("V0.2 · 科学研究原型");
  await page
    .getByRole("button", { name: "研究方法 / Methodology", exact: true })
    .click();
  await expect(page.locator(".method-card")).toHaveCount(7);
  await expect(page.locator(".method-card").first()).toContainText(
    "Phenomenon Identification",
  );
  await page.screenshot({
    path: screenshotDir + "/FRA-V0.2-methodology.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".method-card").first()).toContainText(
    "Diagnostic observations and uncertainty",
  );
  await expect(page.locator(".method-card").last()).toContainText(
    "Never replace scientific validation",
  );
});
test("relationship selection, DOI evidence, reading limits and edge deep link", async ({
  page,
}) => {
  await page.goto("#h-pinch");
  await expect(page.getByTestId("detail-title")).toBeVisible();
  await page.getByTestId("edge-r-04").click();
  await expect(page.getByTestId("edge-title")).toHaveText("可能解释");
  await expect(page.locator(".detail")).toContainText("方向");
  await expect(page.locator(".detail")).toContainText("背景引用");
  await expect(page.locator(".detail a.doi-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1103/physrevlett.90.205003",
  );
  await page.reload();
  await expect(page.getByTestId("edge-title")).toHaveText("可能解释");
  await page.locator(".citation button").click();
  await expect(page.getByTestId("paper-paper-angioni-2003")).toBeVisible();
  await expect(page.locator(".verification-grid")).toContainText(
    "主张核验: 未检查",
  );
  await page.screenshot({
    path: screenshotDir + "/FRA-V0.2-evidence-detail.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator(".verification-grid")).toContainText(
    "Claim verification: Not checked",
  );
  await expect(page.locator(".paper")).toContainText("Figures, raw data");
  await expect(page.locator(".paper a.doi-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1103/physrevlett.90.205003",
  );
  await page.locator(".evidence-sidebar button").nth(1).click();
  await expect(page.getByTestId("paper-paper-angioni-2007")).toContainText(
    "Nuclear Fusion",
  );
  await expect(page.locator(".paper a.doi-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1088/0029-5515/47/9/033",
  );
});
test("real canvas relationship tap opens scientific basis", async ({
  page,
}) => {
  await page.goto("");
  await expect(
    page.locator('[data-testid="graph"] canvas').first(),
  ).toBeVisible();
  await tapGraph(page, "r-01");
  await expect(page.getByTestId("edge-title")).toBeVisible();
  await expect(page.locator(".detail")).toContainText("物理含义");
});
test("GitHub contribution entry URLs select the corresponding Issue Forms", async ({
  page,
}) => {
  await page.goto("");
  await page
    .getByRole("button", { name: "开放协作 / Open Collaboration", exact: true })
    .click();
  await expect(page.locator(".collaboration-grid a")).toHaveCount(4);
  const links = await page.locator(".collaboration-grid a").all();
  for (const [index, link] of links.entries()) {
    const u = new URL((await link.getAttribute("href"))!);
    expect(u.pathname).toBe("/ZWY-research/Fusion-Research-Atlas/issues/new");
    expect(u.searchParams.get("template")).toBe(
      [
        "research-question.yml",
        "evidence-contribution.yml",
        "scientific-challenge.yml",
        "verification-proposal.yml",
      ][index],
    );
    expect(u.searchParams.has("body")).toBe(false);
  }
});
test("mobile atlas and scientific panels have no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await page.getByTestId("node-q-density").click();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  for (const nav of [
    "研究方法 / Methodology",
    "证据与核验 / Evidence & Verification",
    "开放协作 / Open Collaboration",
  ]) {
    await page.getByRole("button", { name: nav, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("failed data request gives localized retry, malformed hash is safe", async ({
  page,
}) => {
  await page.route("**/data/electron-density.json", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("#%ZZ");
  await expect(page.getByRole("alert")).toContainText("无法加载图谱");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Unable to load");
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible();
});

test("300-node synthetic fixture retains responsive selection and bilingual search", async ({
  page,
}) => {
  const response = await page.request.get("data/electron-density.json");
  const atlas = await response.json();
  const syntheticCount = 300 - atlas.nodes.length;
  for (let i = 0; i < syntheticCount; i++) {
    const node = structuredClone(atlas.nodes[i % 15]);
    node.id = "perf-" + i;
    node.label = { zh: "性能测试对象 " + i, en: "Performance fixture " + i };
    node.summary = {
      zh: "仅用于性能测试的合成示例，不是科研记录。",
      en: "Synthetic performance fixture only; not a research record.",
    };
    node.tags = [{ zh: "性能测试", en: "performance-fixture" }];
    node.position = {
      x: (i % 20) * 65 - 600,
      y: Math.floor(i / 20) * 65 - 450,
    };
    atlas.nodes.push(node);
  }
  await page.route("**/data/electron-density.json", (route) =>
    route.fulfill({ json: atlas }),
  );
  await page.goto("");
  await expect(page.getByTestId("result-count")).toHaveText("300");
  await expect(
    page.locator('[data-testid="graph"] canvas').first(),
  ).toBeVisible();
  await page.getByTestId("node-perf-100").click();
  await expect(page.getByTestId("detail-title")).toHaveText("性能测试对象 100");
  await page.getByLabel("搜索科学对象").fill("performance-fixture");
  await expect(page.getByTestId("result-count")).toHaveText(
    String(syntheticCount),
  );
  await page.getByRole("button", { name: "适应视图" }).click();
});

test("Q001 research chain, real canvas node, source findings and bilingual insight links", async ({
  page,
}) => {
  await page.goto("#q-density");
  await expect(page.locator(".notice")).toContainText("科研记录");
  await expect(page.getByTestId("edge-r-q001-enter")).toBeVisible();
  await page.getByTestId("edge-r-q001-enter").click();
  await expect(page.getByTestId("edge-title")).toHaveText("进入真实研究问题");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await tapGraph(page, "k-collisionality-evidence");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "碰撞性经验支持增强",
  );
  await expect(page.locator(".detail")).toContainText("科研记录");
  await expect(page.locator(".detail")).toContainText("微观通量机制尚未证明");
  await expect(page.locator(".citation code")).toContainText([
    "finding-a07-covariance",
    "finding-g07-discrimination",
  ]);
  await page
    .locator(".citation button")
    .filter({ hasText: "Density profile peaking in low collisionality" })
    .click();
  const paper = page.getByTestId("paper-paper-greenwald-2007");
  await expect(paper).toBeVisible();
  await expect(paper.locator("a.doi-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1088/0029-5515/47/9/l03",
  );
  await expect(page.getByTestId("finding-finding-g07-transfer")).toContainText(
    "未参与",
  );
  await expect(paper.locator(".verification-grid")).toContainText(
    "独立核验: 未检查",
  );
  const insight = page.getByTestId("insight-paper-greenwald-2007");
  await expect(insight).toHaveText("科研成果解读 ↗");
  await expect(insight).toHaveAttribute(
    "href",
    /\/blob\/[a-f0-9]{40}\/docs\/literature\/papers\/greenwald-2007\.md$/,
  );
  await expect(insight).toHaveAttribute("target", "_blank");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(insight).toHaveText("Research Insights ↗");
  await expect(paper).toContainText("figure-image details unchecked");
  await page.screenshot({
    path: screenshotDir + "/FRA-Q001-Greenwald-source.png",
    fullPage: true,
  });
  await page
    .locator(".evidence-sidebar button")
    .filter({ hasText: "Scaling of density peaking" })
    .click();
  await expect(page.getByTestId("insight-paper-angioni-2007")).toHaveAttribute(
    "href",
    /angioni-2007\.md$/,
  );
  await expect(page.getByTestId("finding-finding-2007")).toContainText(
    "Abstract",
  );
  await page
    .locator(".evidence-sidebar button")
    .filter({ hasText: "Density Peaking, Anomalous Pinch" })
    .click();
  await expect(page.getByTestId("insight-paper-angioni-2003")).toHaveAttribute(
    "href",
    /angioni-2003\.md$/,
  );
  await expect(
    page.getByTestId("paper-paper-angioni-2003").locator(".verification-grid"),
  ).toContainText("Full text checked: Not checked");
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await page.goto("#m-cross-device-validation");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "跨装置与有限源验证计划",
  );
  await expect(page.locator(".detail")).toContainText("尚未开展");
  await page.getByLabel("内容性质").selectOption("research_record");
  await expect(page.getByTestId("result-count")).toHaveText("13");
  await page.getByRole("button", { name: "适应视图", exact: true }).click();
  await page.screenshot({
    path: screenshotDir + "/FRA-Q001-research-chain.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#p-cmod-low-collisionality");
  await page.locator(".citation button").click();
  await expect(page.getByTestId("insight-paper-greenwald-2007")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("Mordijck transport chain links full study while keeping mechanisms conditional", async ({
  page,
}) => {
  await page.goto("");
  await expect(page.getByTestId("result-count")).toHaveText("28");
  await tapGraph(page, "p-diiid-peaking");
  await expect(page.getByTestId("detail-title")).toBeVisible();
  await page.locator(".citation button").first().click();
  const paper = page.getByTestId("paper-paper-mordijck-2020");
  await expect(paper.locator(".verification-grid")).toContainText(
    "全文检查: 已检查",
  );
  await expect(paper.locator(".verification-grid")).toContainText(
    "主张核验: 已检查",
  );
  await expect(paper.locator(".verification-grid")).toContainText(
    "独立核验: 未检查",
  );
  await expect(paper.locator(".finding")).toHaveCount(6);
  await expect(
    page.getByTestId("finding-finding-m20-tangent-steady"),
  ).toBeVisible();
  await expect(paper.locator("a.doi-link")).toHaveAttribute(
    "href",
    "https://doi.org/10.1088/1741-4326/ab81aa",
  );
  const insight = page.getByTestId("insight-paper-mordijck-2020");
  await expect(insight).toHaveAttribute(
    "href",
    "https://github.com/ZWY-research/Fusion-Research-Atlas/blob/74bd06f48ec06a67a15464d0f6a4200a72096d0f/docs/literature/papers/mordijck-2020.md",
  );
  await expect(insight).toHaveText("科研成果解读 ↗");
  await paper.locator("details summary").click();
  await expect(
    paper.locator('a[href="https://www.osti.gov/servlets/purl/1618050"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(insight).toHaveText("Research Insights ↗");
  await expect(paper.locator(".verification-grid")).toContainText(
    "Full text checked: Checked",
  );
  await expect(paper.locator(".verification-grid")).toContainText(
    "Independent verification: Not checked",
  );
  await page.goto("#h-diiid-coupled-turbulence");
  await expect(page.locator(".detail .status")).toHaveText(
    "Candidate hypothesis",
  );
  await page.reload();
  await expect(page.locator(".detail .status")).toHaveText(
    "Candidate hypothesis",
  );
  await page.goto("#q-perturbative-steady");
  await expect(page.getByTestId("edge-r-m20-closure-test")).toBeVisible();
  await page.getByTestId("edge-r-m20-closure-test").click();
  await expect(page.getByTestId("edge-title")).toBeVisible();
  await page.getByRole("button", { name: "中文", exact: true }).click();
  await page.goto("#m-diiid-discriminating-tests");
  await expect(page.getByTestId("detail-title")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: screenshotDir + "/FRA-Mordijck-transport-study.png",
    fullPage: true,
  });
});

test("Nature references use local scope numbers and preserve scientific status", async ({
  page,
}) => {
  await page.goto("#k-collisionality-evidence");
  await expect(
    page.locator('[data-testid="graph"] canvas').first(),
  ).toBeVisible();
  const references = page.locator(".detail .references");
  await expect(references.locator(".reference-entry")).toHaveCount(2);
  await expect(references.locator(".reference-entry").nth(0)).toHaveAttribute(
    "data-source-id",
    "paper-angioni-2007",
  );
  await expect(references.locator(".reference-entry").nth(1)).toHaveAttribute(
    "data-source-id",
    "paper-greenwald-2007",
  );
  await expect(page.locator(".citation-number")).toHaveText(["1", "2"]);
  await expect(references.locator(".csl-left-margin")).toHaveText(["1.", "2."]);
  await expect(
    references.locator("i").filter({ hasText: "Nucl. Fusion" }),
  ).toHaveCount(2);
  await expect(references.locator("b")).toHaveText(["47", "47"]);
  await expect(references.locator(".reference-link").first()).toHaveAttribute(
    "href",
    "https://doi.org/10.1088/0029-5515/47/9/033",
  );
  await page.locator(".citation-number").last().click();
  expect(page.url()).toContain("#k-collisionality-evidence");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "碰撞性经验支持增强",
  );
  await references.scrollIntoViewIfNeeded();
  await expect(references.locator(".reference-entry").last()).toBeInViewport();
  await references.screenshot({
    path: screenshotDir + "/FRA-Nature-reference-list-zh.png",
  });
  await page.screenshot({
    path: screenshotDir + "/FRA-Nature-references-zh.png",
    fullPage: false,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(references.locator("h3")).toHaveText("References");
  await expect(page.locator(".citation-number")).toHaveText(["1", "2"]);
  await references.scrollIntoViewIfNeeded();
  await expect(references.locator(".reference-entry").last()).toBeInViewport();
  await references.screenshot({
    path: screenshotDir + "/FRA-Nature-reference-list-en.png",
  });
  await page.screenshot({
    path: screenshotDir + "/FRA-Nature-references-en.png",
    fullPage: false,
  });
  await page.goto("#h-pinch");
  await expect(references.locator(".reference-entry")).toHaveCount(2);
  await expect(references.locator(".reference-entry").first()).toHaveAttribute(
    "data-source-id",
    "paper-angioni-2003",
  );
  await expect(references.locator(".csl-left-margin")).toHaveText(["1.", "2."]);
  await expect(
    references.locator("i").filter({ hasText: "Phys. Rev. Lett." }),
  ).toBeVisible();
  await expect(page.locator(".detail .status")).toHaveText(
    "Candidate hypothesis",
  );
  await page.goto("#e-diiid-modulation");
  await expect(references.locator(".reference-entry")).toHaveCount(1);
  await expect(page.locator(".citation-number")).toHaveText(["1", "1"]);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
