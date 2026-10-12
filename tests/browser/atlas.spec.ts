import { test, expect } from "@playwright/test";
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
  await expect(page.getByTestId("result-count")).toHaveText("15");
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
  const box = await page.getByTestId("graph").boundingBox();
  if (!box) throw Error("No graph");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  await page.getByLabel("搜索科学对象").fill("Thomson");
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await page.getByTestId("node-m-profile").click();
  await expect(page.getByTestId("detail-title")).toHaveText("密度剖面诊断");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await page.getByLabel("对象类型").selectOption("hypothesis");
  await expect(page.getByTestId("result-count")).toHaveText("2");
  await page.getByLabel("内容性质").selectOption("research_record");
  await expect(page.getByTestId("result-count")).toHaveText("0");
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
  await expect(page.getByTestId("result-count")).toHaveText("15");
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
  // Isolate the two endpoints of r-04 through a search shared only by their labels/details.
  // Click the centre of the long vertical link between q-density and p-peaking (r-01), away from nodes.
  const box = await page.getByTestId("graph").boundingBox();
  if (!box) throw Error("No graph");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 - 70);
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
  for (let i = 0; i < 285; i++) {
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
  await expect(page.getByTestId("result-count")).toHaveText("285");
  await page.getByRole("button", { name: "适应视图" }).click();
});
