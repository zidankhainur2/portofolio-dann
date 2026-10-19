import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

test("the complete static document passes automated accessibility checks", async ({ page, browserName }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "axe needs page JavaScript; native semantics and keyboard access have separate coverage.");
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // shortcut: Firefox 157 stalls opening axe's aggregation page; remove legacy mode when that browser regression is fixed.
  if (browserName === "firefox") await expect(page.locator("iframe, frame")).toHaveCount(0);
  const results = await new AxeBuilder({ page }).withTags(tags).setLegacyMode(browserName === "firefox").analyze();
  await testInfo.attach("axe-document.json", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
  expect(results.violations).toEqual([]);
});

test("project and credential details remain accessible when open", async ({ page, browserName }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "axe needs page JavaScript; native disclosures have separate coverage.");
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  if (browserName === "firefox") await expect(page.locator("iframe, frame")).toHaveCount(0);
  for (const id of ["project-eventsika", "project-loghub", "certificate-bnsp-graphic-design"]) {
    const trigger = page.locator(`#${id} summary`);
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const results = await new AxeBuilder({ page }).withTags(tags).setLegacyMode(browserName === "firefox").analyze();
    await testInfo.attach(`axe-${id}.json`, { body: JSON.stringify(results, null, 2), contentType: "application/json" });
    expect(results.violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
});

test("text spacing and 320px reflow preserve content and keyboard controls", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = "* { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.5 !important; } p { margin-bottom: 2em !important; }";
    document.head.append(style);
  });
  const overflow = await page.evaluate(() => [...document.querySelectorAll("header a, h1, h2, h3, h4, .hero-actions, .tech-list, .section-meta, .project-index, .monitor-toolbar")].flatMap((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width && (rect.right > innerWidth + 1 || rect.left < -1) ? [{ element: element.outerHTML.slice(0, 160), left: rect.left, right: rect.right }] : [];
  }));
  expect(overflow).toEqual([]);
  const clippedText = await page.evaluate(() => [...document.querySelectorAll("h1, h2, h3, h4, header a")].flatMap((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const overflow: string[] = [];
    while (walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      if ([...range.getClientRects()].some((rect) => rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1))) overflow.push(walker.currentNode.textContent!);
    }
    return overflow;
  }));
  expect(clippedText).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Tab");
  for (const link of await page.getByRole("navigation").getByRole("link").all()) {
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-width", "3px");
    const box = await link.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
  const trigger = page.locator("#certificate-bnsp-graphic-design summary");
  if (testInfo.project.use.javaScriptEnabled === false) await expect(trigger).not.toHaveAttribute("aria-haspopup");
  await trigger.focus();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
