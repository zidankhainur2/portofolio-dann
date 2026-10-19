# DESIGN — Visual & Interaction System

**Project:** Zidan Khainur Interactive Portfolio  
**Concept:** Galaxy-to-Abyss 2.5D Scrollytelling  
**Document:** Design & Visual System  
**Status:** Implementation-ready draft

---

## 1. Creative Direction

The portfolio should feel like a **continuous illustrated world**, not a collection of unrelated sections.

Core mood:

- Explorative
- Intelligent
- Handcrafted
- Cinematic
- Technical
- Atmospheric
- Personal

The visual design should combine the clarity of a professional engineering portfolio with the sense of discovery of a vertical exploration experience.

### Core Rule

> The world is decorative. The content is structural.

All professional information must remain understandable even if the visitor ignores the visual narrative.

---

## 2. Narrative Metaphor

The website is a vertical descent.

### Zone 1 — Galaxy & Orbit

Meaning:

- ambition,
- identity,
- possibility,
- first impression.

### Zone 2 — Atmosphere & Clouds

Meaning:

- personality,
- technical ecosystem,
- transition from abstract identity to concrete skills.

### Zone 3 — Underground Bunker

Meaning:

- engineering,
- operational systems,
- real professional work,
- command center.

### Zone 4 — Mid-Ocean

Meaning:

- exploration of completed work,
- projects as discoveries,
- technical depth.

### Zone 5 — The Abyss

Meaning:

- research,
- evidence,
- depth of knowledge,
- credentials.

### Final Surface — White Seabed

Meaning:

- clarity,
- openness,
- contact,
- next journey.

---

## 3. Visual Style

### 3.1 Main Technique

Use a hybrid of:

- layered illustration,
- masked foreground silhouettes,
- CSS / DOM parallax,
- depth blur,
- texture overlays,
- atmospheric particles,
- selective true 3D.

The visual language should resemble an illustrated interactive world rather than a photorealistic WebGL scene.

### 3.2 2.5D Layer Categories

Each zone may contain:

1. Far background.
2. Background environmental silhouettes.
3. Mid-background atmospheric elements.
4. Midground illustration.
5. Content plane.
6. Foreground silhouettes.
7. Transition masks.

Not every zone needs all seven layers.

---

## 4. Color System

### 4.1 Narrative Background Colors

| Zone | Start | End | Purpose |
|---|---|---|---|
| Galaxy | `#070510` | `#1E1136` | Cosmic darkness and nebula |
| Sky | `#4A2556` | `#D96B62` | Purple-to-sunset transition |
| Cave | `#231123` | `#231123` | Enclosed underground environment |
| Ocean | `#0B1B70` | `#050D38` | Deepening blue |
| Abyss | `#050D38` | `#094074` | Bioluminescent depth |
| Seabed / Contact | `#094074` | `#FFFFFF` | Emergence into clean ending |

These are narrative anchors rather than a requirement that every pixel follows a linear gradient.

### 4.2 Functional Colors

Use dedicated semantic colors for:

- primary action,
- text,
- secondary text,
- success / copied state,
- private project status,
- publication accent,
- BNSP highlight,
- focus ring.

Functional UI colors must maintain accessibility independent of environmental colors.

### 4.3 Glow Rules

Glow is reserved for:

- bioluminescent abyss content,
- active monitor UI,
- selected project state,
- small focal accents.

Do not apply glow to every button or card.

---

## 5. Typography

### 5.1 Display / Heading

Preferred direction:

- Clash Display
- Cabinet Grotesk

Fallback strategy should include a robust sans-serif system font.

### 5.2 Body

Preferred:

- Inter
- Plus Jakarta Sans

### 5.3 Type Roles

#### Hero Display

- Uppercase or compact display treatment.
- Very large on desktop.
- Strong tracking control.
- Must remain readable against moving hero artwork.

#### Zone Headline

- Short.
- Narrative.
- May use English to reinforce exploration language.

#### Body

- Comfortable line height.
- Moderate maximum width.
- Avoid long paragraphs inside glass surfaces.

#### Metadata

Use smaller typography for:

- period,
- status,
- credential ID,
- stack labels,
- project category.

---

## 6. Layout System

### 6.1 Container

Recommended content width:

- Wide visual canvas may span viewport.
- Reading content uses a constrained central container.
- Text columns should not become excessively wide.

### 6.2 Zone Height

Zones may exceed `100vh` where content requires narrative pacing.

Recommended behavior:

- Hero: approximately 100–130vh.
- About: approximately 120–160vh.
- Experience: approximately 140–180vh.
- Projects: longest section; content-driven.
- Research: content-driven with atmospheric spacing.
- Footer: approximately 80–120vh depending on transition.

Exact values should be tuned during implementation rather than hard-coded from this document.

### 6.3 Safe Reading Plane

Important content should sit inside a central safe plane that is not obscured by:

- capsule,
- foreground rocks,
- large clouds,
- decorative fish,
- monitor frames,
- particle clusters.

---

## 7. Z-Index System

Use a predictable visual stack.

| Layer | Z-Index | Content |
|---|---:|---|
| Dynamic Background | `0` | Gradient / background interpolation |
| Background Art | `10` | Nebula, stars, far clouds, terrain |
| R3F Canvas | `20` | Planet, capsule, project object |
| Main Content | `30` | Text, buttons, cards |
| Foreground Art | `35` | Rocks, cave edges, coral silhouettes |
| Transition Masks | `40` | Zone connectors / visual wipes |
| Global Navigation / Modal | `50+` | UI requiring top-level interaction |

The R3F layer should default to `pointer-events: none` unless a specific 3D interaction genuinely requires pointer input.

---

## 8. Motion System

### 8.1 Motion Hierarchy

Use three levels:

#### Level 1 — Structural Motion

Required for the narrative:

- scroll-linked background transitions,
- parallax depth,
- zone entry / exit.

#### Level 2 — Interactive Motion

Used to communicate state:

- project focus,
- tab changes,
- hover response,
- modal transitions.

#### Level 3 — Ambient Motion

Optional:

- stars,
- cloud drift,
- subtle fish movement,
- light particles,
- slow object rotation.

If performance becomes unstable, remove Level 3 first.

### 8.2 Parallax Speed Model

Suggested relative behavior:

- far background: `0.05–0.15x`
- background: `0.15–0.30x`
- midground: `0.30–0.55x`
- content: `1.0x`
- foreground: `1.10–1.35x`

These are design ratios, not mandatory literal implementation values.

### 8.3 Scroll-Triggered Entrances

Prefer:

- opacity,
- translate,
- reveal masks,
- subtle scale,
- line / text clipping.

Avoid:

- repeated bouncing,
- large elastic overshoots,
- excessive rotation on text,
- animations that make content difficult to scan quickly.

### 8.4 Reduced Motion

When motion reduction is requested:

- backgrounds change without animated interpolation,
- content appears directly,
- parallax becomes static,
- decorative objects stop continuous rotation,
- smooth scrolling is disabled.

---

## 9. Zone Design Specifications

## 9.1 Zone 1 — Galaxy & Orbit

### Composition

Suggested composition:

- distant star field,
- nebula depth layer,
- large planet or orbital body,
- one capsule / craft accent,
- hero typography in the central reading plane.

### Main Content

- `ZIDAN KHAINUR`
- `FULL-STACK & BACKEND ENGINEER`
- short subheadline
- primary exploration CTA
- CV CTA
- compact social shortcuts

### Interaction

- planet rotates subtly with scroll.
- cursor movement may influence the planet or star field.
- headline has a controlled text reveal.
- CTA initiates smooth scroll.

### Avoid

- too many planets,
- heavy volumetric effects,
- floating UI cards in the hero,
- long biography.

---

## 9.2 Zone 2 — Atmosphere & Clouds

### Composition

- back clouds,
- atmospheric horizon,
- mid clouds,
- tech badges / visual nodes,
- one readable about panel,
- foreground cloud masks.

### About Panel

Glass treatment is acceptable here because it has environmental justification: a floating information pane in the atmosphere.

Rules:

- strong enough blur / contrast for readability,
- limited border glow,
- avoid multiple competing panels.

### Tech Stack

Display as three conceptual groups:

1. Backend & Architecture
2. Frontend & UI
3. Database & AI Integration

Tech labels can feel suspended in space or attached to cloud layers.

---

## 9.3 Zone 3 — Underground Bunker

### Composition

The transition should move from open sky into an enclosed rocky cutaway.

Visual elements may include:

- cave edge silhouette,
- bunker interior,
- workstation desk,
- monitors,
- dim practical lighting,
- cables / equipment accents.

### Experience UI

Professional experience should appear as screens belonging to the bunker.

Primary panels:

- XLSMART
- Ruangguru

Interaction ideas:

- monitor screen powers on when section enters,
- active panel receives subtle scanline or light response,
- content remains real HTML positioned over or inside the visual monitor frame.

### Avoid

- cyberpunk overload,
- unreadable terminal text,
- excessive green “hacker” styling,
- text embedded only inside raster artwork.

---

## 9.4 Zone 4 — Mid-Ocean Project Showcase

### Composition

The ocean should feel wide enough to allow project content to breathe.

Possible environment:

- descending light rays,
- rocks and coral as edge framing,
- project showcase object or exploration pod,
- occasional marine silhouettes,
- particles / bubbles with restrained density.

### Project Layout

#### Flagship Group

Four large project moments:

- SaveBill
- EventSika
- LogHub
- VYMO

Each project should have:

- name,
- category,
- status,
- short description,
- primary stack,
- action.

Desktop may use alternating left / right layouts so the section feels exploratory instead of like a repeated card grid.

#### Utility Group

Three more compact items:

- Money-Note
- Gridify
- Download Organizer Pro

These can use a tighter layout once the primary storytelling sequence has established the main portfolio quality.

### R3F Behavior

The project object may:

- rotate toward active card,
- change screen texture,
- display project colors,
- show simplified app thumbnail,
- reposition subtly.

It should not become an expensive 3D carousel.

---

## 9.5 Zone 5 — The Abyss

### Composition

The deepest zone uses:

- very dark blue,
- large negative space,
- bioluminescent highlights,
- subtle suspended particles,
- distant silhouettes.

The calmer visual rhythm communicates depth and credibility.

### Research Cards

Two large “Research Log” objects.

Visual identity:

- dark glass or solid translucent surface,
- cyan / aquatic bioluminescent accent,
- journal badge,
- metadata,
- title,
- short contribution summary,
- external link.

### Certification Vault

#### BNSP

Give higher visual prominence:

- Junior Graphic Designer
- Video Editor

These may use a different metallic / cyan highlight treatment.

#### Dicoding / Technical Certifications

Use:

- tabs,
- filters,
- compact card grid,
- horizontal browsing,
- modal preview.

Do not render a long unstructured vertical list.

---

## 9.6 Final Surface — White Seabed / Contact

### Visual Goal

Strong contrast with the abyss.

The transition should feel like arriving at a final safe surface rather than suddenly displaying a conventional footer.

### Elements

- collaboration headline,
- availability statement,
- large email capsule,
- social links,
- CV,
- optional small signature / copyright.

### Main Interaction

Clicking the email surface copies the email and gives feedback such as:

`Email copied`

---

## 10. Component Visual Rules

### 10.1 Buttons

Primary:

- high contrast,
- clear border / fill,
- restrained radius,
- strong focus state.

Secondary:

- lower emphasis,
- still readable in environmental backgrounds.

### 10.2 Badges

Use badges only for compact metadata:

- stack,
- category,
- status,
- indexed publication,
- issuer.

Avoid turning every sentence into pills.

### 10.3 Cards

Cards are allowed when content requires grouping, but the shape should respond to its environment.

Examples:

- monitor frame in bunker,
- research log in abyss,
- project instrument panel in ocean.

Avoid reusing one universal rounded glass card for the entire page.

### 10.4 Modal

Used for:

- private project gallery,
- certificate preview,
- architecture / case-study detail.

Requirements:

- focus trap,
- ESC close,
- backdrop,
- close button,
- mobile full-screen behavior where needed.

---

## 11. Responsive Strategy

### Desktop

- full layered world,
- strongest parallax,
- selective 3D,
- alternating project composition.

### Tablet

- fewer foreground overlaps,
- moderate parallax,
- simplified world edges,
- projects retain visual hierarchy.

### Mobile

Prioritize content.

Changes:

- collapse side-by-side layouts,
- reduce background layer count,
- avoid pinned sections that trap scrolling,
- replace hover with tap,
- hide non-essential 3D,
- use static poster fallback where needed,
- simplify certification browsing.

---

## 12. Asset Direction

### 12.1 Illustration Assets

Recommended export strategy:

- WebP / AVIF for raster layers,
- SVG for simple shapes and icons,
- transparent PNG/WebP only where alpha is required.

### 12.2 3D Assets

Use:

- `.glb`,
- compressed geometry where appropriate,
- optimized materials,
- baked lighting where possible,
- limited texture resolution.

### 12.3 Asset Naming

Example:

```text
zone-1-galaxy/
  bg-stars-far.webp
  nebula-mid.webp
  orbit-rocks-front.webp

zone-2-sky/
  cloud-back-01.webp
  cloud-mid-01.webp
  cloud-front-mask.webp
```

Avoid names such as `image1.png`, `final-final.png`, or `asset-new.webp`.

---

## 13. Iconography

Use a consistent icon family for functional UI.

Illustrative environment objects should not use the same visual language as UI icons.

Recommended icon usage:

- external link,
- GitHub,
- LinkedIn,
- copy,
- download,
- lock,
- filter,
- close,
- navigation.

---

## 14. Accessibility Design Rules

- Minimum readable body size on mobile.
- Do not place low-contrast gray text over complex art.
- Every hover interaction must have a focus / touch equivalent.
- Avoid flashing effects.
- Decorative particles must not interfere with focus visibility.
- Text must remain selectable.
- Never render essential paragraphs as image textures.

---

## 15. Design QA Checklist

Before release verify:

- [ ] Hero headline remains readable on common viewport ratios.
- [ ] Foreground artwork never hides primary controls.
- [ ] Each zone has a visually distinct identity.
- [ ] Transition between zones feels continuous.
- [ ] Mobile retains complete content.
- [ ] Reduced motion retains narrative structure.
- [ ] Focus states are visible.
- [ ] Project cards do not look like seven repeated generic templates.
- [ ] Dark-zone text contrast is sufficient.
- [ ] The final contact area provides strong visual closure.

---

## 16. Related Documents

- [`PRD.md`](./PRD.md) — product scope and requirements.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — implementation architecture.
- [`CONTENT.md`](./CONTENT.md) — final copy and content mapping.
