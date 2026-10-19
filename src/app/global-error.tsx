"use client";

import "./globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="id">
      <head><title>Terjadi kendala — Zidan Khainur</title><meta name="robots" content="noindex" /></head>
      <body>
        <main className="recovery container">
          <p className="eyebrow">SINYAL TERPUTUS</p>
          <h1>Portfolio belum dapat ditampilkan</h1>
          <p>Terjadi kendala saat memuat halaman. Coba lagi atau muat ulang portfolio.</p>
          <button type="button" className="button button-primary" onClick={() => retry()}>Coba lagi</button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Recovery must work without the failed router/provider tree. */}
          <a className="text-link" href="/">Muat ulang portfolio</a>
        </main>
      </body>
    </html>
  );
}
