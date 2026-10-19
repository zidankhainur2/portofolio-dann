"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePortfolioStore } from "@/components/providers/PortfolioProvider";

export function ProjectInteraction({ id, title, accent, featured, header, children }: {
  id: string; title: string; accent: string; featured: boolean; header: ReactNode; children: ReactNode;
}) {
  const selected = usePortfolioStore((state) => state.activeProjectId === id);
  const select = usePortfolioStore((state) => state.setActiveProjectId);
  const articleRef = useRef<HTMLElement>(null);
  useEffect(() => { articleRef.current?.setAttribute("data-interactive", "true"); }, []);
  return (
    <article
      ref={articleRef}
      id={`project-${id}`}
      className={`project-article ${featured ? "flagship-project" : "utility-project"}`}
      aria-labelledby={`${id}-title`}
      data-active={selected}
      style={{ "--project-accent": accent } as CSSProperties}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") select(id); }}
      onFocusCapture={() => select(id)}
      onClick={() => select(id)}
    >
      <div className="project-index">
        {header}
        <button type="button" className="project-select" aria-label={`Pilih proyek ${title}${selected ? " — Dipilih" : ""}`} aria-pressed={selected}>
          {selected ? "Dipilih" : "Pilih"}
        </button>
      </div>
      {children}
    </article>
  );
}
