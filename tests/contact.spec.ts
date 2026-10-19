import { test, expect } from "@playwright/test";
import { profile } from "../src/data/profile";

test("email keeps its native destination and copies the configured address", async ({ page }, testInfo) => {
  test.skip(!profile.email, "No approved email is configured.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async (text: string) => { document.documentElement.dataset.copiedEmail = text; },
    } });
  });
  await page.goto("/#contact");
  await expect(page.locator(".contact-email")).toHaveAttribute("href", `mailto:${profile.email}`);
  const copy = page.getByRole("button", { name: "Salin email", exact: true });
  if (testInfo.project.use.javaScriptEnabled === false) {
    await expect(copy).toBeHidden();
    return;
  }
  await copy.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-copied-email", profile.email!);
  await expect(page.locator(".copy-status")).toHaveText("Email berhasil disalin.");
  await expect(copy).toBeFocused();
  await page.locator("#contact").screenshot({ path: testInfo.outputPath("contact.png") });
});

test("clipboard denial or absence leaves a useful, honest fallback", async ({ page }, testInfo) => {
  test.skip(!profile.email || testInfo.project.use.javaScriptEnabled === false, "Requires configured email and hydration.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const unavailable of [false, true]) {
    await page.addInitScript((unavailable) => {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: unavailable ? undefined : {
        writeText: async () => { throw new DOMException("TEST permission denied", "NotAllowedError"); },
      } });
    }, unavailable);
    await page.goto("/#contact");
    await page.getByRole("button", { name: "Salin email", exact: true }).click();
    await expect(page.locator(".copy-status")).toContainText("Email tidak dapat disalin otomatis");
    await expect(page.locator(".contact-email")).toHaveAttribute("href", `mailto:${profile.email}`);
  }
});

test("CV actions match local download or hosted-PDF behavior", async ({ page }) => {
  test.skip(!profile.cvPath, "No approved CV is configured.");
  await page.goto("/");
  const links = page.locator("a").filter({ hasText: /(?:Unduh|Buka) CV/ });
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", profile.cvPath!);
    if (profile.cvPath!.startsWith("/")) await expect(link).toHaveAttribute("download", "");
    else {
      await expect(link).not.toHaveAttribute("download");
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toContainText("PDF, tab baru");
    }
  }
});
