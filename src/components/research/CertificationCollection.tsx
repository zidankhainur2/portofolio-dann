"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Certification } from "@/types/portfolio";

export const certificationFilters = [
  { id: "all", label: "Semua" },
  { id: "frontend", label: "Frontend & React" },
  { id: "backend", label: "Backend & Cloud" },
  { id: "ai", label: "AI & Software Engineering" },
] as const;

type CertificationFilter = typeof certificationFilters[number]["id"];

export function filterCertifications<T extends Pick<Certification, "category">>(items: T[], category: CertificationFilter) {
  return items.filter((item) => category === "all" || item.category === category);
}

export function CertificationCollection({ items }: {
  items: { id: string; category: Certification["category"]; content: ReactNode }[];
}) {
  const [filter, setFilter] = useState<CertificationFilter>("all");
  const collectionRef = useRef<HTMLDivElement>(null);
  const resultsId = useId();
  const visible = filterCertifications(items, filter);
  useEffect(() => { collectionRef.current?.setAttribute("data-interactive", "true"); }, []);
  return (
    <div className="technical-vault" ref={collectionRef}>
      <h4>Dicoding & Technical Certifications</h4>
      <div className="certification-filters" role="group" aria-label="Filter sertifikasi teknis">
        {certificationFilters.map(({ id, label }) => <button type="button" key={id} aria-pressed={filter === id} aria-controls={resultsId} onClick={() => setFilter(id)}>{label} <span>({filterCertifications(items, id).length})</span></button>)}
      </div>
      <p className="credential-results" role="status">{visible.length} kredensial ditampilkan / {certificationFilters.find(({ id }) => id === filter)!.label}</p>
      <div id={resultsId} className="technical-certification-grid">
        {visible.map(({ id, content }) => <div key={id}>{content}</div>)}
        {visible.length === 0 && <p className="credential-empty">{items.length === 0 ? "Daftar sertifikasi, ID kredensial, dan tautan verifikasi sedang disiapkan." : "Belum ada kredensial dalam kategori ini. Pilih Semua untuk melihat koleksi lainnya."}</p>}
      </div>
    </div>
  );
}
