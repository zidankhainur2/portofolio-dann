"use client";

import { usePortfolioStore } from "@/components/providers/PortfolioProvider";
import { projects } from "@/data/projects";

export function ShowcasePoster() {
  const activeProjectId = usePortfolioStore((state) => state.activeProjectId);
  const project = projects.find((item) => item.id === activeProjectId) ?? projects[0];
  return (
    <div className="project-showcase-anchor" data-scene="showcase" data-project={project.id} aria-hidden="true">
      <svg className="scene-poster" viewBox="0 0 280 240" width="280" height="240" focusable="false">
        <path d="m28 35 220 16-8 140-220-16Z" fill="#37475f" stroke="#8193a1" />
        <path d="m40 49 194 14-6 112-194-14Z" fill="#101c30" />
        <path d="m55 65 40 3-1 10-40-3Z" fill={project.accent} />
        <path d="m60 125 26 2-1 25-26-2Zm43-23 26 2-2 51-26-2Zm43-21 26 2-3 75-26-2Z" fill={project.accent} />
        <path d="m117 184-2 28-46-3-1 8 128 9 1-8-46-3 2-28" fill="#566578" />
      </svg>
      <span className="showcase-caption">{project.title}</span>
    </div>
  );
}
