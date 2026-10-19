# PRD — Interactive 3D Parallax Portfolio

**Project:** Zidan Khainur Interactive Portfolio  
**Concept:** Galaxy-to-Abyss Scrollytelling — 2.5D Layered Parallax + Selective React Three Fiber  
**Owner:** Ahmad Fauzidan Yahya Khainur (Zidan)  
**Document:** Product Requirements Document  
**Status:** Implementation-ready draft  
**Primary Audience:** Recruiter, HR, Tech Lead, Engineering Manager

---

## 1. Product Overview

### 1.1 Background

This portfolio is designed as an interactive professional portfolio for **Ahmad Fauzidan Yahya Khainur (Zidan)**, a fresh graduate in Informatics with a primary focus on **Full-Stack Web Development** and **Backend Engineering**.

Instead of using a conventional portfolio layout consisting of a hero section followed by repeated cards, the website uses a **vertical scrollytelling world**. Visitors begin in outer space and progressively descend through the atmosphere, an underground bunker, the ocean, the abyss, and finally reach a bright seabed contact section.

The visual experience combines:

- layered **2.5D illustrations**,
- scroll-based depth and parallax,
- a small number of carefully selected **3D objects**,
- narrative transitions between sections,
- and conventional HTML content that remains readable, accessible, and indexable.

The experience should feel handcrafted, exploratory, cinematic, and technically polished without becoming a graphics demo that hides the actual portfolio content.

---

## 2. Product Goals

### 2.1 Primary Goals

1. Present Zidan's professional profile clearly to recruiters and engineering teams.
2. Demonstrate technical capability through the portfolio experience itself.
3. Highlight real experience in:
   - Backend Engineering at XLSMART.
   - Full-Stack Web Development and AI through Ruangguru MSIB.
4. Showcase seven portfolio projects in a structured and memorable way.
5. Present two SINTA-indexed publications and professional certifications without making the page excessively dense.
6. Preserve strong performance despite the cinematic visual concept.
7. Keep the main content usable on desktop, tablet, and mobile.
8. Provide immediate access to CV, GitHub, LinkedIn, publications, project details, and contact information.

### 2.2 Product Positioning

The portfolio should communicate the following impression:

> A software engineer who can think about backend architecture, full-stack product development, AI integration, and visual product experience as one connected system.

The website should **not** position Zidan only as a visual designer or only as an AI developer. The primary professional identity remains:

**Full-Stack & Backend Engineer**

---

## 3. Target Users

### 3.1 Recruiter / HR

Primary questions:

- Who is Zidan?
- What role is he targeting?
- What professional experience does he have?
- What projects has he completed?
- Is his CV available?
- How can he be contacted quickly?

Expected behavior:

- Scan the hero.
- Review experience.
- Open one or two project cards.
- Download CV.
- Open LinkedIn or contact CTA.

### 3.2 Tech Lead / Engineering Manager

Primary questions:

- What technologies does he actually use?
- Has he worked on production-like systems?
- Can he explain architecture and engineering decisions?
- Are source repositories or case studies available?
- Does he demonstrate engineering depth beyond UI polish?

Expected behavior:

- Inspect technology groupings.
- Read XLSMART and Ruangguru experience.
- Open flagship project details.
- Visit public repositories.
- Review research publications and certifications.

### 3.3 General Professional Visitor

Primary questions:

- What does he build?
- What makes this portfolio different?
- Where can I see his work?

Expected behavior:

- Experience the world-scrolling narrative.
- Explore projects.
- Follow social links.

---

## 4. Experience Principles

### 4.1 Content Before Decoration

Animations must enhance content hierarchy instead of delaying access to information.

### 4.2 Selective 3D

The site must not render the entire world in WebGL. Three.js / R3F is reserved for objects where true 3D materially improves the experience.

### 4.3 Progressive Depth

Each vertical zone should feel deeper than the previous one through:

- movement speed,
- foreground overlap,
- atmospheric effects,
- typography scale,
- contrast,
- soundless visual cues,
- and controlled perspective.

### 4.4 Recruiter-Friendly

Visitors must be able to understand the portfolio even if they:

- scroll quickly,
- disable motion,
- use a low-powered device,
- or never interact with 3D elements.

### 4.5 No “AI-Slop” Visual Language

Avoid generic generated-looking interfaces such as:

- excessive glowing gradients,
- repeated glass cards everywhere,
- random abstract blobs,
- identical bento cards,
- oversized rounded rectangles without visual purpose,
- motion added only for spectacle.

Every visual object should belong to the world narrative.

---

## 5. Information Architecture

The experience is divided into five primary zones plus the final contact surface.

| Zone | Narrative Altitude | Primary Content |
|---|---:|---|
| Zone 1 — Galaxy & Orbit | +10,000 km | Hero, identity, primary CTA |
| Zone 2 — Atmosphere & Clouds | +2,000 m | About, technical stack |
| Zone 3 — Underground Bunker | 0 m | Professional experience |
| Zone 4 — Mid-Ocean | -500 m | Seven portfolio projects |
| Zone 5 — The Abyss | -4,000 m | Publications and certifications |
| Final Surface — White Seabed | Bottom | Contact, social links, CV |

The transitions themselves are part of the product experience and must not feel like abrupt section changes.

---

## 6. Core Features

### 6.1 Vertical World-Slicing Scrollytelling

A single continuous vertical journey connects all portfolio sections.

Requirements:

- Smooth physical-feeling scroll.
- Background colors interpolate based on scroll progress.
- Foreground layers move faster than background layers.
- Section transitions have visual connectors.
- Content remains semantically structured HTML.
- URL remains a single portfolio page for the primary experience.

### 6.2 Selective React Three Fiber Objects

Three main 3D object roles are planned:

1. **Planet / Orbital Object**
   - Hero scene.
   - Subtle pointer response.
   - Rotation linked to scroll progress.

2. **Exploration Capsule**
   - Visual metaphor for descending through the portfolio.
   - Can reposition between zones.
   - Must not block text interaction.

3. **Project Showcase Object**
   - Used in the project section.
   - Responds to active project.
   - Changes material, screen texture, orientation, or content based on project selection.

3D objects are decorative / contextual and must not be required to understand portfolio information.

### 6.3 Interactive Project Showcase

Seven projects are divided into:

#### Flagship Systems

- SaveBill
- EventSika
- LogHub
- VYMO

#### Productivity Apps & Utilities

- Money-Note
- Gridify
- Download Organizer Pro

Interactions:

- Hover / focus changes active project on desktop.
- Tap selects active project on mobile.
- Project detail includes category, stack, description, status, and available actions.
- Public repositories show source links.
- Private projects show case-study / gallery actions instead of source code.

### 6.4 Professional Experience Command Center

The bunker section contains two major experiences:

- XLSMART
- Ruangguru

Experience cards should visually resemble interfaces displayed on workstation monitors rather than floating generic cards.

### 6.5 Research & Certification Vault

Research and certification content is divided into:

- two SINTA publication cards,
- two highlighted BNSP certification cards,
- a filterable Dicoding / industry certification collection.

### 6.6 Contact Surface

The final section must provide:

- primary contact CTA,
- email copy interaction,
- LinkedIn,
- GitHub,
- Instagram,
- Google Scholar / SINTA,
- CV download.

The footer intentionally changes from the dark abyss into a bright white / sand-like surface to create closure.

---

## 7. Functional Requirements

### FR-01 — Scrolling

The page must support:

- mouse wheel,
- touch,
- trackpad,
- keyboard navigation,
- native browser scroll fallback.

### FR-02 — Section Navigation

Optional persistent navigation may expose:

- Home
- About
- Experience
- Projects
- Research
- Contact

Selecting an item should scroll to the corresponding zone.

### FR-03 — CV Download

The CV CTA must:

- be visible from the hero,
- remain available elsewhere through navigation or footer,
- open or download the latest PDF asset.

### FR-04 — Project Actions

Every project must support at least one meaningful action:

- Source Code,
- Live Demo,
- Case Study,
- UI Gallery,
- Architecture View.

### FR-05 — Private Project Handling

For LogHub and Money-Note:

- never expose a fake repository URL,
- label the project as private,
- provide screenshots or a case-study view when available.

### FR-06 — Certificate Preview

Certificate cards may open a modal/lightbox containing:

- image or PDF preview,
- credential title,
- issuer,
- credential ID if available,
- verification URL if available.

### FR-07 — Publication Link

Each research item must provide a route to the authoritative source such as:

- DOI,
- journal page,
- SINTA page,
- Google Scholar record.

### FR-08 — Copy Email

The main contact CTA should copy the configured email address and provide visible confirmation.

### FR-09 — Reduced Motion

When `prefers-reduced-motion: reduce` is enabled:

- disable smooth scroll interpolation,
- remove non-essential parallax,
- stop looping decorative motion,
- preserve all content and navigation.

### FR-10 — Mobile Adaptation

Mobile should use a lighter version of the experience:

- fewer parallax layers,
- simplified particles,
- reduced WebGL resolution,
- no interaction that depends on hover,
- shorter pinned sequences,
- static alternatives when needed.

---

## 8. Non-Functional Requirements

### 8.1 Performance

Target:

- Desktop experience should visually approach 60 FPS during normal scrolling.
- Mobile should prioritize stable interaction over maximum visual fidelity.
- Large visual assets must be lazy-loaded by zone where possible.
- WebGL rendering should be capped to a reasonable device pixel ratio.
- 3D models should use compressed geometry and optimized textures.

### 8.2 Accessibility

Minimum requirements:

- Semantic heading order.
- Keyboard reachable interactive elements.
- Visible focus state.
- Meaningful alt text for content images.
- Decorative layers marked appropriately.
- Adequate contrast for text.
- No essential content encoded only by color or animation.
- Modal focus trapping and ESC close behavior.

### 8.3 SEO

The portfolio must provide:

- descriptive metadata,
- Open Graph metadata,
- structured page title and description,
- crawlable text content,
- project-specific semantic sections,
- clean social preview asset.

### 8.4 Reliability

Failure of any optional visual technology must not make the site unusable.

Examples:

- WebGL unavailable → render static visual fallback.
- JavaScript animation issue → content still flows vertically.
- model loading failure → project cards remain functional.

---

## 9. Performance Modes

### High

For strong desktop hardware:

- all approved parallax layers,
- selective particle systems,
- all R3F objects,
- high-resolution hero visuals.

### Balanced

Default mode:

- standard parallax depth,
- capped DPR,
- reduced particle count,
- lazy-loaded models.

### Lite

For mobile / low-performance devices:

- minimum layered movement,
- static or simplified decorative elements,
- selective 3D disabled where necessary,
- shorter transition sequences.

Automatic quality detection may be implemented, but users should never be trapped behind a benchmarking screen.

---

## 10. Content Scope

The initial release includes:

### Identity

- Name
- Role
- Professional summary
- CV

### Professional Experience

- XLSMART
- Ruangguru / MSIB

### Portfolio Projects

1. SaveBill
2. EventSika
3. LogHub
4. VYMO
5. Money-Note
6. Gridify
7. Download Organizer Pro

### Research

- 2 SINTA-indexed publications

### Certifications

- BNSP — Junior Graphic Designer
- BNSP — Video Editor
- Dicoding / technical certifications

### Contact

- Email
- GitHub
- LinkedIn
- Instagram
- Scholar / SINTA

---

## 11. Out of Scope for Initial Release

The following are not required for V1:

- user accounts,
- CMS dashboard,
- blog publishing system,
- full 3D game controls,
- multiplayer / social features,
- procedural 3D terrain,
- continuous background audio,
- complex physics simulation,
- WebXR / VR mode,
- backend database solely for static portfolio content.

---

## 12. Analytics Events

Recommended events:

- `hero_explore_click`
- `cv_download`
- `nav_section_click`
- `project_open`
- `project_source_click`
- `project_demo_click`
- `private_case_study_open`
- `publication_open`
- `certificate_open`
- `email_copy`
- `linkedin_click`
- `github_click`

Analytics must not interfere with page performance or user privacy.

---

## 13. Success Criteria

The first release is considered successful when:

1. All six narrative surfaces can be traversed smoothly.
2. All primary content is readable without requiring 3D interaction.
3. The seven projects are discoverable and correctly categorized.
4. XLSMART and Ruangguru experience are clearly visible.
5. Both research publications can link to authoritative sources.
6. BNSP and Dicoding certificates can be browsed without an excessively long page.
7. CV and contact actions are reachable within a few seconds.
8. Mobile contains the complete information architecture.
9. Reduced-motion mode remains fully usable.
10. No major scroll jank is present in normal desktop usage.

---

## 14. Acceptance Criteria by Zone

### Zone 1 — Galaxy

- Name and role are immediately visible.
- Primary CTA scrolls to the next narrative region.
- CV action works.
- 3D hero object is non-blocking.

### Zone 2 — Clouds

- About content remains readable over moving artwork.
- Technologies are grouped into meaningful categories.
- Floating items do not become visual clutter.

### Zone 3 — Bunker

- Two professional experience items are clearly separated.
- Role, period, stack, and contribution are visible.
- Monitor / command-center treatment remains readable on small screens.

### Zone 4 — Ocean

- All seven projects are accessible.
- Public and private statuses are visually distinct.
- Active project state synchronizes with the showcase visual.
- Project content is keyboard accessible.

### Zone 5 — Abyss

- Two publication cards are visible.
- BNSP items receive higher visual emphasis.
- Technical certifications are filterable or compactly grouped.

### Contact Surface

- Email copy works.
- Social links work.
- CV remains accessible.
- The visual transition from abyss to light surface feels intentional.

---

## 15. Document Relationships

Implementation should refer to:

- [`DESIGN.md`](./DESIGN.md) for visual rules and interaction behavior.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) for code architecture, rendering strategy, state management, and performance.
- [`CONTENT.md`](./CONTENT.md) for approved copy, project descriptions, and content placeholders.
