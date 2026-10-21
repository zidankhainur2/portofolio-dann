import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { navigation, type ZoneId } from "@/data/navigation";
import type { PortfolioStore } from "@/store/portfolioStore";
import type { ConnectorId, MotionRef } from "@/types/motion";

// Positive travel counteracts document motion; foreground travels with it.
const depthTravel = { far: 160, background: 100, midground: 40, foreground: -120 };
const scenery: Partial<Record<ZoneId, { strength: number; layers: [string, keyof typeof depthTravel][] }>> = {
  home: { strength: 1, layers: [[".nebula-band", "background"], [".orbital-track", "midground"], [".orbit-art", "foreground"]] },
  about: { strength: 1, layers: [[".cloud-far, .sky-sun", "background"], [".cloud-mid", "midground"], [".cloud-near", "foreground"]] },
  experience: { strength: 0.25, layers: [[".bunker-wall", "background"], [".ceiling-pipes", "midground"], [".cave-edge", "foreground"]] },
  projects: { strength: 1, layers: [[".ocean-rays", "background"], [".ocean-suspended, .marine-silhouettes", "midground"], [".ocean-reef", "foreground"]] },
  research: { strength: 0.35, layers: [[".abyss-haze", "background"], [".abyss-jellyfish", "midground"], [".abyss-ridge", "foreground"]] },
};
const connectors: ConnectorId[] = ["atmosphere", "cave", "flooded", "deep", "shore"];
const revealGroups = [".hero-content", ".about-layout", ".stack-grid", ".experience-grid", ".flagship-project", ".utility-grid", ".research-grid", ".certification-grid", ".technical-vault"];

export function startScrollExperience(main: HTMLElement, syncActiveZone: () => void, store: PortfolioStore, motion: MotionRef) {
  gsap.registerPlugin(ScrollTrigger);
  // The scoped observers below own layout refresh; avoid competing automatic refreshes.
  ScrollTrigger.config({ autoRefreshEvents: "none" });
  const context = gsap.context(() => {}, main);
  const lenis = new Lenis({ autoRaf: false, autoResize: false, anchors: false, smoothWheel: true, lerp: 0.1, syncTouch: false });
  const reveals = new Map<HTMLElement, gsap.core.Tween>();
  const svgTransforms = Array.from(main.querySelectorAll<SVGElement>(".world-art svg, .zone-connector path"), (element) => ({
    element, transform: element.getAttribute("transform"), origin: element.getAttribute("data-svg-origin"),
  }));
  let active = true;
  let refreshFrame = 0;
  const tick = (seconds: number) => { if (!document.hidden) lenis.raf(seconds * 1000); };
  const refresh = () => {
    if (!active || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      lenis.resize();
      // Wait for native navigation to settle before measuring the layout.
      ScrollTrigger.refresh(true);
      syncActiveZone();
      motion.current.invalidate?.();
    });
  };
  // Native navigation owns focus, fragments, and history; discard wheel inertia first.
  const resetInertia = () => {
    if (lenis.isScrolling !== "smooth") return;
    lenis.stop();
    lenis.start();
  };
  const onClick = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]')) resetInertia();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (["Tab", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) resetInertia();
  };
  const onFocus = (event: FocusEvent) => {
    if (!(event.target instanceof Node)) return;
    for (const [element, tween] of reveals) {
      if (element.contains(event.target)) tween.progress(1);
    }
  };
  const onToggle = (event: Event) => {
    if (event.target instanceof HTMLDialogElement) {
      if (main.querySelector("dialog[open]")) lenis.stop();
      else lenis.start();
    }
  };
  let previousSize: DOMRectReadOnly | undefined;
  const resizeObserver = new ResizeObserver(([entry]) => {
    const size = entry.contentRect;
    if (!previousSize) { previousSize = size; return; }
    // Fractional layout rounding during scrolling must not restart native navigation.
    if (Math.abs(size.width - previousSize.width) < 1 && Math.abs(size.height - previousSize.height) < 1) return;
    previousSize = size;
    refresh();
  });
  const unsubscribeScroll = lenis.on("scroll", ScrollTrigger.update);
  const cleanup = () => {
    active = false;
    cancelAnimationFrame(refreshFrame);
    resizeObserver.disconnect();
    window.removeEventListener("resize", refresh);
    window.removeEventListener("pageshow", refresh);
    window.removeEventListener("popstate", resetInertia);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
    main.removeEventListener("focusin", onFocus);
    main.removeEventListener("toggle", onToggle, true);
    gsap.ticker.remove(tick);
    unsubscribeScroll();
    context.revert();
    ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });
    // GSAP may leave an identity SVG matrix after reverting; restore authored attributes.
    for (const { element, transform, origin } of svgTransforms) {
      if (transform === null) element.removeAttribute("transform");
      else element.setAttribute("transform", transform);
      if (origin === null) element.removeAttribute("data-svg-origin");
      else element.setAttribute("data-svg-origin", origin);
    }
    reveals.clear();
    motion.current.zones = {};
    motion.current.connectors = {};
    motion.current.projectProgress = 0;
    motion.current.invalidate?.();
    lenis.destroy();
  };

  try {
    context.add(() => {
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: syncActiveZone, onRefresh: syncActiveZone });
      for (const { id } of navigation) {
        const zone = main.querySelector<HTMLElement>(`#${id}`);
        if (!zone) continue;
        const sample = (trigger: ScrollTrigger) => {
          motion.current.zones[id] = trigger.progress;
          motion.current.invalidate?.();
        };
        const timeline = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: { trigger: zone, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true, onUpdate: sample, onRefresh: sample },
        });
        const preset = scenery[id];
        const travel = (distance: number) => Math.sign(distance) * Math.min(Math.abs(distance) * (window.innerWidth >= 1024 ? 1 : 0.5), window.innerHeight * 0.2) * (preset?.strength ?? 0);
        for (const [selector, depth] of preset?.layers ?? []) {
          timeline.fromTo(zone.querySelectorAll(selector), { y: () => -travel(depthTravel[depth]) / 2 }, { y: () => travel(depthTravel[depth]) / 2 }, 0);
        }
        if (id === "home") timeline.fromTo(zone, { "--stars-y": () => `${-travel(depthTravel.far) / 2}px` }, { "--stars-y": () => `${travel(depthTravel.far) / 2}px` }, 0);
        if (id !== "contact") {
          timeline.fromTo(zone, { "--environment-opacity": 0 }, { "--environment-opacity": 0.3, duration: 0.2 }, 0)
            .to(zone, { "--environment-opacity": 0, duration: 0.2 }, 0.8);
        } else timeline.to({}, { duration: 1 }, 0);
        if (id === "experience") {
          timeline.fromTo(zone.querySelectorAll(".practical-light"), { opacity: 0.15 }, { opacity: 1, duration: 0.2 }, 0)
            .to(zone.querySelectorAll(".practical-light"), { opacity: 0.15, duration: 0.2 }, 0.8);
        }
        if (id === "projects") timeline.to(zone.querySelector(".ocean-rays"), { opacity: 0, duration: 0.35 }, 0.65);
        if (id === "research") timeline.fromTo(zone.querySelector(".abyss-haze"), { opacity: 0.4 }, { opacity: 1 }, 0);
      }

      for (const id of connectors) {
        const connector = main.querySelector<HTMLElement>(`.connector-${id}`);
        if (!connector) continue;
        const sample = (trigger: ScrollTrigger) => {
          motion.current.connectors[id] = trigger.progress;
          motion.current.invalidate?.();
        };
        const timeline = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: { trigger: connector, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true, onUpdate: sample, onRefresh: sample },
        });
        for (let index = 0; index < 3; index++) {
          const distance = () => (index + 1) * 8 * (window.innerWidth >= 1024 ? 1 : 0.5);
          timeline.fromTo(connector.querySelector(`.connector-plane-${index}`), { y: distance }, { y: () => -distance() }, 0);
        }
        const capsule = connector.querySelector(".capsule-anchor");
        if (capsule) timeline.fromTo(capsule, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
          .to(capsule, { opacity: 0, duration: 0.2 }, 0.8);
      }

      for (const selector of revealGroups) {
        for (const element of main.querySelectorAll<HTMLElement>(selector)) {
          // Deep-linked and already visible content must not disappear on hydration.
          if (element.getBoundingClientRect().top < window.innerHeight || element.contains(document.activeElement)) continue;
          const tween = gsap.fromTo(element, { opacity: 0, y: selector === ".research-grid" ? 8 : 12 }, {
            opacity: 1, y: 0, duration: 0.35, ease: "power1.out",
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
          });
          reveals.set(element, tween);
        }
      }

      const articles = Array.from(main.querySelectorAll<HTMLElement>(".flagship-project"));
      let boundaries: number[] = [];
      let lastIndex = -1;
      const sampleProject = () => {
        if (!articles.length || !boundaries.length) return;
        const line = window.scrollY + window.innerHeight * 0.45;
        let index = 0;
        for (let item = 0; item < boundaries.length; item++) if (boundaries[item] <= line) index = item;
        const start = boundaries[index];
        const end = boundaries[index + 1] ?? start + articles[index].offsetHeight;
        motion.current.projectProgress = gsap.utils.clamp(0, 1, (line - start) / Math.max(1, end - start));
        motion.current.invalidate?.();
        if (index === lastIndex) return;
        lastIndex = index;
        if (main.querySelector("dialog[open]") || document.activeElement?.closest(".project-article")) return;
        store.getState().setActiveProjectId(articles[index].id.replace("project-", ""));
      };
      ScrollTrigger.create({
        start: 0, end: "max", onUpdate: sampleProject,
        onRefresh: () => {
          boundaries = articles.map((article) => article.getBoundingClientRect().top + window.scrollY - Number(gsap.getProperty(article, "y")));
          sampleProject();
        },
      });
    });
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    resizeObserver.observe(main);
    window.addEventListener("resize", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("popstate", resetInertia);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    main.addEventListener("focusin", onFocus);
    main.addEventListener("toggle", onToggle, true);
    if (main.querySelector("dialog[open]")) lenis.stop();
    ScrollTrigger.refresh();
    return cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}
