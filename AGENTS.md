# Repository Guidelines

## Project Structure & Module Organization

This repository contains the responsive portfolio through Phase 10's local production QA and recovery checks. Keep product requirements in `docs/PRD.md`, visual rules in `docs/DESIGN.md`, approved copy in `docs/CONTENT.md`, technical decisions in `docs/ARCHITECTURE.md`, and validation/release gates in `docs/QA.md`. Local checks are not publishing approval.

The application uses Next.js App Router, TypeScript, and Tailwind CSS 4. Routes and global styles live in `src/app/`, reusable UI in `src/components/`, portfolio records in `src/data/`, types in `src/types/`, hooks in `src/hooks/`, utilities in `src/lib/`, and shared state in `src/store/`. Put future static images and models under `public/assets/` and `public/models/`; keep the CV in `public/documents/`.

Static inline SVG/CSS scenery lives in `src/components/illustrations/`, transitions in `src/components/connectors/`, and their styles in `src/app/world.css`. Keep decoration hidden from assistive technology, noninteractive, and outside the foreground reading plane.

`PortfolioProvider` owns a scoped Zustand store and one `ScrollExperience` lifecycle. Motion loads lazily from `src/lib/animation/scrollExperience.ts` only above the mobile breakpoint and without reduced motion. Lenis uses the GSAP ticker; never add a second RAF driver. Keep continuous progress out of React/Zustand state. Revert GSAP context and destroy listeners, observers, and Lenis on cleanup. Preserve native hash/focus/history behavior and the static fallback.

`usePerformanceTier` also honors the optional browser `connection.saveData` preference. Subscribe/clean up its change event, keep the SSR snapshot Lite, and fall back to viewport defaults when the API is unavailable. Do not add hardware fingerprinting or per-frame quality state. Static modes must not fetch optional motion/3D bundles on initial load.

`WorldCanvasBoundary` mounts one lazy R3F canvas on eligible desktop/tablet views. Canvas objects track `[data-scene]` anchors, use refs and demand invalidation, and stay noninteractive. Keep `#main` as the shared stacking context; avoid creating stacking contexts on `.zone` so content (30) remains above the canvas (20) and foreground edges (35). Retain CSS/SVG posters for static and failure modes. Final GLBs are pending; geometry and material disposal belongs to R3F. Do not add per-section canvases, continuous render loops, or per-frame React state.

`ProjectArticle` keeps content server-rendered through small client interaction shells. Discrete `activeProjectId` synchronizes the selected article, caption/poster, and 3D accent. Projects and credentials share `DetailDisclosure`; keep modal state local, use native `showModal()` for containment and Escape, restore trigger focus, and retain native disclosures without JavaScript. Lenis pauses on dialog toggle and resumes on close. Do not invent private case studies or galleries while approved assets are missing.

Research UI lives in `src/components/research/`. Keep publication cards, credential copy, and metadata server-rendered. `CertificationCollection` receives rendered card slots and owns only local filter state; do not add it to Zustand. Featured credentials stay outside technical filters. Preserve pending/empty states rather than inventing metadata, IDs, or certificate records. Certificate images require actual intrinsic dimensions and lazy loading; PDFs open in the browser instead of an embedded modal viewer. Only configure preview assets after approved files exist under `public/assets/certificates/`.

## Build, Test, and Development Commands

Use Node.js 22+ and npm. Install the pinned dependencies with `npm ci`.

- `npm run dev` starts the development server.
- `npm run build` creates the production build.
- `npm start` serves that build.
- `npm run lint` checks ESLint without rewriting files.
- `npm run typecheck` generates Next.js route types and checks TypeScript.
- `npm test` runs Playwright against a production server on port 3100; build first.
- `npm run test:ui` opens the Playwright test UI.
- `npm run test:cross-browser` runs the separate Firefox/WebKit desktop, mobile, and no-JavaScript release matrix; build first and install its browsers with `npx playwright install firefox webkit`.

Install the test browser once with `npx playwright install chromium`. Keep port 3100 free for the test server.

Run the default and cross-browser suites sequentially because they share port 3100. The cross-browser matrix caps workers at two and writes its report under `playwright-report/cross-browser/`. Chromium-specific GPU and script-budget checks stay in the default matrix. Browser emulation does not replace real Safari/iOS, assistive-technology, or hardware profiling.

## Coding Style & Naming Conventions

Use TypeScript for application code and two-space indentation. Name React components in PascalCase (`GalaxyZone.tsx`), hooks with a `use` prefix (`useReducedMotion.ts`), and data or utility modules in camelCase (`projects.ts`). Keep content in typed data modules instead of embedding large records in JSX. Prefer Server Components; add `"use client"` only for browser APIs, animation, interactive state, or React Three Fiber.

Preserve semantic HTML, keyboard access, visible focus states, reduced-motion behavior, and static fallbacks for WebGL content. Accessible names must include visible control text, including selected labels. Keep narrow layouts compatible with increased text spacing; do not conceal text overflow. Dialog-only ARIA belongs to the hydrated enhancement, not the native no-JavaScript disclosure. Avoid driving per-frame animation through React state.

Keep `ContactEmail` state local, retain its server-rendered mail link, and hide the copy-only control without hydration. Clipboard rejection/absence must not claim success. Hosted CVs open as labelled PDFs; reserve `download` for local files. Recovery links intentionally reload the document to reset providers and zone observers. Global error UI must not expose raw exception details or depend on the failed provider tree. Use the installed Next.js guide's `retry` prop for recovery.

## Testing Guidelines

Playwright browser tests live in `tests/`. Projects cover desktop (1440px), tablet (768px), mobile (375px), and JavaScript-disabled mobile. Test user-visible behavior: content completeness, anchors, keyboard access, private project details, pending destinations, reduced motion, current-section tracking, history, and animation failure/cleanup. GPU tests cover one canvas, capped DPR, unavailable WebGL, context loss, and static modes. Project tests cover hover/focus/tap selection, modal focus/close/return, scroll locking/resumption, and native disclosures. Research tests cover filters, empty states, credential dialogs, native fallbacks, populated filtering, and isolated publication/preview markup fixtures; test-only records never enter application data. Real preview loading/error behavior needs browser QA when approved assets arrive. Desktop-only motion/GPU and isolated fixture tests intentionally skip other projects. Chromium uses software rendering; local/CI workers are limited to four/two. No coverage percentage is mandated.

Accessibility tests use development-only axe with WCAG tags through 2.2 and best-practice rules. Do not silence rules to pass; review violations and incomplete results. Axe requires page JavaScript, so no-JavaScript behavior uses separate native/reflow/keyboard checks. Performance tests cap initial script transfer at 180 KiB compressed / 600 KiB decoded for Lite and 512 KiB compressed / 2 MiB decoded for Balanced, and cover data-saver transitions and unavailable APIs. Explain and measure budget changes. The HTML report retains JSON audit attachments and never opens automatically. Lab scores do not replace manual assistive-technology or real-device GPU profiling.

Firefox 157 automation needs axe's legacy aggregation mode because the extra blank page stalls; retain the explicit no-frames assertion and remove the workaround once fixed. No accessibility rule is disabled. The skip link uses explicit zero tabindex for Windows WebKit's restricted native link traversal; never use positive tabindex or reorder the page's controls. Touch tests should not require Safari to focus tapped buttons. Native history may restore a saved viewport independent of the hash; the current-zone marker must follow visible content.

## Commit & Pull Request Guidelines

This directory has no Git metadata, so no repository-specific commit convention can be inferred. Use short, imperative commit subjects such as `Add semantic project sections`. Pull requests should explain the behavior change, reference the relevant planning document or issue, list validation performed, and include desktop and mobile screenshots for visual changes. Call out accessibility, performance, and asset-size effects.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
