# Local QA and production release gates

Phase 9 baseline and Phase 10 local production QA, recorded 2026-10-19. The Phase 9 figures below are historical lab observations; the Phase 10 section records subsequent content and recovery changes. This is not production sign-off.

## Changes and regression checks

- Fixed label/name mismatches on the `zk` wordmark and the selected project button. Visible labels are now represented in accessible names.
- Navigation and monitor toolbars wrap at narrow widths. Long headings can reflow instead of being clipped when visitors increase text spacing.
- Dialog triggers advertise a dialog only after hydration. Without JavaScript they remain ordinary native disclosures.
- Browser data-saving preferences select Lite mode before optional animation or 3D imports. Live changes tear down/resume the existing engines; unsupported browsers retain the responsive default. No hardware fingerprinting, benchmark screen, analytics, or persistent preference is added. The optional API follows the [Save Data specification](https://wicg.github.io/savedata/).
- Added development-only axe scans for the complete static document and open project/credential dialogs. The scans include WCAG A/AA tags through 2.2 plus best-practice rules, without rule exclusions.
- Added 320px reflow, increased text-spacing, visible keyboard-focus, data-saver lifecycle, and initial script-size regression checks. Native no-JavaScript behavior remains covered separately because axe's in-page engine requires JavaScript.
- Preserved concurrently supplied credential records and their featured/category choices. Content-count tests now follow the data module instead of assuming only two credentials. All ten current records are featured, so the nonfeatured technical collection remains empty; confirm that editorial choice before release.

Automated scans do not establish WCAG conformance. Review the attached `incomplete` results, and manually check contrast over artwork, reading order, announcements, zoom, and real assistive technology. See the [Playwright accessibility-testing guidance](https://playwright.dev/docs/accessibility-testing).

## Initial script budgets

Tests measure completed same-origin production JavaScript resources using Resource Timing after the page's rendering tier is ready. They measure the initial hero load, not every future gallery/model download or all interactions. The local server serves compressed responses. New browser contexts avoid a warm page cache.

| Rendering path | Compressed limit | Decoded limit | Observed baseline, approximate |
| --- | ---: | ---: | ---: |
| Lite / data saver | 180 KiB | 600 KiB | 143 KiB compressed / 474 KiB decoded |
| Balanced | 512 KiB | 2 MiB | 430 KiB compressed / 1.47 MiB decoded |

These are regression caps with headroom, not speed or frame-rate claims. Data saver avoids the optional animation/3D payload on a fresh load; switching after download cannot recover already transferred bytes. Mobile and reduced motion retain their existing static behavior. The canvas remains single, demand-driven, capped at DPR 1.5, and noninteractive.

Adding approved images or GLBs requires separate asset-size/loading checks and fresh profiling. Do not simply raise the limits to accommodate an unexplained regression.

## Local Lighthouse snapshot

Production build: Next.js 16.4.2, React 19.3.1, Node.js 24.19.0 on Windows. Lighthouse 13.5.0 used the installed Playwright Chromium with SwiftShader, the desktop preset or default mobile simulation, and only performance/accessibility categories. URL: `http://127.0.0.1:3101/`. One run per profile, no production CDN or field traffic, and no concurrent browser suite.

| Profile | Performance | Accessibility | FCP | LCP | Total blocking time | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop / Balanced | 100 | 100 | 0.3 s | 0.5 s | 10 ms | 0 |
| Mobile / Lite | 94 | 100 | 1.1 s | 2.3 s | 210 ms | 0 |

Neither run reported a runtime error or audit warning. Mobile blocking time still warrants rechecking with final assets and real hardware; a single lab run is not a field INP or sustained scrolling/FPS measurement. Accessibility scores cover the audited initial state, not every user flow. [Lighthouse usage and limitations](https://github.com/GoogleChrome/lighthouse).

## Reproduce

```sh
npm run lint
npm run typecheck
npm run build
npm test
```

For a focused check after building:

```sh
npm test -- tests/accessibility.spec.ts tests/performance.spec.ts --workers=2
npx playwright show-report
```

The HTML report under `playwright-report/` retains axe JSON and script-budget attachments for passing tests too, along with screenshots/traces where configured. It never opens automatically. Both `playwright-report/` and `test-results/` are ignored generated output.

For Lighthouse, start the production build on port 3101 in a separate terminal, run the audit commands below, then stop that temporary server. Use Node.js 22.19+ for this Lighthouse version.

```sh
npm run start -- --hostname 127.0.0.1 --port 3101
```

In PowerShell, with Playwright Chromium already installed:

```powershell
$env:CHROME_PATH = node -p "require('playwright').chromium.executablePath()"
npx --yes lighthouse@13.5.0 http://127.0.0.1:3101 --preset=desktop --only-categories=performance,accessibility --chrome-flags="--headless --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader" --output=json --output-path=.next/lighthouse-desktop.json --quiet --no-enable-error-reporting
npx --yes lighthouse@13.5.0 http://127.0.0.1:3101 --only-categories=performance,accessibility --chrome-flags="--headless --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader" --output=json --output-path=.next/lighthouse-mobile.json --quiet --no-enable-error-reporting
```

These commands install no application dependency. Their reports are generated files under `.next/` and can be replaced by a later build. For real-device GPU testing, do not use the software-renderer flags.

## Phase 10: local production QA

- Added an Indonesian 404 page with the correct HTTP status, automatic `noindex`, and a native link back to the portfolio. Global rendering failures offer retry and full-document reload without exposing raw error details. Both recovery paths keep semantic headings and narrow-screen layouts. Recovery links intentionally reload providers/zone observers; no public fault-injection route was added.
- Production tests check title/description/Open Graph basics, document language, every local fragment target, icon content type, immutable generated-script caching, normal runtime/resource errors, and both recovery paths. A test-only browser fault exercises global retry; this is not a simulated hosting/server outage.
- Preserved the newly supplied email, hosted CV, four social URLs, two publication records, and project live URLs. Updated earlier tests that assumed these fields were absent. Credential records and their editorial categories/featured flags remain unchanged.
- Completed the required copy-email action using the native Clipboard API, with a polite success/failure message and the existing mail link as fallback. Copy controls stay hidden without JavaScript. Browser tests replace the clipboard only inside test contexts to verify the exact payload, denial, and missing-API behavior; real OS clipboard integration still needs manual checking.
- Hosted CV actions now explicitly open a PDF in a new tab with `noopener noreferrer`. Cross-origin download attributes are not reliable, so only local CV paths retain `download`.
- Added `npm run test:cross-browser`, using installed Playwright Firefox and WebKit without new dependencies. The separate matrix exercises desktop Firefox/WebKit, touch/mobile WebKit, and JavaScript-disabled WebKit. It reuses the semantic, interaction, accessibility, contact, motion-lifecycle, and production checks. Browser-specific software-GPU assertions and script budgets remain in the Chromium matrix. This is not installed Safari/iOS or real mobile hardware.

Browser-test compatibility findings:

- Firefox 157's automated blank-page/window creation stalled axe's normal result aggregation. The documented [`setLegacyMode`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright#axebuildersetlegacymodelegacymode-boolean--true) avoids that additional page only in Firefox. The same WCAG/best-practice rules still run with no rule exclusions. Legacy mode cannot audit cross-origin frames, so both Firefox scans explicitly assert the document has no frames. Remove this workaround when the browser integration is fixed; adding embeds requires re-evaluating it.
- This Windows WebKit build skipped ordinary links with both Tab and Alt+Tab in an isolated fixture, but included explicit `tabindex="0"` links. The skip link now has explicit zero tabindex so the bypass is available under that default; no positive tabindex or reordered tab sequence is introduced. Tests still enter with an ordinary Tab, without forced focus. Native touch activation does not have to focus buttons; touch filter tests assert selection/results, while keyboard tests still assert focus. Verify full-keyboard-access settings and link traversal in real Safari.
- Mobile WebKit restored its saved initial viewport on Back and reload even when the URL retained the original deep-link fragment. Tests verify the URL and that the current-zone marker matches a visible section, then explicitly navigate to the fragment again. Initial fresh navigation separately checks the deep-link destination. Application code does not override native browser history/scroll restoration. Confirm this experience on real Safari/iOS before release.

### Recorded validation

- `npm run build`, `npm run lint`, and `npm run typecheck`: passed. The home, not-found, and icon routes remain statically prerendered.
- `npm test`: 100 passed, 52 intentional skips, no failures (152 executions across Chromium desktop/tablet/mobile/no-JavaScript).
- `npm run test:cross-browser`: 85 passed, 39 intentional skips, no failures (124 executions across Firefox/WebKit). Skips cover no-JavaScript-inapplicable enhancements, Chromium-only GPU assertions, desktop-only motion lifecycles on mobile, and pure/isolated fixtures already covered in the default matrix.
- Subsequent focused history/motion reruns passed all five applicable Chromium checks (seven skips) and seven Firefox/WebKit checks (five skips) after making the section-marker assertion poll live DOM state instead of capturing a stale href during native scrolling. Full-suite HTML reports were retained with separate focused-run output folders.
- `npm audit --omit=dev --json`: zero production advisories. The previously documented development-only lint-chain advisories have not been force-fixed or suppressed.
- Reviewed mobile contact and desktop recovery screenshots. Passing-test screenshots and axe attachments remain in the generated local reports; no screenshot is an approved production asset.

The Lighthouse figures above were not rerun for Phase 10 and are explicitly historical. Final content/assets and a deployed origin still require fresh performance measurement. Clipboard tests use controlled browser fixtures, not the real OS clipboard; cross-browser engines on Windows do not establish real-device Safari/iOS behavior or WCAG conformance.

### Supplied destination checks

Read-only HTTP checks on 2026-10-19 found:

- The configured [hosted CV](https://zidankhainurshub.vercel.app/cv-dann.pdf) returned HTTP 200 with `application/pdf`. Its content/currency still needs owner approval; it remains hosted externally rather than copied into this repository.
- The first DOI resolves to the matching [2026 gas-detection article](https://ejournal.stmik-time.ac.id/index.php/jurnalTIMES/article/view/892). Both records originally shared this DOI. The matching [2025 sentiment article](https://ejournal.stmik-time.ac.id/index.php/jurnalTIMES/article/view/890) explicitly lists `10.51351/jtm.14.2.2025890`, so only the second URL was corrected. Supplied titles, summaries, years, and index labels were retained. A regression check guards against accidentally sharing one destination again. The journal pages support titles/years/authorship, not an independent verification of the supplied SINTA ranking.
- The configured Scholar URL redirected the HTTP checker to Google sign-in. HTTP 200 after that redirect does not verify a public profile; the owner must confirm the correct public Scholar/SINTA destination.

External URL availability is not asserted in the browser suite: authentication, rate limits, and remote outages should not make local rendering tests nondeterministic. Check every supplied social, source, demo, and credential destination manually before publishing; a successful HTTP status alone does not verify ownership or content.

To reproduce the additional matrix after building:

```sh
npx playwright install firefox webkit
npm run test:cross-browser
```

Run it separately from `npm test`; both own temporary production servers on port 3100. Its HTML report is under `playwright-report/cross-browser/`. Generated reports/screenshots are ignored, not production assets.

## Remaining production gates

- [ ] Approve the supplied email, CV content/currency, social destinations (especially public Scholar), publication index claims, and project demos. Supply credential IDs/LSP details, private case studies, approved previews, and the Ruangguru period. Remaining pending labels are intentional.
- [ ] Confirm featured/category choices for the newly supplied credentials; their titles are retained as supplied, not independently verified.
- [ ] Test actual certificate-image success/failure and PDF destinations when supplied; current isolated fixtures cover markup, not a real asset pipeline.
- [ ] Optimize and profile final illustration/font/GLB assets. Current scenes use development SVG/CSS and lightweight geometry.
- [ ] Test NVDA/VoiceOver announcements, native dialog focus, forced colors, browser zoom, keyboard-only navigation, and touch on real devices.
- [ ] Check installed Chrome, Firefox, and Safari on real devices, including iOS scroll locking, WebGL failure/context loss, reduced motion, and data saver where available. Local browser-engine automation is only part of this gate.
- [ ] Profile sustained scrolling, GPU memory/context disposal, and responsiveness on a modest phone and laptop; review mobile blocking time again.
- [ ] Run deployed HTTPS/CDN performance, link, caching, error-page, and social-preview checks after the deployment target and final metadata are supplied.
- [ ] Recheck dependency advisories. Production audit is clean at this snapshot; five pre-existing high-severity development lint-chain advisories remain documented in the README.

Phase 10's local automation does not close the content, real-device, or deployed-environment gates. The production domain, canonical/sitemap URLs, and final social-preview image remain unset rather than invented. Publishing is not part of this batch, and this document does not approve release while these gates remain open.

## Motion enhancement: 2026-10-20

- Added semantic scenery depth, grouped reveals, five reversible contour transitions, and local fixed-color opacity crossfades. Reading content remains in normal flow; Contact scenery is static. Desktop uses a bounded sticky showcase beside the four flagship projects, without pins or added scroll distance.
- Retained the single Lenis/GSAP ticker lifecycle, native fragments/focus/history and touch scrolling, dialog pause/resume, static mobile/reduced-motion/data-saver modes, and optional import failure recovery. Teardown explicitly restores authored SVG transform attributes as well as GSAP styles.
- Added a provider-scoped mutable progress bridge to the demand-rendered canvas. Planet departure, the atmosphere-only capsule, and project progress update R3F refs without continuous React/Zustand state. A draw-call test verifies that the scene redraws on scrolling and becomes idle after settling.
- Scroll-selected flagship projects follow the 45% viewport line in both directions. Explicit selection survives within a boundary, and focused project controls/dialogs take priority. All seven projects retain their existing controls, content, and destination rules.
- `npm run lint`, `npm run typecheck`, and `npm run build` passed. The final Chromium matrix passed 109 tests with 67 intentional skips (176 executions), including initialization failure after timelines exist, reversible connectors, foreground/background travel direction, sticky showcase visibility, wheel interruption, and preference teardown/restart.
- Initial production JavaScript measured 147,157 bytes compressed / 487,466 decoded for Lite, and 442,499 compressed / 1,550,618 decoded for Balanced (desktop and tablet). These remain below the existing caps. The small increase over the historical baseline includes shared-ref wiring and the added choreography; no dependencies, raster assets, or models were added.
- The restricted Windows session stalled during Playwright-managed server shutdown. Final validation used a separately started production server on port 3100 and a generated config under `.next/` that changes only server reuse and report locations. Repository test configuration is unchanged. Chromium results and embedded audit attachments are retained in `playwright-report/motion/index.html`.
- Firefox crashed creating an empty page inside the restricted sandbox; the same blank-page check passed outside it. Final Firefox/WebKit validation ran outside the sandbox against the same local production server, with browser settings unchanged: 95 passed, 49 intentional skips, zero failures (144 executions). Its report is retained in `playwright-report/cross-browser/index.html`.
- Connector assertions read the SVG transform matrix because WebKit reports `none` through computed CSS for nested SVG paths. The wheel-interruption assertion allows at most one pixel of native scroll rounding when a dialog locks a fractional Firefox offset; it still rejects document scrolling from the 500px wheel input.
- A final focused Chromium rerun of those portable assertions passed all three applicable checks (five intentional skips). Its output is retained under `test-results/motion-followup/`; the complete Chromium and cross-browser HTML reports remain intact.

The historical Lighthouse scores above were not rerun. Screenshot review and local automation do not replace real Safari/iOS, assistive-technology, sustained frame-time, or GPU-memory profiling. Final illustrations/GLBs and publishing remain separate release gates.

## Project banners and credential IDs: 2026-10-20

- All seven supplied project banners now appear in their articles, below the title/subtitle and above the description. They retain the complete image, original aspect ratio, descriptive alt text, intrinsic dimensions, responsive optimized sources, and native lazy loading. Dialogs and the canvas retain their existing content. The source files total 1,089,142 bytes; these are repository assets, not the responsive transfer total.
- Eight supplied credential IDs appear on their cards and in details. Records without IDs retain the pending detail value. Existing featured/category choices, verification destinations, and certificate-preview pending states are preserved. The obsolete blanket claim that no ID was supplied was removed.
- SaveBill's supplied banner is intentionally retained as approved despite its CSV-analysis wording differing from the electricity-bill description. No project copy was rewritten.
- Regression coverage checks every real banner's successful load, dimensions, aspect ratio, optimized source, and 320px reflow across JavaScript/static/native modes. A controlled image-request failure checks reserved space, readable copy, and working actions. Credential assertions distinguish supplied IDs from missing IDs on cards and in native or hydrated details.
- Banner QA exposed native scrolling being interrupted by layout refresh. Motion layout is now activated before ScrollTrigger measures or caches native scroll behavior; initial measurement is synchronous and later layout measurement uses safe refresh. The scoped observer owns size-driven refreshes, ignores subpixel rounding, and replaces redundant image-load/dialog-toggle/font-ready refreshes. ScrollTrigger automatic refresh is disabled within the lifecycle and restored on cleanup. Anchor and keyboard input cancel only active Lenis wheel interpolation; dialog locks are retained. Static modes and open dialogs explicitly override ScrollTrigger's retained inline smooth value.
- Final Chromium matrix: 114 passed, 70 intentional skips, zero failures (184 executions). Coverage includes actual banner loads on desktop/tablet/mobile/no-JavaScript, controlled image failure, supplied and missing credential IDs, native navigation/history, wheel cancellation, preference changes, GPU failure/cleanup, automated accessibility, and script budgets. Reports and screenshots are retained in `playwright-report/banners/index.html` and `test-results/banners/`.
- Initial production JavaScript: Lite 147,268 bytes compressed / 487,989 decoded; Balanced desktop/tablet 442,664 compressed / 1,551,297 decoded. Compared with the preceding motion snapshot, compressed JavaScript increased by 111 bytes for Lite and 165 for Balanced; the existing budget caps are unchanged and pass. No dependencies were added.
- Loading all seven responsive banners in Chromium at DPR 1 transferred 116,190 encoded body bytes at desktop width, 76,436 at tablet width, and 36,770 at mobile width (also 36,770 without JavaScript). These are optimized image bodies after scrolling through every project, not initial-page transfer or decoded pixel-memory measurements. Resource attachments retain each requested width and URL.
- Reviewed desktop and mobile SaveBill article screenshots: full banner, readable title/copy/actions, and no horizontal overflow. Historical Lighthouse scores remain historical; physical devices, assistive technology, and a deployed CDN were not tested in this batch.
- The Firefox/WebKit matrix completed 152 executions: 98 passed and 53 intentional skips; the remaining assertion rejected Firefox rounding a locked offset from 6210.6001px to 6211px. The scroll-lock check now permits at most one pixel, matching the existing wheel-interruption check while still rejecting the 700px input. Its focused Firefox and WebKit rerun passed both applicable checks (two mobile/native skips), with application code unchanged. The full raw report, including the resolved assertion failure, is retained in `playwright-report/banners-cross-browser/index.html`; focused output is under `test-results/banner-dialog-rounding/`.
- `npm run build`, `npm run lint`, and `npm run typecheck` passed. Validation used the same generated server-reuse harness described in the motion notes; Firefox/WebKit ran outside the restricted Windows sandbox. Repository runner configuration remains unchanged. Desktop/mobile credential screenshots were also reviewed; the supplied ID remains readable without overflow.
- A final Chromium rerun of the adjusted dialog assertion passed (one applicable check); targeted ESLint also passed. The complete Chromium matrix was not repeated for this assertion-only change.
