"use client";

import { Component, useCallback, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { usePortfolioStore } from "@/components/providers/PortfolioProvider";
import type { WorldCanvasProps } from "@/components/canvas/WorldCanvas";

class CanvasErrorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function WorldCanvasBoundary() {
  const reducedMotion = usePortfolioStore((state) => state.reducedMotion);
  const performanceTier = usePortfolioStore((state) => state.performanceTier);
  const activeZone = usePortfolioStore((state) => state.activeZone);
  const [Scene, setScene] = useState<ComponentType<WorldCanvasProps> | null>(null);
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);
  const allowed = !reducedMotion && performanceTier !== "lite";
  const nearScene = activeZone === "home" || activeZone === "about" || activeZone === "projects";

  useEffect(() => {
    if (!allowed || !nearScene || Scene || failed) return;
    let disposed = false;
    void import("@/components/canvas/WorldCanvas").then((module) => {
      if (!disposed) setScene(() => module.WorldCanvas);
    }).catch(() => { if (!disposed) onFailure(); });
    return () => { disposed = true; };
  }, [allowed, nearScene, Scene, failed, onFailure]);

  return (
    <div className="world-canvas-host" aria-hidden="true" data-state={!allowed ? "static" : failed ? "fallback" : Scene ? "loaded" : "loading"}>
      {allowed && !failed && Scene && <CanvasErrorBoundary onFailure={onFailure}><Scene onFailure={onFailure} /></CanvasErrorBoundary>}
    </div>
  );
}
