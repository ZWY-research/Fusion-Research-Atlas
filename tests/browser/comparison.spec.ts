import { test, expect } from "@playwright/test";
import {
  comparisonStudies,
  comparisonRecordUrl,
} from "../../src/studyComparisonData.ts";

const route = "?view=comparison&question=q-density";
const screenshots =
  process.env.FRA_SCREENSHOT_DIR || "test-results/screenshots";

test("FRA-02 opens from FRA-01, returns to overview and preserves back/forward history", async ({
  page,
}) => {
  await page.goto("?view=overview&question=q-density");
  await page
    .getByRole("button", { name: "比较相关研究 →", exact: true })
    .click();
  await expect(page).toHaveURL(/view=comparison&question=q-density$/);
  await expect(page.getByTestId("study-comparison")).toBeVisible();
  await page.getByRole("button", { name: "返回研究总览", exact: true }).click();
  await expect(page.locator(".overview-section")).toHaveCount(6);
  await page.goBack();
  await expect(page.getByTestId("study-comparison")).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId("question-overview")).toBeVisible();
  await page.goForward();
  await expect(page.getByTestId("study-comparison")).toBeVisible();
  await page.reload();
  await expect(page.locator(".comparison-table tbody tr")).toHaveCount(5);
});

test("FRA-02 links every study to existing evidence, DOI and the reviewed paper without promoting states", async ({
  page,
}) => {
  await page.goto(route);
  for (const study of comparisonStudies) {
    const row = page.getByTestId("comparison-study-" + study.sourceId);
    await expect(row.locator(".comparison-independent")).toHaveText(
      "独立核验: 未检查",
    );
    await expect(
      row.getByRole("link", { name: "DOI:", exact: false }),
    ).toHaveAttribute("href", /^https:\/\/doi.org\//);
    await expect(
      row.getByRole("link", { name: "原论文研究评议", exact: false }),
    ).toHaveAttribute(
      "href",
      new RegExp("/docs/literature/papers/" + study.reviewFile + "$"),
    );
    await row
      .getByRole("button", { name: "打开来源证据", exact: false })
      .click();
    await expect(page.getByTestId("paper-" + study.sourceId)).toBeVisible();
    await expect(
      page.getByTestId("paper-" + study.sourceId).locator(".verification-grid"),
    ).toContainText("独立核验: 未检查");
    await expect(page).toHaveURL(
      new RegExp("view=evidence&source=" + study.sourceId + "$"),
    );
    await page.goBack();
    await expect(page).toHaveURL(/view=comparison&question=q-density$/);
  }
  await expect(
    page.getByTestId("comparison-study-paper-angioni-2012"),
  ).toContainText("非独立实验");
  await expect(page.getByTestId("comparison-synthesis")).toContainText(
    "FRA02-C01–C05",
  );
  await expect(page.locator(".comparison-finding")).toHaveCount(21);
  await expect(
    page.locator(".comparison-finding").filter({ hasText: "FRA02-C" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", {
      name: "完整双语比较研究与 FRA02-C01–C05",
      exact: false,
    }),
  ).toHaveAttribute("href", comparisonRecordUrl);
});

test("FRA-02 finding details reuse locators and citations and open related graph nodes with filters cleared", async ({
  page,
}) => {
  await page.goto("#q-density");
  await page.getByLabel("搜索科学对象").fill("no-matching-record");
  await page.getByLabel("对象类型").selectOption("hypothesis");
  await page
    .getByRole("button", { name: "查看研究总览", exact: false })
    .click();
  await page
    .getByRole("button", { name: "比较相关研究 →", exact: true })
    .click();
  const finding = page.getByTestId(
    "comparison-finding-finding-a03-ware-competition",
  );
  await finding.locator("summary").click();
  await expect(finding).toContainText("Fig. 5");
  await expect(finding).toContainText("不是实验独立移除 Ware");
  await expect(finding.locator(".reference-entry")).toHaveCount(1);
  await finding.locator(".citation-number").click();
  await expect(page).toHaveURL(/view=comparison&question=q-density$/);
  await expect(finding.locator(".reference-entry")).toBeInViewport();
  await finding
    .getByRole("button", { name: "查看图谱节点", exact: false })
    .first()
    .click();
  await expect(page.getByTestId("detail-title")).toBeVisible();
  await expect(page.getByLabel("搜索科学对象")).toHaveValue("");
  await expect(page.getByLabel("对象类型")).toHaveValue("all");
  await expect(page.getByTestId("result-count")).toHaveText("31");
  await page.goBack();
  await expect(page.getByTestId("study-comparison")).toBeVisible();
  await page.goForward();
  await expect(page.getByTestId("detail-title")).toBeVisible();
});

test("FRA-02 opens all finding details with unique local reference anchors and preserves author/source identity", async ({
  page,
}) => {
  await page.goto(route);
  for (const study of comparisonStudies) {
    for (const id of study.findingIds) {
      const finding = page.getByTestId("comparison-finding-" + id);
      await finding.locator("summary").click();
      await expect(finding).toContainText(id);
      await expect(finding.locator(".citation")).toHaveCount(1);
    }
  }
  await expect(page.locator(".reference-entry")).toHaveCount(21);
  const ids = await page
    .locator("[id]")
    .evaluateAll((els) => els.map((el) => el.id));
  expect(new Set(ids).size).toBe(ids.length);
  await page
    .getByTestId("comparison-finding-finding-m20-models")
    .locator(".citation button")
    .click();
  await expect(page.getByTestId("paper-paper-mordijck-2020")).toBeVisible();
  await page.goBack();
  await page.getByRole("button", { name: "返回图谱", exact: true }).click();
  await expect(page).toHaveURL(/#q-density$/);
});

test("FRA-02 unknown and absent question IDs have a safe fallback; legacy hashes retain precedence", async ({
  page,
}) => {
  for (const suffix of ["unknown", "p-peaking", ""]) {
    await page.goto("?view=comparison&question=" + suffix);
    await expect(page.getByTestId("comparison-unavailable")).toBeVisible();
    await expect(page.getByTestId("study-comparison")).toHaveCount(0);
    await expect(page.getByTestId("comparison-synthesis")).toHaveCount(0);
    await page.getByRole("button", { name: "返回图谱", exact: true }).click();
    await expect(page.getByTestId("graph")).toBeVisible();
  }
  await page.goto(route + "#q-density");
  await expect(page.getByTestId("detail-title")).toHaveText(
    "密度峰化由什么决定？",
  );
  await expect(page.getByTestId("study-comparison")).toHaveCount(0);
});

for (const language of ["zh", "en"] as const) {
  test(`FRA-02 ${language} direct URL, readable desktop/mobile cards, language persistence and screenshots`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    if (language === "en")
      await page.getByRole("button", { name: "English", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name:
          language === "zh"
            ? "电子密度峰化：跨研究比较"
            : "Electron-density peaking: cross-study comparison",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(".comparison-table thead th")).toHaveText(
      language === "zh"
        ? [
            "研究与证据性质",
            "装置、条件与粒子源",
            "观测量、坐标与平均",
            "方法与工具",
            "原文发现与贡献",
            "假设与适用边界",
          ]
        : [
            "Study and evidence type",
            "System, conditions and particle source",
            "Observable, coordinate and averaging",
            "Methods and tools",
            "Source findings and contributions",
            "Assumptions and applicability limits",
          ],
    );
    await expect(page.locator(".comparison-table thead")).toBeVisible();
    await page.screenshot({
      path: screenshots + `/FRA-02-comparison-${language}-desktop.png`,
      fullPage: true,
    });
    await page.screenshot({
      path: screenshots + `/FRA-02-comparison-${language}-desktop-entry.png`,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(".comparison-table thead")).toBeHidden();
    for (const row of await page.locator(".comparison-table tbody tr").all()) {
      await row.scrollIntoViewIfNeeded();
      await expect(row).toBeVisible();
      const box = await row.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(390);
    }
    await page
      .getByTestId("comparison-finding-finding-m20-tangent-steady")
      .locator("summary")
      .click();
    await expect(
      page
        .getByTestId("comparison-finding-finding-m20-tangent-steady")
        .locator(".reference-entry"),
    ).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: screenshots + `/FRA-02-comparison-${language}-mobile.png`,
      fullPage: true,
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: screenshots + `/FRA-02-comparison-${language}-mobile-entry.png`,
    });
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      language === "zh" ? "zh-CN" : "en",
    );
    await page
      .getByRole("button", {
        name: language === "zh" ? "English" : "中文",
        exact: true,
      })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      language === "zh" ? "en" : "zh-CN",
    );
    await expect(page.locator(".comparison-table tbody tr")).toHaveCount(5);
    await expect(page).toHaveURL(/view=comparison&question=q-density$/);
    expect(errors).toEqual([]);
  });
}
