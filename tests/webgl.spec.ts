import { test, expect } from "@playwright/test";

test.use({ deviceScaleFactor: 2 });
test.setTimeout(60_000);

test("one shared canvas follows the decorative anchors and respects quality preferences", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Exercises the desktop GPU path and transitions to static rendering.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const host = page.locator(".world-canvas-host");
  const ready = page.locator('.world-canvas[data-state="ready"]');
  await expect(ready).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".planet")).toHaveCSS("background-image", "none");
  const ratio = await page.locator("canvas").evaluate((canvas) => (canvas as HTMLCanvasElement).width / canvas.getBoundingClientRect().width);
  expect(ratio).toBeGreaterThan(1);
  expect(ratio).toBeLessThanOrEqual(1.51);
  await page.screenshot({ path: testInfo.outputPath("planet.png") });
  await page.locator(".connector-atmosphere").scrollIntoViewIfNeeded();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("capsule.png") });
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator("#projects-title")).toBeInViewport();
  await page.locator(".project-showcase-anchor").scrollIntoViewIfNeeded();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("showcase.png") });
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(host).toHaveAttribute("data-state", "static");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".planet")).not.toHaveCSS("background-image", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(ready).toBeVisible({ timeout: 20_000 });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(host).toHaveAttribute("data-state", "static");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("unavailable WebGL keeps the static artwork and project actions", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Simulates unsupported desktop WebGL.");
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".world-canvas-host")).toHaveAttribute("data-state", "fallback", { timeout: 20_000 });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".planet")).not.toHaveCSS("background-image", "none");
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
});

test("a lost GPU context restores posters without hiding content", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Exercises real WebGL context loss.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator('.world-canvas[data-state="ready"]')).toBeVisible({ timeout: 20_000 });
  await page.locator("canvas").evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext("webgl2");
    const extension = context?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("The test browser must support WEBGL_lose_context");
    extension.loseContext();
  });
  await expect(page.locator(".world-canvas-host")).toHaveAttribute("data-state", "fallback");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".planet")).not.toHaveCSS("background-image", "none");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("reduced motion, mobile, and no JavaScript retain static visuals", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".world-canvas-host")).toHaveAttribute("data-state", "static");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".planet")).not.toHaveCSS("background-image", "none");
  if (page.viewportSize()!.width < 768 && testInfo.project.use.javaScriptEnabled !== false) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator("html")).toHaveAttribute("data-performance-tier", "lite");
    await expect(page.locator("canvas")).toHaveCount(0);
  }
});
