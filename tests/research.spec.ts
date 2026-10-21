import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PublicationCard } from "../src/components/research/PublicationCard";
import { CertificationCard } from "../src/components/research/CertificationCard";
import { certificationFilters, filterCertifications } from "../src/components/research/CertificationCollection";
import type { Certification, Publication } from "../src/types/portfolio";
import { certifications } from "../src/data/certifications";
import { publications } from "../src/data/publications";

const featuredCount = certifications.filter((certificate) => certificate.featured).length;
const technicalCertificates = certifications.filter((certificate) => !certificate.featured);

test("the two supplied papers retain distinct authoritative destinations", async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Data regression only needs one run.");
  const verified = publications.filter((publication) => publication.status === "verified");
  expect(new Set(verified.map((publication) => publication.url)).size).toBe(verified.length);
});

test("research and credentials expose supplied metadata and explicit pending material", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#research");
  const research = page.locator("#research");
  await expect(research.locator(".research-log")).toHaveCount(publications.length);
  for (const publication of publications) {
    const article = research.locator(`article[aria-labelledby="${publication.id}-title"]`);
    if (publication.status === "verified") {
      await expect(article.getByRole("heading")).toHaveText(publication.title);
      await expect(article.getByRole("link")).toHaveAttribute("href", publication.url);
      await expect(article.locator(".research-badge")).toHaveText(publication.indexLabel);
    } else await expect(article.getByRole("link")).toHaveCount(0);
  }
  await expect(research.locator(".featured-certificate")).toHaveCount(featuredCount);
  for (const certificate of certifications) {
    const cardId = page.locator(`#certificate-${certificate.id} .certificate-body > .credential-id`);
    if (certificate.credentialId) await expect(cardId).toHaveText(`ID kredensial: ${certificate.credentialId}`);
    else await expect(cardId).toHaveCount(0);
  }
  await expect(research.getByRole("heading", { name: "Junior Graphic Designer", exact: true })).toBeVisible();
  await expect(research.getByRole("heading", { name: "Video Editor", exact: true })).toBeVisible();
  if (technicalCertificates.length === 0) await expect(research.locator(".credential-empty")).toContainText("sedang disiapkan");
  else await expect(research.locator(".credential-empty")).toBeHidden();
  await expect(research.locator("iframe, object")).toHaveCount(0);
  await research.screenshot({ path: testInfo.outputPath("research-vault.png") });
  await page.setViewportSize({ width: 320, height: 568 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("technical filters support keyboard and touch with clear empty results", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false, "Unenhanced controls stay hidden.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#research");
  const filters = page.getByRole("group", { name: "Filter sertifikasi teknis" });
  for (const { id, label } of certificationFilters) {
    const count = filterCertifications(technicalCertificates, id).length;
    const button = filters.getByRole("button", { name: `${label} (${count})`, exact: true });
    if (testInfo.project.use.hasTouch) await button.tap();
    else { await button.focus(); await page.keyboard.press("Space"); }
    await expect(button).toHaveAttribute("aria-pressed", "true");
    if (!testInfo.project.use.hasTouch) await expect(button).toBeFocused();
    await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator(".credential-results")).toHaveText(`${count} kredensial ditampilkan / ${label}`);
    if (count === 0) await expect(page.locator(".credential-empty")).toBeVisible();
    else await expect(page.locator(".credential-empty")).toBeHidden();
    await expect(page.locator(".featured-certificate")).toHaveCount(featuredCount);
  }
});

test("credential details preserve native access and modal focus behavior", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#research");
  for (const id of ["bnsp-graphic-design", "bnsp-video-editor"]) {
    const data = certifications.find((certificate) => certificate.id === id)!;
    const certificate = page.locator(`#certificate-${id}`);
    const trigger = certificate.locator("summary");
    await trigger.focus();
    await page.keyboard.press("Enter");
    if (testInfo.project.use.javaScriptEnabled === false) {
      await expect(page.locator(".certification-filters")).toBeHidden();
      await expect(certificate.locator("details")).toHaveAttribute("open", "");
      await expect(certificate.locator(".case-study-copy dl")).toContainText(data.credentialId ?? "Menunggu verifikasi");
      await expect(certificate.locator(".case-study-copy")).toBeVisible();
      await page.keyboard.press("Enter");
    } else {
      const dialog = certificate.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText("BNSP");
      await expect(dialog.locator("dl")).toContainText(data.credentialId ?? "Menunggu verifikasi");
      await expect(dialog).not.toContainText("Tidak ada ID atau tautan verifikasi");
      await expect(dialog).toContainText("Detail LSP menunggu verifikasi");
      await expect(dialog).toContainText("Pratinjau sertifikat belum tersedia");
      await expect(dialog.getByRole("button", { name: "Tutup detail kredensial" })).toBeFocused();
      await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Shift+Tab");
      expect(await page.evaluate(() => !document.activeElement?.closest("a, summary, button") || !!document.activeElement?.closest("dialog"))).toBe(true);
      await dialog.screenshot({ path: testInfo.outputPath(`${id}-detail.png`) });
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Enter");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Tutup detail kredensial" }).click();
      await expect(trigger).toBeFocused();
    }
  }
});

test("credential dialogs pause the existing scroll engine", async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.javaScriptEnabled === false || page.viewportSize()!.width < 1024, "Exercises desktop Lenis integration.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#research");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "ready");
  await page.locator("#certificate-bnsp-graphic-design summary").click();
  await expect(page.getByRole("dialog", { name: "Junior Graphic Designer", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact-title")).toBeInViewport();
});

// Fixture records are test-only; no credentials or publication claims enter production data.
test("populated category filtering preserves matching records and order", async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Pure data test only needs one run.");
  const fixtures: Certification[] = [
    { id: "test-fe", title: "TEST Frontend", issuer: "TEST Issuer", category: "frontend", featured: false },
    { id: "test-be", title: "TEST Backend", issuer: "TEST Issuer", category: "backend", featured: false },
    { id: "test-ai", title: "TEST AI", issuer: "TEST Issuer", category: "ai", featured: false },
    { id: "test-fe-2", title: "TEST Frontend 2", issuer: "TEST Issuer", category: "frontend", featured: false },
  ];
  expect(filterCertifications(fixtures, "all")).toEqual(fixtures);
  expect(filterCertifications(fixtures, "frontend").map(({ id }) => id)).toEqual(["test-fe", "test-fe-2"]);
  expect(filterCertifications(fixtures, "backend")).toEqual([fixtures[1]]);
  expect(filterCertifications(fixtures, "ai")).toEqual([fixtures[2]]);
  expect(filterCertifications([], "all")).toEqual([]);
  expect(filterCertifications([fixtures[0]], "backend")).toEqual([]);
  expect(fixtures).toHaveLength(4);
});

test("verified publication fixtures render only supplied metadata and source", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Isolated fixture rendering only needs one run.");
  const fixture: Publication = {
    id: "test-publication", status: "verified", title: "TEST Publication", year: "2026", journal: "TEST Journal",
    indexLabel: "TEST Index", summary: "TEST verified summary", url: "https://example.test/publication",
  };
  await page.setContent(renderToStaticMarkup(createElement(PublicationCard, { publication: fixture, index: 0 })));
  await expect(page.getByRole("article")).toHaveAccessibleName("TEST Publication");
  await expect(page.getByText("TEST Journal · 2026", { exact: true })).toBeVisible();
  await expect(page.getByRole("link")).toHaveAttribute("href", fixture.url);
  await expect(page.locator(".pending-label")).toHaveCount(0);
});

test("certificate fixtures preserve verified IDs, lazy image dimensions, and PDF links", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Isolated fixture rendering only needs one run.");
  const fixture: Certification = {
    id: "test-credential", title: "TEST Credential", issuer: "TEST Issuer", issuerDetail: "TEST Issuing Body",
    category: "backend", featured: false, credentialId: "TEST-ID", verificationUrl: "https://example.test/credential",
    previewAsset: { type: "image", src: "/assets/certificates/test-only.webp", width: 1200, height: 800 },
  };
  await page.setContent(renderToStaticMarkup(createElement(CertificationCard, { certificate: fixture })));
  const content = page.locator(".case-study-copy");
  await page.locator("summary").click();
  await expect(content.locator("dl")).toContainText("TEST-ID");
  await expect(content.locator("dl")).toContainText("TEST Issuing Body");
  await expect(content.getByRole("link", { name: /Verifikasi kredensial/ })).toHaveAttribute("href", fixture.verificationUrl!);
  await expect(content.locator("img")).toHaveAttribute("loading", "lazy");
  await expect(content.locator("img")).toHaveAttribute("width", "1200");
  await expect(content.locator("img")).toHaveAttribute("height", "800");
  await expect(content.locator("img")).toHaveAttribute("alt", "Sertifikat TEST Credential");
  await expect(content.locator(".certificate-preview")).toHaveCSS("aspect-ratio", "1200 / 800");
  await page.setContent(renderToStaticMarkup(createElement(CertificationCard, { certificate: { ...fixture, previewAsset: { type: "pdf", src: "/assets/certificates/test-only.pdf" } } })));
  await page.locator("summary").click();
  const pdf = page.locator(".case-study-copy").getByRole("link", { name: /Buka PDF sertifikat/ });
  await expect(pdf).toHaveAttribute("href", "/assets/certificates/test-only.pdf");
  await expect(pdf).toHaveAttribute("target", "_blank");
  await expect(pdf).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("iframe, object, img")).toHaveCount(0);
});
