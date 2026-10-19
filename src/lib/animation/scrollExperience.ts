import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const parallaxLayers = [
  [".nebula-band", 50], [".orbit-art", -90], [".cloud-far", -28],
  [".cloud-mid", -65], [".sky-sun", -35], [".ocean-rays", -55],
  [".ocean-suspended", -28], [".abyss-haze", -25],
  [".abyss-jellyfish", 40], [".seabed-contours", -20],
] as const;

const tints = [
  ["home", "#070510", "#1e1136"], ["about", "#4a2556", "#d96b62"],
  ["experience", "#231123", "#482236"], ["projects", "#0b1b70", "#050d38"],
  ["research", "#050d38", "#094074"], ["contact", "#b9d2cb", "#ffffff"],
] as const;

export function startScrollExperience(main: HTMLElement, syncActiveZone: () => void) {
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {}, main);
  const lenis = new Lenis({ autoRaf: false, autoResize: false, anchors: false, syncTouch: false });
  let active = true;
  let refreshFrame = 0;
  const tick = (seconds: number) => { if (!document.hidden) lenis.raf(seconds * 1000); };
  const refresh = () => {
    if (!active || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      lenis.resize();
      ScrollTrigger.refresh();
      syncActiveZone();
    });
  };
  // End wheel inertia before the browser handles hash, focus, keyboard, or history navigation.
  const resetInertia = () => lenis.scrollTo(window.scrollY, { immediate: true });
  const onClick = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]')) resetInertia();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (["Tab", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) resetInertia();
  };
  const onToggle = (event: Event) => {
    if (event.target instanceof HTMLDialogElement) {
      if (main.querySelector("dialog[open]")) lenis.stop();
      else lenis.start();
    }
    refresh();
  };
  const resizeObserver = new ResizeObserver(refresh);
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
    main.removeEventListener("load", refresh, true);
    main.removeEventListener("toggle", onToggle, true);
    gsap.ticker.remove(tick);
    unsubscribeScroll();
    context.revert();
    lenis.destroy();
  };

  try {
    context.add(() => {
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: syncActiveZone, onRefresh: syncActiveZone });
      for (const [selector, distance] of parallaxLayers) {
        const layer = main.querySelector(selector);
        if (!layer) continue;
        const displacement = () => distance * (window.innerWidth >= 1024 ? 1 : 0.5);
        gsap.fromTo(layer, { y: () => -displacement() / 2 }, {
          y: () => displacement() / 2,
          ease: "none",
          scrollTrigger: { trigger: layer.closest(".zone"), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        });
      }
      for (const [id, from, to] of tints) {
        gsap.fromTo(`#${id}`, { "--zone-tint": from, "--zone-tint-opacity": 0.1 }, {
          "--zone-tint": to,
          ease: "none",
          scrollTrigger: { trigger: `#${id}`, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    });
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    resizeObserver.observe(main);
    window.addEventListener("resize", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("popstate", resetInertia);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    main.addEventListener("load", refresh, true);
    main.addEventListener("toggle", onToggle, true);
    if (main.querySelector("dialog[open]")) lenis.stop();
    void document.fonts.ready.then(refresh);
    refresh();
    return cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}
