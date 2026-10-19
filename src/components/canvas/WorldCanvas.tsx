"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { WorldScene } from "@/components/canvas/WorldScene";
import { usePortfolioStore } from "@/components/providers/PortfolioProvider";
import { projects } from "@/data/projects";

export interface WorldCanvasProps { onFailure: () => void }

export function WorldCanvas({ onFailure }: WorldCanvasProps) {
  const activeProjectId = usePortfolioStore((state) => state.activeProjectId);
  const project = projects.find((item) => item.id === activeProjectId) ?? projects[0];
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return (
    <div className="world-canvas" data-state={ready ? "ready" : "loading"} data-project={project.id}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1000], zoom: 1, near: 0.1, far: 3000 }}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        fallback={null}
      >
        <Suspense fallback={null}><WorldScene onReady={onReady} onFailure={onFailure} projectAccent={project.accent} /></Suspense>
      </Canvas>
    </div>
  );
}
