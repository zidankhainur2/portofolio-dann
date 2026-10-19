# Zidan Khainur — Portfolio

A content-first portfolio following a journey from orbit to the abyss. Built with Next.js App Router, React, TypeScript, and Tailwind CSS 4.

## Run locally

Use Node.js 22 or newer and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Validate

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Browser tests start a production server on port 3100 and cover desktop, tablet, mobile, reduced motion, and JavaScript-disabled content. Build before testing. Screenshots and traces from failed tests are under `test-results/`. The HTML report in `playwright-report/` retains audit attachments for passing tests too; open it with `npx playwright show-report`. Reports never open automatically.

`npm start` serves the production build; `npm run test:ui` opens the interactive test runner.

For the additional Firefox/WebKit release checks, build first, then run:

```sh
npx playwright install firefox webkit
npm run test:cross-browser
```

This separate, two-worker matrix covers desktop Firefox, desktop/mobile WebKit, and JavaScript-disabled WebKit. It reuses the production tests and port 3100; do not run it concurrently with `npm test`. Its report is `playwright-report/cross-browser/`. WebKit emulation is not a real Safari/iOS device test.

## Implementation progress

The six semantic sections, seven projects, two professional experiences, technology groups, and credential placeholders are server-rendered. Navigation and expandable project summaries work without JavaScript. Motion and selective 3D are optional enhancements.

Phase 4 adds a static 2.5D world: nebula/orbit artwork, cloud banks, a cave workstation, ocean rays and reef edges, abyss accents, and seabed contours. Five layered SVG connectors join the environments in normal document flow. Artwork is inline SVG/CSS, needs no external download, and remains decorative. `src/components/illustrations/WorldArt.tsx` contains the development illustrations; `src/components/connectors/ZoneConnector.tsx` contains the transition silhouettes; `src/app/world.css` owns their presentation. Foreground edges stay outside the reading plane, and mobile removes nonessential layers.

The browser suite also checks that foreground silhouettes stay clear of content and that disabling decoration preserves project actions. It captures each illustrated zone under `test-results/` for visual review.

Phase 5 adds lazy-loaded GSAP/ScrollTrigger + Lenis motion. One GSAP ticker drives Lenis; ScrollTrigger handles scenery parallax and background tint interpolation. Text remains visible without reveal prerequisites. Touch stays native, and mobile (below 768px) or reduced-motion preferences use the static experience without loading the animation bundle. Changing preferences or crossing the breakpoint destroys the previous engine and restores its styles. Hash links, browser history, keyboard navigation, and focus remain browser-owned; existing wheel inertia is stopped before those actions. Eligible screens use native CSS smooth anchor transitions; Lenis writes wheel updates with explicit instant scroll operations, so the two do not interpolate the same operation.

`PortfolioProvider` creates a scoped Zustand store for discrete active-zone, reduced-motion, and performance-tier state. Navigation alone subscribes to the active zone. Continuous animation values stay inside GSAP and DOM transforms. Balanced is the desktop/tablet default; Lite is the mobile default. Desktop/tablet navigation stays visible while scrolling. The controller refreshes measurements after viewport, content, font, or image layout changes, and removes its ticker, observers, listeners, and timelines on cleanup. If the optional bundle fails, native scrolling and section tracking continue.

Phase 6 adds one transparent React Three Fiber canvas for the planet, exploration capsule, and project showcase instrument. It loads only on eligible desktop/tablet screens when a relevant zone is reached. Mesh refs track decorative DOM anchors and interpolate rotations in `useFrame`; no frame values enter React or Zustand state. Demand rendering stops when transforms settle and objects are offscreen. Balanced DPR is capped at 1.5, without shadows, textures, postprocessing, or continuous ambient loops.

The existing planet artwork and new capsule/showcase SVG posters remain until the renderer is ready. Reduced motion, mobile, JavaScript-disabled browsing, unavailable WebGL, failed bundle downloads, and context loss retain the static experience. Context loss switches to posters for the rest of the page visit; reload to retry. R3F owns geometry/material/renderer disposal; scene listeners and observers are removed on unmount. `src/components/canvas/` owns the renderer, scene, objects, and error boundary. All content stays in the DOM above the canvas, which never receives pointer input.

The objects currently use lightweight geometry. Final compressed GLBs have not been supplied, so there are no fake model URLs or model downloads. Replace the primitive objects with optimized, lazy-loaded models when approved assets are available. The project instrument remains decorative and responds to project selection.

Phase 7 adds shared, discrete project selection through mouse hover, keyboard focus, or an explicit touch-friendly selection button. Selected articles expose a pressed state and text label as well as an accent; all seven articles stay readable. Only the small interaction shells, poster, and canvas subscribe to selection. Project accents live with the typed project data. The existing single 3D instrument and static SVG poster show the selected accent, with a DOM caption naming the project. No additional canvases, textures, or continuous render loops are introduced.

EventSika's supplied case study and the two private project summaries open native modal dialogs after hydration. The browser owns focus containment, Escape dismissal, and background inertness; cleanup restores focus to the triggering summary. Dialogs have a visible close control, a backdrop, bounded native scrolling, and a full-height mobile layout. Public destinations remain available inside the dialog. CSS locks document scrolling, and Lenis pauses while a dialog is open, including when motion is re-enabled during an open dialog. Modal state stays local, separate from shared project selection. Without JavaScript, the same summaries remain ordinary expandable disclosures and selection-only controls stay hidden.

Private dialogs explicitly say the complete case studies, architecture, and UI galleries await approved material. No screenshots, source links, or unsupported implementation claims are fabricated. Add those assets and content only when supplied.

Phase 8 adds the research and certification vault in `src/components/research/`. Publication cards render verified metadata and authoritative links only when provided; the two current records remain explicitly pending. BNSP highlights open credential details, with unverified LSP details, credential IDs, and previews clearly marked as pending. The technical collection uses local category state, pressed filter buttons, result announcements, and a compact grid. Its empty categories show zero records, not invented course titles. All content is server-rendered through small client interaction slots; filters are hidden without JavaScript, where the complete collection and native disclosures remain available.

Project and credential details share `src/components/ui/DetailDisclosure.tsx`, including native modal containment, Escape, close controls, focus restoration, and the existing Lenis pause/resume integration. Local certificate images use dimensioned, lazy-loaded Next.js images with a readable load-error fallback. PDFs open in a new browser tab with an explicit label instead of an embedded viewer, preserving modal keyboard behavior. No certificate previews are currently downloaded because no approved assets have been supplied.

Phase 9 fixes accessible-name mismatches on the wordmark and selected-project control, narrow-screen text-spacing overflow, and the no-JavaScript disclosure's popup semantics. Explicit browser data-saving preferences now use Lite mode on any viewport, avoiding optional motion/3D downloads on a fresh visit. Live changes reuse the existing cleanup/resume behavior. Browsers without the connection API keep the responsive default.

Development-only axe checks cover the static document and open dialogs without suppressing rules. Reflow tests exercise 320px width, increased text spacing, unclipped headings, and visible keyboard focus. Initial JavaScript budgets are 180 KiB compressed / 600 KiB decoded for Lite and 512 KiB compressed / 2 MiB decoded for Balanced. The approximate local baseline is 143 KiB versus 430 KiB compressed. Local Lighthouse measured performance 100 desktop / 94 mobile and accessibility 100 on both; these are single-run lab observations, not WCAG conformance, real-device FPS, or production sign-off. [QA baseline, reproduction commands, and release gates](docs/QA.md).

Browser tests cover deep links, history, reloads, live reduced-motion/viewport changes, wheel scrolling, failed optional downloads, single-canvas/DPR behavior, unavailable WebGL, and real context loss. Project tests add mouse/focus/tap selection, modal keyboard containment and focus return, repeated opening, scroll locking/resumption, responsive dialogs, selection after GPU failure, and no-JavaScript disclosures. Research tests cover pending content, keyboard/touch filters, credential dialog focus and native fallback, scroll-engine integration, populated filtering, and isolated server-rendered publication/image/PDF fixtures. Fixtures are test-only and never enter production data; real certificate loading and image-error behavior still need browser QA once approved assets exist. Axe itself is skipped when page JavaScript is disabled; separate native-content, reflow, and keyboard tests still run there. Test Chromium uses SwiftShader software rendering for deterministic GPU checks; this does not establish real-device performance. Workers are capped at four locally/two in CI to bound software-renderer memory. The next phase is production QA.

Phase 10 adds native 404 navigation, global crash recovery with retry/reload, and production checks for metadata, fragment targets, icon delivery, immutable script caching, and normal runtime/network failures. The new Firefox/WebKit matrix also exercises motion cleanup, dialog scroll locking, keyboard focus, touch, and native no-JavaScript behavior. It does not publish the site.

Newly supplied email, hosted CV, social destinations, publications, and live project URLs are retained. Contact now offers copy-email confirmation and a readable fallback when clipboard permission/API access fails; the mail link remains usable without JavaScript. The hosted CV opens as a PDF in a clearly labelled new tab; only local CV paths use the download attribute. A duplicated publication DOI was corrected from the matching journal's authoritative article page. Current results and unresolved release gates are recorded in [QA.md](docs/QA.md).

Content lives in `src/data/`; editorial sources live in `docs/`. Only supplied destinations are actionable. Verify the current values and fill remaining fields there:

- `profile.ts`: approved email and current hosted CV. A local PDF can instead live under `public/documents/`.
- `socialLinks.ts`: confirm supplied professional/social URLs, especially the public Scholar profile.
- `publications.ts`: supplied metadata and authoritative URLs; verify index claims separately.
- `certifications.ts`: exact credentials, issuer details, and preview assets. Use `featured: true` for highlighted credentials and `false` for the filterable collection. Add only confirmed `issuerDetail`, `credentialId`, and `verificationUrl` values.
- `experiences.ts`: confirmed Ruangguru period.
- `projects.ts`: approved private case studies and optional live URLs.

The configured email in `profile.ts` supersedes the provisional address in `CONTENT.md`. Missing assets do not produce dead links. The current page still needs content approval, final assets, and real-device/deployed QA before production sign-off.

Certificate `previewAsset` is an explicit image/PDF record, not a bare path. Store approved files under `public/assets/certificates/`, then configure either `{ type: "image", src: "/assets/certificates/<approved-file>", width, height }` using the real intrinsic dimensions, or `{ type: "pdf", src: "/assets/certificates/<approved-file>" }`. Omit the field until the actual file exists. External images require a separately reviewed Next.js image configuration; none are enabled here.

Final illustrations, font files, models, social preview imagery, and deployment-domain metadata belong to later batches. No backend, database, CMS, or analytics is required for this foundation.

## Tooling notes

ESLint 9 is pinned because the plugins bundled with the current Next.js lint configuration do not yet declare ESLint 10 support. npm currently reports five high-severity development-tool advisories through the lint configuration's `fast-glob` → `micromatch` → `braces` chain. Its suggested forced fix downgrades the Next.js lint configuration to a different major, so it has not been applied. Update this chain when a compatible fix is available. `npm audit --omit=dev` reports no production dependency advisories at the time of setup.
