import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  testMatch: /(?:portfolio|project-interactions|research|scroll-experience|accessibility|production|contact)\.spec\.ts/,
  workers: 2,
  outputDir: "test-results/cross-browser",
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/cross-browser" }]],
  use: { ...config.use, launchOptions: {} },
  projects: [
    { name: "firefox", use: { browserName: "firefox", viewport: { width: 1440, height: 1000 } } },
    { name: "webkit", use: { browserName: "webkit", viewport: { width: 1440, height: 1000 } } },
    { name: "webkit-mobile", use: { browserName: "webkit", viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true } },
    { name: "webkit-no-js", use: { browserName: "webkit", viewport: { width: 375, height: 812 }, javaScriptEnabled: false } },
  ],
});
