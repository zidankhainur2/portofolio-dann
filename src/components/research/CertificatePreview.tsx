"use client";

import { useState } from "react";
import Image from "next/image";
import type { CertificatePreviewAsset } from "@/types/portfolio";

export function CertificatePreview({ asset, title }: { asset: CertificatePreviewAsset; title: string }) {
  const [failed, setFailed] = useState(false);
  if (asset.type === "pdf") return <a className="text-link" href={asset.src} target="_blank" rel="noopener noreferrer">Buka PDF sertifikat (tab baru) ↗</a>;
  return (
    <div className="certificate-preview" style={{ aspectRatio: `${asset.width} / ${asset.height}` }}>
      {failed ? <p role="status">Pratinjau gagal dimuat. Informasi kredensial tetap tersedia di atas.</p> : <Image
        src={asset.src}
        alt={`Sertifikat ${title}`}
        width={asset.width}
        height={asset.height}
        sizes="(max-width: 767px) calc(100vw - 40px), 654px"
        loading="lazy"
        onError={() => setFailed(true)}
      />}
    </div>
  );
}
