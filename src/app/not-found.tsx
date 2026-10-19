import type { Metadata } from "next";

export const metadata: Metadata = { title: "Halaman tidak ditemukan — Zidan Khainur" };

export default function NotFound() {
  return (
    <main className="recovery container" id="main" tabIndex={-1}>
      <p className="eyebrow">404 / DI LUAR ORBIT</p>
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat ini tidak tersedia. Kembali ke portfolio untuk melanjutkan eksplorasi.</p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Reload so zone observers bind to the restored document. */}
      <a className="button button-primary" href="/#home">Kembali ke portfolio</a>
    </main>
  );
}
