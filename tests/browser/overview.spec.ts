import { test, expect } from "@playwright/test";

const overviewRoute = "?view=overview&question=q-density";
const screenshotDir =
  process.env.FRA_SCREENSHOT_DIR || "test-results/screenshots";

test("overview opens from q-density, exposes six sections and clears hiding filters on node navigation", async ({
  page,
}) => {
  await page.goto("#q-density");
  await page.getByLabel("搜索科学对象").fill("no-matching-record");
  await page.getByLabel("对象类型").selectOption("hypothesis");
  await expect(page.getByTestId("result-count")).toHaveText("0");
  await page
    .getByRole("button", { name: "查看研究总览", exact: false })
    .click();
  await expect(page).toHaveURL(/\?view=overview&question=q-density$/);
  await expect(page.locator(".overview-section")).toHaveCount(6);
  await expect(page.getByTestId("question-overview")).toContainText(
    "全局峰化因子与局部 R/L_ne 不同",
  );
  await expect(page.getByTestId("overview-node-q-density")).toHaveAttribute(
    "data-content-status",
    "demonstration",
  );
  await expect(page.getByTestId("overview-node-p-peaking")).toContainText(
    "不是实测实验结果",
  );
  await expect(
    page.getByTestId("overview-node-h-diiid-coupled-turbulence"),
  ).toHaveAttribute("data-epistemic-status", "candidate_hypothesis");
  await expect(page.getByTestId("overview-section-next")).toContainText(
    "尚未执行",
  );
  await expect(
    page.locator('[data-testid="overview-node-h-pinch"]'),
  ).toHaveCount(0);
  await page
    .getByTestId("overview-node-k-diiid-source-transport")
    .getByRole("button", { name: "查看图谱节点", exact: false })
    .click();
  await expect(page).toHaveURL(/#k-diiid-source-transport$/);
  await expect(page.getByTestId("detail-title")).toHaveText(
    "有限源下的峰化输运比",
  );
  await expect(page.getByLabel("搜索科学对象")).toHaveValue("");
  await expect(page.getByLabel("对象类型")).toHaveValue("all");
  await expect(page.getByTestId("result-count")).toHaveText("31");
  await expect(
    page.getByTestId("node-k-diiid-source-transport"),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "返回研究总览", exact: false })
    .click();
  await expect(page.getByTestId("question-overview")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "有限源下的峰化输运比",
  );
  await page.goForward();
  await expect(page.getByTestId("question-overview")).toBeVisible();
});

test("overview uses all five existing source pages and history preserves the shareable entry", async ({
  page,
}) => {
  await page.goto(overviewRoute);
  const ids = [
    "paper-angioni-2003",
    "paper-angioni-2007",
    "paper-greenwald-2007",
    "paper-mordijck-2020",
    "paper-angioni-2012",
  ];
  for (const id of ids) {
    await page.getByTestId("overview-source-" + id).click();
    await expect(page.getByTestId("paper-" + id)).toBeVisible();
    await expect(
      page.getByTestId("paper-" + id).locator(".verification-grid"),
    ).toContainText("独立核验: 未检查");
    await expect(page.getByTestId("insight-" + id)).toHaveAttribute(
      "href",
      /github\.com.*\/docs\/literature\/papers\/.*\.md$/,
    );
    await page.goBack();
    await expect(page.getByTestId("question-overview")).toBeVisible();
  }
  await page.getByTestId("overview-source-paper-angioni-2003").click();
  await page.goBack();
  await page.goForward();
  await expect(page.getByTestId("paper-paper-angioni-2003")).toBeVisible();
  await page.getByRole("button", { name: "返回研究总览", exact: true }).click();
  await expect(page).toHaveURL(/view=overview&question=q-density$/);
  await page.reload();
  await expect(page.locator(".overview-section")).toHaveCount(6);
  await page.getByRole("button", { name: "返回图谱", exact: true }).click();
  await expect(page).toHaveURL(/#q-density$/);
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
});

test("overview evidence retains source/finding scope and has unique local reference anchors", async ({
  page,
}) => {
  await page.goto(overviewRoute);
  const finding = page.getByTestId(
    "overview-finding-finding-a03-ware-competition",
  );
  await expect(finding).toContainText("独立核验: 未检查");
  await finding.locator("summary").click();
  await expect(finding).toContainText("Fig. 5");
  await expect(finding).toContainText("不是实验独立移除 Ware");
  const node = page.getByTestId("overview-node-k-a12-state-dependent-flux");
  await node.locator("summary").click();
  await expect(node.locator(".reference-entry").first()).toBeVisible();
  await expect(finding.locator(".reference-entry")).toHaveCount(1);
  const ids = await page
    .locator("[id]")
    .evaluateAll((elements) => elements.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
  await finding.locator(".citation-number").click();
  await expect(page).toHaveURL(/view=overview&question=q-density$/);
  await expect(finding.locator(".reference-entry")).toBeInViewport();
  await finding
    .getByRole("button", { name: "查看图谱节点", exact: false })
    .first()
    .click();
  await expect(page.getByTestId("detail-title")).toBeVisible();
});

test("unknown overview questions fall back without displaying q-density science", async ({
  page,
}) => {
  await page.goto("?view=overview&question=unknown");
  await expect(page.getByTestId("overview-unavailable")).toBeVisible();
  await expect(page.locator(".overview-section")).toHaveCount(0);
  await page.getByRole("button", { name: "返回图谱", exact: true }).click();
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  await page.goBack();
  await expect(page.getByTestId("overview-unavailable")).toBeVisible();
  await page.goto("#q-density");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
});

for (const language of ["zh", "en"] as const) {
  test(`overview ${language} direct link, language switching and desktop/mobile reading`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(overviewRoute);
    if (language === "en")
      await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      language === "zh" ? "zh-CN" : "en",
    );
    const titles =
      language === "zh"
        ? [
            "科学问题",
            "已有认识",
            "候选机制",
            "关键证据",
            "未解决问题",
            "下一步研究",
          ]
        : [
            "Scientific Question",
            "Established Knowledge",
            "Candidate Mechanisms",
            "Key Evidence",
            "Open Questions",
            "Next Verification",
          ];
    await expect(page.locator(".overview-section-heading h3")).toHaveText(
      titles,
    );
    await expect(
      page
        .getByTestId("overview-node-h-diiid-coupled-turbulence")
        .locator(".status"),
    ).toHaveText(language === "zh" ? "待验证假设" : "Candidate hypothesis");
    await page.screenshot({
      path: screenshotDir + `/FRA-01-overview-${language}-desktop.png`,
      fullPage: true,
    });
    await page.screenshot({
      path: screenshotDir + `/FRA-01-overview-${language}-desktop-entry.png`,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: screenshotDir + `/FRA-01-overview-${language}-mobile-entry.png`,
    });
    for (const section of await page.locator(".overview-section").all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByTestId("overview-node-m-diiid-discriminating-tests")
      .getByRole("button", {
        name: language === "zh" ? "查看图谱节点 →" : "View graph node →",
        exact: true,
      })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: screenshotDir + `/FRA-01-overview-${language}-mobile.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", {
        name: language === "zh" ? "English" : "中文",
        exact: true,
      })
      .click();
    await expect(page.locator(".overview-section")).toHaveCount(6);
    await expect(page).toHaveURL(/view=overview&question=q-density$/);
    expect(errors).toEqual([]);
  });
}
