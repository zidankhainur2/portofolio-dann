import { test, expect } from "@playwright/test";

test("production script transfer stays within the rendering-tier budget", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "The native fallback does not execute scripts.");
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const lite = page.viewportSize()!.width < 768;
  await expect(page.locator("html")).toHaveAttribute("data-motion", lite ? "static" : "ready");
  if (!lite) await expect(page.locator('.world-canvas[data-state="ready"]')).toBeVisible({ timeout: 20_000 });
  const scripts = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((entry) => entry.name.includes("/_next/static/") && new URL(entry.name).pathname.endsWith(".js"))
    .map((entry) => {
      const resource = entry as PerformanceResourceTiming;
      return { name: new URL(resource.name).pathname, encoded: resource.encodedBodySize, decoded: resource.decodedBodySize };
    }));
  const totals = scripts.reduce((result, script) => ({ encoded: result.encoded + script.encoded, decoded: result.decoded + script.decoded }), { encoded: 0, decoded: 0 });
  await testInfo.attach("script-budget.json", { body: JSON.stringify({ tier: lite ? "lite" : "balanced", totals, scripts }, null, 2), contentType: "application/json" });
  expect(totals.encoded).toBeGreaterThan(0);
  expect(totals.encoded).toBeLessThan(lite ? 180 * 1024 : 512 * 1024);
  expect(totals.decoded).toBeLessThan(lite ? 600 * 1024 : 2 * 1024 * 1024);
  await expect(page.locator("canvas")).toHaveCount(lite ? 0 : 1);
});

test("data saving avoids optional downloads and responds to live changes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Exercises a desktop switching between rendering tiers.");
  test.setTimeout(60_000);
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { saveData: true });
    Object.defineProperty(navigator, "connection", { value: connection, configurable: true });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-performance-tier", "lite");
  await expect(root).toHaveAttribute("data-motion", "static");
  await expect(root).not.toHaveClass(/lenis/);
  await expect(page.locator("canvas")).toHaveCount(0);
  const bytes = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((entry) => new URL(entry.name).pathname.endsWith(".js"))
    .reduce((total, entry) => total + (entry as PerformanceResourceTiming).encodedBodySize, 0));
  await testInfo.attach("data-saver-script-budget.json", { body: JSON.stringify({ encodedBytes: bytes }), contentType: "application/json" });
  expect(bytes).toBeGreaterThan(0);
  expect(bytes).toBeLessThan(180 * 1024);
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await page.getByRole("button", { name: "Pilih proyek VYMO", exact: true }).click();
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { saveData: boolean } }).connection;
    connection.saveData = false;
    connection.dispatchEvent(new Event("change"));
  });
  await expect(root).toHaveAttribute("data-performance-tier", "balanced");
  await expect(root).toHaveAttribute("data-motion", "ready");
  await expect(page.locator('.world-canvas[data-state="ready"]')).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { saveData: boolean } }).connection;
    connection.saveData = true;
    connection.dispatchEvent(new Event("change"));
  });
  await expect(root).toHaveAttribute("data-performance-tier", "lite");
  await expect(root).toHaveAttribute("data-motion", "static");
  await expect(root).not.toHaveClass(/lenis/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#project-vymo .project-select")).toHaveAttribute("aria-pressed", "true");
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
});

test("browsers without the connection API keep the responsive default", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Only the hydrated quality detector uses browser APIs.");
  await page.addInitScript(() => { Object.defineProperty(navigator, "connection", { value: undefined, configurable: true }); });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const lite = page.viewportSize()!.width < 768;
  await expect(page.locator("html")).toHaveAttribute("data-performance-tier", lite ? "lite" : "balanced");
  await expect(page.locator("html")).toHaveAttribute("data-motion", lite ? "static" : "ready");
  await expect(page.locator("#projects article")).toHaveCount(7);
});
