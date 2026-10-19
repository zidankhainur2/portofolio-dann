import { test, expect } from "@playwright/test";
import { certifications } from "../src/data/certifications";
import { profile } from "../src/data/profile";
import { publications } from "../src/data/publications";

const sections = ["home", "about", "experience", "projects", "research", "contact"];

test("all portfolio content is readable, including without JavaScript", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Zidan Khainur/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const id of sections) await expect(page.locator(`section#${id}`)).toBeVisible();
  await expect(page.locator("#projects article")).toHaveCount(7);
  await expect(page.locator(".flagship-project")).toHaveCount(4);
  await expect(page.locator("#experience article")).toHaveCount(2);
  await expect(page.locator(".stack-group")).toHaveCount(3);
  await expect(page.locator("#research .research-log")).toHaveCount(2);
  await expect(page.locator(".certificate")).toHaveCount(certifications.length);
  for (const certificate of certifications) await expect(page.locator(`#certificate-${certificate.id}`)).toContainText(certificate.title);
  await expect(page.getByRole("heading", { name: "SaveBill", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Download Organizer Pro", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("navigation uses real anchors and keyboard access", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lewati ke konten utama" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  for (const id of sections) {
    await page.getByRole("navigation").locator(`a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    expect(await page.locator(`#${id}`).evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(-1);
  }
});

test("private projects open useful summaries and never expose source links", async ({ page }, testInfo) => {
  await page.goto("/#projects");
  for (const id of ["loghub", "money-note"]) {
    const project = page.locator(`#project-${id}`);
    await expect(project.getByText("Private Build", { exact: true })).toBeVisible();
    await expect(project.locator('a[href*="github.com"]')).toHaveCount(0);
    const summary = project.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    if (testInfo.project.use.javaScriptEnabled === false) {
      await expect(project.locator("details")).toHaveAttribute("open", "");
      await expect(project.locator(".case-study-copy")).toContainText("Source code tidak tersedia untuk publik");
      await page.keyboard.press("Enter");
      await expect(project.locator("details")).not.toHaveAttribute("open", "");
    } else {
      const dialog = project.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText("Source code tidak tersedia untuk publik");
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(summary).toBeFocused();
    }
  }
  await expect(page.locator('#projects .project-body > .project-actions > a[href^="https://github.com/zidankhainur2/"]')).toHaveCount(5);
});

test("supplied and pending material produce only configured destinations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href=""], a[href="#"], a[href*="["]')).toHaveCount(0);
  await expect(page.getByText("Metadata menunggu verifikasi", { exact: true })).toHaveCount(publications.filter((publication) => publication.status === "pending").length);
  if (profile.email) await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute("href", `mailto:${profile.email}`);
  else await expect(page.locator(".contact-pending")).toContainText("Menunggu konfirmasi");
  if (profile.cvPath) {
    const links = page.locator("a").filter({ hasText: /(?:Unduh|Buka) CV/ });
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) await expect(link).toHaveAttribute("href", profile.cvPath);
  } else await expect(page.locator(".pending-action")).toHaveCount(2);
});

test("responsive and reduced-motion layouts do not overflow or hide content", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
  await page.screenshot({ path: testInfo.outputPath("portfolio.png"), fullPage: true });
  await page.goto("/#contact");
  await expect(page.getByRole("heading", { name: /Siap Berkolaborasi/ })).toBeInViewport();
  for (const id of sections) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  await page.setViewportSize({ width: 320, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("the illustrated world preserves content access with or without decoration", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("img")).toHaveCount(0);
  if (page.viewportSize()!.width < 768) {
    for (const selector of [".cloud-mid", ".marine-silhouettes", ".abyss-jellyfish", ".seabed-shell"]) {
      await expect(page.locator(selector)).toBeHidden();
    }
  }
  for (const id of ["about", "experience", "projects", "research", "contact"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    const content = await section.locator(".container").boundingBox();
    expect(content).not.toBeNull();
    for (const edge of await section.locator(".world-edge").all()) {
      const box = await edge.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width <= content!.x || box!.x >= content!.x + content!.width).toBe(true);
    }
    await section.screenshot({ path: testInfo.outputPath(`${id}.png`) });
  }
  await page.locator("#project-loghub summary").click();
  if (testInfo.project.use.javaScriptEnabled === false) {
    await expect(page.locator("#project-loghub details")).toHaveAttribute("open", "");
  } else {
    await expect(page.getByRole("dialog", { name: "LogHub", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  }
  await page.locator(".world-art, .zone-connector svg").evaluateAll((elements) => {
    for (const element of elements) element.setAttribute("style", "display: none !important");
  });
  await expect(page.getByRole("heading", { name: "XLSMART", exact: true })).toBeVisible();
  await expect(page.locator("#projects article")).toHaveCount(7);
  await page.locator("#project-money-note summary").click();
  if (testInfo.project.use.javaScriptEnabled === false) {
    await expect(page.locator("#project-money-note .case-study-copy")).toBeVisible();
  } else {
    await expect(page.getByRole("dialog", { name: "Money-Note", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Tutup detail proyek" }).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
