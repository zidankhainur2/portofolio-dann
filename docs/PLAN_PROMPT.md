# Portfolio — Planning Instructions

You are the senior frontend engineer and technical architect for this project.

## Mode

**PLAN MODE ONLY.**

Do not implement, edit, create, delete, install, or refactor anything.

You may inspect the repository and run non-destructive commands required to understand the codebase.

Your task ends after producing an implementation plan.

---

## 1. Read the Project Documentation

Before planning, read:

- `PRD.md`
- `DESIGN.md`
- `ARCHITECTUR.md`
- `CONTENT.md`

Treat them as the primary source of truth.

Do not rely only on assumptions from this file.

Understand:

- product goals,
- visual direction,
- content structure,
- 2.5D layering,
- scrollytelling behavior,
- selective R3F architecture,
- performance requirements,
- responsive behavior,
- accessibility requirements.

---

## 2. Inspect the Repository

Inspect the actual repository before proposing architecture.

Determine:

- whether Next.js is already initialized,
- package manager,
- Next.js / React versions,
- TypeScript configuration,
- Tailwind setup,
- existing dependencies,
- existing source structure,
- existing components,
- assets,
- reusable code,
- current lint/build setup.

Also check whether these are already installed:

- GSAP
- Lenis
- Three.js
- React Three Fiber
- `@react-three/drei`
- Zustand

Do not modify anything.

---

## 3. Intended Technical Direction

The target stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- `@react-three/drei`
- Zustand

The main architecture is:

**Hybrid Dual-Layer Architecture**

### DOM / CSS Layer

Responsible for:

- semantic content,
- portfolio copy,
- 2.5D illustrations,
- environmental layers,
- UI,
- project content,
- experience content,
- research content,
- accessibility,
- SEO.

### Selective R3F Layer

Reserved for objects where true 3D provides meaningful value:

- Planet
- Exploration Capsule
- Project Showcase Object

Do not propose building the entire portfolio in WebGL.

---

## 4. Narrative Structure

The website follows this vertical journey:

1. Galaxy & Orbit
   - Hero
   - identity
   - CV
   - primary links

2. Atmosphere & Clouds
   - About
   - Tech Stack

3. Underground Bunker
   - XLSMART
   - Ruangguru / MSIB

4. Mid-Ocean
   - SaveBill
   - EventSika
   - LogHub
   - VYMO
   - Money-Note
   - Gridify
   - Download Organizer Pro

5. The Abyss
   - SINTA publications
   - BNSP certifications
   - Dicoding certifications

6. White Seabed
   - Contact
   - social links
   - CV

Use the detailed content from `CONTENT.md`.

Never invent missing project links, DOI, credentials, statistics, or publication metadata.

---

## 5. Architecture Principles

The plan must preserve these principles.

### Content First

The website must remain understandable when:

- animations fail,
- WebGL is unavailable,
- reduced motion is enabled,
- the visitor uses mobile.

### Selective 3D

Use WebGL only when it meaningfully improves the experience.

### Server Components First

Static content should remain Server Components where practical.

Use Client Components only for actual interaction or animation needs.

### Performance

Plan for:

- optimized image formats,
- lazy loading,
- controlled DOM layers,
- capped WebGL DPR,
- compressed models,
- mobile degradation,
- reduced-motion support.

### Visual Direction

Avoid generic AI-generated portfolio patterns:

- repeated glass cards,
- excessive neon,
- random gradients,
- identical bento cards,
- generic SaaS layouts,
- unnecessary rounded containers.

The UI should belong to the narrative environment.

---

## 6. Plan the Implementation in Phases

Create a phased roadmap.

Use this as a starting point, but adjust it based on the actual repository:

1. Repository/Foundation
2. Content & Data Architecture
3. Base Responsive Zone Layout
4. 2.5D World Construction
5. GSAP + Lenis Scrollytelling
6. Selective React Three Fiber
7. Project Interactions
8. Research & Certification UI
9. Accessibility & Performance
10. Production QA

Do not create one giant implementation phase.

---

## 7. For Each Phase Define

For every phase include:

### Goal

What the phase achieves.

### Tasks

Specific implementation tasks.

### Files / Areas

Expected files or directories involved.

Only reference existing files as existing if you actually verified them.

### Dependencies

What must be completed first.

### Validation

How completion should be tested.

### Exit Criteria

Clear definition of done.

---

## 8. Plan State Ownership Carefully

Explain which state belongs in:

### React local state

For local UI behavior.

### Zustand

For meaningful cross-component state such as:

- active zone,
- active project,
- performance tier.

### GSAP / refs

For continuous scroll animation values.

### R3F refs / `useFrame`

For frame-by-frame 3D transformations.

Do not propose updating global React state on every animation frame.

---

## 9. Plan the Motion Responsibilities

Define clear ownership.

### CSS

Simple hover and micro-transitions.

### GSAP

Animation orchestration and parallax.

### ScrollTrigger

Section progress, activation, and limited pinning.

### Lenis

Smooth scrolling.

### R3F

3D interpolation and scene behavior.

Avoid multiple systems fighting over the same property.

---

## 10. Responsive Planning

Explicitly define behavior for:

- desktop,
- tablet,
- mobile.

Mobile must be a simplified rendering of the same experience, not just a scaled desktop page.

Determine which effects should be:

- preserved,
- reduced,
- disabled,
- replaced with static fallbacks.

Pay special attention to:

- R3F,
- parallax,
- particles,
- pinning,
- foreground layers,
- hover interactions.

---

## 11. Identify Risks

Include real technical risks and mitigations.

At minimum inspect:

- Lenis + ScrollTrigger synchronization,
- excessive Client Components,
- scroll performance,
- heavy layered DOM,
- WebGL memory,
- large visual assets,
- mobile GPU limitations,
- sticky/pinned sections,
- accessibility,
- reduced motion.

Use:

| Risk | Impact | Mitigation |
|---|---|---|

---

## 12. Missing Content / Assets

Identify content or assets that are still missing for production.

For example:

- final illustrations,
- GLB models,
- CV,
- exact publication metadata,
- certificate assets,
- private project screenshots,
- live project URLs.

Do not treat missing final assets as blockers if placeholders can safely be used during development.

---

## 13. Recommend the First Execution Batch

After the complete roadmap, define one concrete:

# Recommended First Execution Batch

It should be intentionally limited.

Prefer establishing:

- application foundation,
- semantic section structure,
- typed data models,
- content integration,
- responsive baseline,
- architecture foundation.

Do not start with final 3D or advanced GSAP effects unless the current repository already has the foundation completed.

Specify:

- exact tasks,
- likely files,
- validation,
- definition of done.

This batch will be executed only after I approve the plan.

---

## 14. Output Format

Return:

# Portfolio Implementation Plan

## 1. Repository Assessment

## 2. Architecture Interpretation

## 3. Proposed Project Structure

## 4. Implementation Phases

## 5. Scroll & Animation Strategy

## 6. State Management Strategy

## 7. Responsive Strategy

## 8. Performance Strategy

## 9. Accessibility Strategy

## 10. Risks & Mitigations

## 11. Missing Content / Assets

## 12. Recommended First Execution Batch

## 13. Open Decisions

Only include Open Decisions that genuinely require my input.

For each one, include your recommended default.

---

## Final Rule

Do not implement anything after producing the plan.

End with:

> **Plan complete. No implementation changes were made. Waiting for approval to execute the first batch.**