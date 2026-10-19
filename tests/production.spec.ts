import { test, expect } from "@playwright/test";

test("production serves metadata, local assets, and working fragment targets", async ({ page, request }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:3100/") && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /backend engineering/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Zidan Khainur/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  const missingTargets = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => !document.getElementById(decodeURIComponent(href.slice(1)))));
  expect(missingTargets).toEqual([]);
  const icon = await request.get("/icon.svg");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
  const scriptPath = await page.locator('script[src^="/_next/static/"]').first().getAttribute("src");
  expect(scriptPath).toBeTruthy();
  const script = await request.get(scriptPath!);
  expect(script.status()).toBe(200);
  expect(script.headers()["cache-control"]).toContain("immutable");
  if (testInfo.project.use.javaScriptEnabled !== false) {
    await expect(page.locator("html")).toHaveAttribute("data-motion", /^(ready|static|unavailable)$/);
    await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page.locator("#projects-title")).toBeInViewport();
    await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page.locator("#contact-title")).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test("unknown routes return an accessible noindex 404 with a native way home", async ({ page }, testInfo) => {
  const response = await page.goto("/qa-missing-page");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Halaman tidak ditemukan — Zidan Khainur");
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Halaman tidak ditemukan");
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("not-found.png") });
  await page.getByRole("link", { name: "Kembali ke portfolio", exact: true }).click();
  await expect(page).toHaveURL(/\/#home$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ZIDAN");
});

test("uncaught rendering failures offer retry without exposing internal error details", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Error boundary recovery requires hydration.");
  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (query === "(prefers-reduced-motion: reduce)" && !sessionStorage.getItem("qa-render-recovered")) {
        throw new Error("TEST internal render failure — must not be displayed");
      }
      return matchMedia(query);
    };
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Portfolio belum dapat ditampilkan" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("TEST internal render failure");
  await expect(page.getByRole("link", { name: "Muat ulang portfolio" })).toHaveAttribute("href", "/");
  await page.screenshot({ path: testInfo.outputPath("global-error.png") });
  await page.evaluate(() => sessionStorage.setItem("qa-render-recovered", "true"));
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ZIDAN");
});
