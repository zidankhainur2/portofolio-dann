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
  await page.locator(".project-banner").first().dispatchEvent("load");
  await expect(page.locator("#projects-title")).toBeInViewport();
  await expect(nav.locator('a[href="#projects"]')).toHaveAttribute("aria-current", "location");
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(nav.locator('a[href="#contact"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#contact-title")).toBeInViewport();
});

test("parallax layers move visibly at different depths without moving the content plane", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 768, "Lite and native modes intentionally stay static.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  const about = page.locator("#about");
  const bounds = await about.evaluate((element) => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height, viewport: innerHeight }));
  const sampleAt = async (progress: number) => {
    const top = Math.round(bounds.top - bounds.viewport + (bounds.height + bounds.viewport) * progress);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), top);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(top, 0);
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    return about.evaluate((element) => {
      const y = (selector: string) => new DOMMatrixReadOnly(getComputedStyle(element.querySelector(selector)!).transform).m42;
      return { far: y(".cloud-far"), mid: y(".cloud-mid"), near: y(".cloud-near") };
    });
  };
  const before = await sampleAt(0.35);
  const after = await sampleAt(0.65);
  const strength = page.viewportSize()!.width >= 1024 ? 1 : 0.5;
  const farTravel = after.far - before.far;
  const midTravel = after.mid - before.mid;
  const nearTravel = after.near - before.near;
  expect(farTravel).toBeGreaterThan(28 * strength);
  expect(midTravel).toBeGreaterThan(10 * strength);
  expect(farTravel).toBeGreaterThan(midTravel * 2);
  expect(nearTravel).toBeLessThan(-34 * strength);
  await expect(about.locator(".container")).toHaveCSS("transform", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await testInfo.attach("parallax-travel.json", { body: JSON.stringify({ viewport: page.viewportSize(), before, after, farTravel, midTravel, nearTravel }), contentType: "application/json" });
  await page.screenshot({ path: testInfo.outputPath("parallax-about.png") });
  const returned = await sampleAt(0.35);
  expect(returned.far).toBeCloseTo(before.far, 0);
  expect(returned.mid).toBeCloseTo(before.mid, 0);
  expect(returned.near).toBeCloseTo(before.near, 0);
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
    await expect(page.locator(".cloud-near")).toHaveCSS("transform", "none");
    await expect(page.locator("#about")).toHaveCSS("--environment-opacity", "");
    await expect(page.locator(".connector-plane-1").first()).toHaveCSS("transform", "none");
    await expect(page.locator(".research-grid")).toHaveCSS("opacity", "1");
    await page.getByRole("navigation").getByRole("link", { name: "Research", exact: true }).click();
    await expect(page.locator("#research-title")).toBeInViewport();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(root).toHaveAttribute("data-motion", "ready");
    await expect(root).toHaveClass(/lenis/);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(root).toHaveAttribute("data-motion", "static");
  await expect(root).toHaveCSS("scroll-behavior", "auto");
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

test("all connectors scrub reversibly while the contact surface stays still", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 768, "Static paths retain authored connectors.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  await page.mouse.move(0, 0);
  for (const variant of ["atmosphere", "cave", "flooded", "deep", "shore"]) {
    const connector = page.locator(`.connector-${variant}`);
    const sample = async (progress: number) => {
      const top = await connector.evaluate((element, progress) => {
        const rect = element.getBoundingClientRect();
        return Math.round(scrollY + rect.top - innerHeight + (rect.height + innerHeight) * progress);
      }, progress);
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), top);
      // WebKit exposes nested SVG transforms through the SVG matrix, not computed CSS.
      const translation = () => connector.locator(".connector-plane-2").evaluate((element) => (element as SVGGraphicsElement).transform.baseVal.consolidate()?.matrix.f ?? 0);
      if (progress > 0.5) await expect.poll(translation).toBeLessThan(0);
      else await expect.poll(translation).toBeGreaterThan(0);
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      return translation();
    };
    const before = await sample(0.3);
    const after = await sample(0.7);
    expect(before).toBeGreaterThan(0);
    expect(after).toBeLessThan(0);
    expect(await sample(0.3)).toBeCloseTo(before, 0);
    await connector.screenshot({ path: testInfo.outputPath(`connector-${variant}.png`) });
  }
  await expect(page.locator(".seabed-contours")).toHaveCSS("transform", "none");
});

test("flagship scroll selection follows both directions and preserves deliberate selection", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 768, "Lite paths use explicit selection.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#project-vymo");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  await page.mouse.move(0, 0);
  const focusProject = async (id: string) => {
    await page.locator(`#project-${id}`).evaluate((element) => {
      const top = scrollY + element.getBoundingClientRect().top - innerHeight * 0.4;
      scrollTo({ top, behavior: "instant" });
    });
    await expect(page.locator(`#project-${id}`)).toHaveAttribute("data-active", "true");
    await expect(page.locator(".showcase-caption")).toHaveText(new RegExp(id, "i"));
    if (page.viewportSize()!.width >= 1024) await expect(page.locator(".project-showcase-anchor")).toBeInViewport();
  };
  for (const id of ["vymo", "loghub", "eventsika", "savebill", "eventsika", "loghub", "vymo"]) await focusProject(id);
  await page.locator("#project-eventsika .project-select").evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
  await expect(page.locator("#project-eventsika")).toHaveAttribute("data-active", "true");
  await page.evaluate(() => scrollBy({ top: -40, behavior: "instant" }));
  await expect(page.locator("#project-eventsika")).toHaveAttribute("data-active", "true");
  await page.locator("#project-eventsika .project-select").evaluate((element) => (element as HTMLElement).blur());
  await focusProject("savebill");
  await page.locator("#project-gridify .project-select").evaluate((element) => (element as HTMLElement).click());
  await expect(page.locator("#project-gridify")).toHaveAttribute("data-active", "true");
  await page.evaluate(() => scrollBy({ top: 20, behavior: "instant" }));
  await expect(page.locator("#project-gridify")).toHaveAttribute("data-active", "true");
  await focusProject("eventsika");
  await expect(page.locator("#projects article")).toHaveCount(7);
});

test("wheel inertia yields to anchors, keyboard input, and dialogs", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "Exercises desktop wheel interpolation.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-motion", "ready");
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about-title")).toBeInViewport();
  await page.mouse.wheel(0, 600);
  await expect(root).toHaveClass(/lenis-smooth/);
  await page.keyboard.press("Home");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await page.locator("#project-loghub summary").focus();
  await page.mouse.wheel(0, 500);
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "LogHub", exact: true });
  await expect(dialog).toBeVisible();
  await expect(root).toHaveClass(/lenis-stopped/);
  const stopped = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - stopped)).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");
  await expect(root).not.toHaveClass(/lenis-stopped/);
});

test("a late motion initialization failure restores the complete static document", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "Exercises the optional desktop lifecycle failure path.");
  await page.addInitScript(() => {
    const query = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function(this: Element, selector: string) {
      if (this.id === "main" && selector === ".flagship-project") {
        Element.prototype.querySelectorAll = query;
        throw new Error("Test-only motion initialization failure");
      }
      return query.call(this, selector);
    } as typeof Element.prototype.querySelectorAll;
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "unavailable");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".cloud-near")).toHaveCSS("transform", "none");
  await expect(page.locator(".connector-plane-1").first()).toHaveCSS("transform", "none");
  await expect(page.locator(".research-grid")).toHaveCSS("opacity", "1");
  await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.locator("#project-loghub summary").click();
  await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#projects article")).toHaveCount(7);
});
