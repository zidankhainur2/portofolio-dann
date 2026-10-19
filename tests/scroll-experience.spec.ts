import { test, expect } from "@playwright/test";

test("scroll navigation preserves hashes, history, and the current section", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Native no-JavaScript navigation is covered by the portfolio suite.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projects");
  const root = page.locator("html");
  const mobile = page.viewportSize()!.width < 768;
  await expect(root).toHaveAttribute("data-motion", mobile ? "static" : "ready");
  await expect(root).toHaveCSS("scroll-behavior", mobile ? "auto" : "smooth");
  const nav = page.getByRole("navigation");
  const expectCurrentSectionInView = () => expect.poll(() => nav.evaluate((navigation) => {
    const links = navigation.querySelectorAll('a[aria-current="location"]');
    const href = links.length === 1 ? links[0].getAttribute("href") : null;
    const bounds = href ? document.querySelector(href)?.getBoundingClientRect() : undefined;
    return !!bounds && bounds.bottom > 0 && bounds.top < innerHeight;
  })).toBe(true);
  await expect(nav.locator('a[href="#projects"]')).toHaveAttribute("aria-current", "location");
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(nav.locator('a[href="#about"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#about-title")).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL(/#projects$/);
  // History restores the browser's saved viewport, which need not equal its fragment target.
  await expectCurrentSectionInView();
  await page.reload();
  await expect(root).toHaveAttribute("data-motion", mobile ? "static" : "ready");
  await expect(page).toHaveURL(/#projects$/);
  await expectCurrentSectionInView();
  await nav.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(nav.locator('a[href="#projects"]')).toHaveAttribute("aria-current", "location");
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(nav.locator('a[href="#contact"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("motion tears down and resumes when preferences or viewport change", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "Exercises desktop motion and live transitions to mobile.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const root = page.locator("html");
  const clouds = page.locator(".cloud-far");
  await expect(root).toHaveAttribute("data-motion", "ready");
  await expect(root).toHaveClass(/lenis/);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  await expect(clouds).not.toHaveCSS("transform", "none");
  for (let cycle = 0; cycle < 2; cycle++) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(root).toHaveAttribute("data-motion", "static");
    await expect(root).toHaveCSS("scroll-behavior", "auto");
    await expect(root).not.toHaveClass(/lenis/);
    await expect(clouds).toHaveCSS("transform", "none");
    await expect(page.locator("#about")).toHaveCSS("--zone-tint-opacity", "");
    await page.getByRole("navigation").getByRole("link", { name: "Research", exact: true }).click();
    await expect(page.locator("#research-title")).toBeInViewport();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(root).toHaveAttribute("data-motion", "ready");
    await expect(root).toHaveClass(/lenis/);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(root).toHaveAttribute("data-motion", "static");
  await expect(root).not.toHaveClass(/lenis/);
  await expect(clouds).toHaveCSS("transform", "none");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(root).toHaveAttribute("data-motion", "ready");
  await expect(root).toHaveClass(/lenis/);
});

test("failed optional motion downloads retain native content and navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "The motion bundle is deferred on mobile and without JavaScript.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "unavailable");
  await expect(page.locator(".world-canvas-host")).toHaveAttribute("data-state", "fallback");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.getByRole("heading", { name: "SaveBill", exact: true })).toBeVisible();
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  await expect(page.locator("#projects article")).toHaveCount(7);
});
