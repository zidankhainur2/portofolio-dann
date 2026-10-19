import type { Publication } from "@/types/portfolio";

export function PublicationCard({ publication, index }: { publication: Publication; index: number }) {
  return (
    <article className="research-log" aria-labelledby={`${publication.id}-title`}>
      <p className="eyebrow">RESEARCH LOG / {String(index + 1).padStart(2, "0")}</p>
      {publication.status === "verified" ? <>
        <span className="research-badge">{publication.indexLabel}</span>
        <h3 id={`${publication.id}-title`}>{publication.title}</h3>
        <p className="muted">{publication.journal} · {publication.year}</p>
        <p>{publication.summary}</p>
        <a className="text-link" href={publication.url}>Baca Jurnal Lengkap ↗</a>
      </> : <>
        <span className="pending-label">Metadata menunggu verifikasi</span>
        <h3 id={`${publication.id}-title`}>Publikasi {String(index + 1).padStart(2, "0")}</h3>
        <p>Judul, jurnal, tahun, indeks SINTA, dan ringkasan kontribusi akan ditampilkan setelah dikonfirmasi.</p>
        <span className="pending-note">Tautan publikasi belum tersedia.</span>
      </>}
    </article>
  );
}
