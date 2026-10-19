"use client";

import { useEffect } from "react";
import { navigation, type ZoneId } from "@/data/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import type { PortfolioStore } from "@/store/portfolioStore";

export function ScrollExperience({ store }: { store: PortfolioStore }) {
  const reducedMotion = useReducedMotion();
  const performanceTier = usePerformanceTier();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const root = document.documentElement;
    const zones = navigation.map((zone) => ({ id: zone.id, element: document.getElementById(zone.id) }));
    let disposed = false;
    let frame = 0;
    let stopMotion: (() => void) | undefined;
    store.setState({ reducedMotion, performanceTier });
    root.dataset.performanceTier = performanceTier;

    const syncActiveZone = () => {
      let activeZone: ZoneId = "home";
      for (const zone of zones) {
        if (zone.element && zone.element.getBoundingClientRect().top <= window.innerHeight * 0.4) activeZone = zone.id;
      }
      store.getState().setActiveZone(activeZone);
    };
    const scheduleSync = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; syncActiveZone(); });
    };
    const stopNativeTracking = () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
      main.removeEventListener("toggle", scheduleSync, true);
      cancelAnimationFrame(frame);
      frame = 0;
    };
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("pageshow", scheduleSync);
    main.addEventListener("toggle", scheduleSync, true);
    syncActiveZone();

    if (reducedMotion || performanceTier === "lite") {
      root.dataset.motion = "static";
    } else {
      root.dataset.motion = "loading";
      void import("@/lib/animation/scrollExperience").then(({ startScrollExperience }) => {
        if (disposed) return;
        stopMotion = startScrollExperience(main, syncActiveZone);
        stopNativeTracking();
        root.dataset.motion = "ready";
        syncActiveZone();
      }).catch(() => {
        if (!disposed) root.dataset.motion = "unavailable";
      });
    }

    return () => {
      disposed = true;
      stopNativeTracking();
      stopMotion?.();
      delete root.dataset.motion;
      delete root.dataset.performanceTier;
    };
  }, [store, reducedMotion, performanceTier]);

  return null;
}
