import { test, expect } from "@playwright/test";
import { projects } from "../src/data/projects";

const projectIds = ["savebill", "eventsika", "loghub", "vymo", "money-note", "gridify", "download-organizer-pro"];

test("hover, focus, and tap select projects without hiding content", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Native disclosures are tested separately.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projects");
  for (const id of projectIds) {
    const article = page.locator(`#project-${id}`);
    const select = article.getByRole("button", { name: /^Pilih proyek/ });
    if (testInfo.project.use.hasTouch) await select.tap();
    else await select.click();
    await expect(select).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.project-select[aria-pressed="true"]')).toHaveCount(1);
    await expect(article).toHaveAttribute("data-active", "true");
    await expect(page.locator(".project-showcase-anchor")).toHaveAttribute("data-project", id);
    await expect(page.locator("#projects article")).toHaveCount(7);
  }
  await page.locator("#project-eventsika summary").focus();
  await expect(page.locator("#project-eventsika")).toHaveAttribute("data-active", "true");
  if (!testInfo.project.use.hasTouch) {
    await page.locator("#project-vymo h3").hover();
    await expect(page.locator("#project-vymo")).toHaveAttribute("data-active", "true");
    await expect(page.locator('.project-showcase-anchor svg path').nth(2)).toHaveAttribute("fill", "#d6bfff");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("project dialogs contain focus, close with Escape, and return to their trigger", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Native disclosures are tested separately.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projects");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const id of ["eventsika", "loghub", "money-note"]) {
    const article = page.locator(`#project-${id}`);
    const trigger = article.locator("summary");
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = article.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveJSProperty("open", true);
    await expect(dialog.getByRole("button", { name: "Tutup detail proyek" })).toBeFocused();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    for (let count = 0; count < 3; count++) {
      await page.keyboard.press(count === 1 ? "Shift+Tab" : "Tab");
      expect(await page.evaluate(() => !document.activeElement?.closest("a, summary, button") || !!document.activeElement?.closest("dialog"))).toBe(true);
    }
    if (id !== "eventsika") {
      await expect(dialog).toContainText("menunggu materi yang disetujui");
      const project = projects.find((project) => project.id === id)!;
      await expect(dialog.locator("img")).toHaveCount(0);
      await expect(dialog.getByRole("link")).toHaveCount(project.liveUrl ? 1 : 0);
      if (project.liveUrl) await expect(dialog.getByRole("link")).toHaveAttribute("href", project.liveUrl);
    } else {
      await expect(dialog).toContainText("semantic similarity");
      await expect(dialog.getByRole("link", { name: /Lihat Source Code/ })).toHaveAttribute("href", "https://github.com/zidankhainur2/eventsika");
    }
    await dialog.screenshot({ path: testInfo.outputPath(`${id}-dialog.png`) });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Tutup detail proyek" }).click();
    await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("the modal pauses Lenis and survives live quality changes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "Exercises the desktop scroll lifecycle.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projects");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  await page.locator("#project-loghub summary").click();
  const dialog = page.getByRole("dialog", { name: "LogHub", exact: true });
  await expect(dialog).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  const initialScroll = await page.evaluate(() => scrollY);
  await dialog.hover();
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(initialScroll);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
  await expect(dialog).toBeVisible();
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll + 100);
});

test("selection updates the existing GPU scene and survives WebGL loss", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Exercises the shared desktop canvas.");
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projects");
  const canvas = page.locator('.world-canvas[data-state="ready"]');
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await page.locator(".project-showcase-anchor").scrollIntoViewIfNeeded();
  await page.locator("#project-savebill button").focus();
  await expect(canvas).toHaveAttribute("data-project", "savebill");
  await page.screenshot({ path: testInfo.outputPath("showcase-savebill.png") });
  await page.getByRole("button", { name: "Pilih proyek EventSika", exact: true }).evaluate((button) => (button as HTMLButtonElement).focus({ preventScroll: true }));
  await expect(canvas).toHaveAttribute("data-project", "eventsika");
  await expect(page.locator(".showcase-caption")).toHaveText("EventSika");
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("showcase-eventsika.png") });
  await page.locator("canvas").evaluate((element) => {
    const extension = (element as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Test browser must support WEBGL_lose_context");
    extension.loseContext();
  });
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.locator("#project-vymo button").click();
  await expect(page.locator(".project-showcase-anchor")).toHaveAttribute("data-project", "vymo");
  await expect(page.locator(".project-showcase-anchor .scene-poster")).toHaveCSS("opacity", "1");
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
});

test("without JavaScript, disclosures remain native and selection controls stay hidden", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled !== false, "Tests the unenhanced document.");
  await page.goto("/#projects");
  await expect(page.locator(".project-select:visible")).toHaveCount(0);
  for (const id of ["eventsika", "loghub", "money-note"]) {
    const article = page.locator(`#project-${id}`);
    await article.locator("summary").click();
    await expect(article.locator("details")).toHaveAttribute("open", "");
    await expect(article.locator(".case-study-copy")).toBeVisible();
  }
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});
