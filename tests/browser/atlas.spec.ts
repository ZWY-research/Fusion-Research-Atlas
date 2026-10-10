import { test, expect } from "@playwright/test";
test("production graph, real canvas click, details, search, filters and hash refresh", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failures: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  await page.goto("");
  await expect(page.getByTestId("result-count")).toHaveText("15");
  await expect(
    page.locator('[data-testid="graph"] canvas').first(),
  ).toBeVisible();
  await page.screenshot({
    path:
      (process.env.FRA_SCREENSHOT_DIR || "test-results/screenshots") +
      "/FRA-V0.1-home.png",
    fullPage: true,
  });
  // Preset central node is positioned at the canvas centre after fit. Real pointer interaction.
  const box = await page.getByTestId("graph").boundingBox();
  if (!box) throw Error("No graph");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  await page.screenshot({
    path:
      (process.env.FRA_SCREENSHOT_DIR || "test-results/screenshots") +
      "/FRA-V0.1-node-detail.png",
    fullPage: true,
  });
  await page.getByLabel("搜索科学对象").fill("Thomson");
  await expect(page.getByTestId("result-count")).toHaveText("1");
  await page.getByTestId("node-m-profile").click();
  await expect(page.getByTestId("detail-title")).toHaveText("密度剖面诊断");
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await page.getByLabel("对象类型").selectOption("hypothesis");
  await expect(page.getByTestId("result-count")).toHaveText("2");
  await page.getByLabel("证据状态").selectOption("example");
  await expect(page.getByTestId("result-count")).toHaveText("0");
  await expect(
    page.getByText("没有匹配对象。请调整搜索或筛选。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "重置", exact: true }).click();
  await page.getByTestId("node-h-pinch").click();
  await expect(page.getByTestId("detail-title")).toHaveText("向内对流贡献假设");
  await expect(page.locator(".detail .status")).toHaveText("待验证假设");
  await page.reload();
  await expect(page.getByTestId("detail-title")).toHaveText("向内对流贡献假设");
  await page.getByRole("button", { name: "适应视图" }).click();
  await page.getByRole("button", { name: "放大图谱" }).click();
  await page.getByRole("button", { name: "缩小图谱" }).click();
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
test("mobile layout remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await page.getByTestId("node-q-density").click();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("failed data request shows an actionable error", async ({ page }) => {
  await page.route("**/data/electron-density.json", (r) =>
    r.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("");
  await expect(page.getByRole("alert")).toContainText("无法加载图谱");
  await expect(page.getByRole("button", { name: "重新加载" })).toBeVisible();
});
