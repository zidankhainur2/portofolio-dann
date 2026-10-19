import type { Certification } from "@/types/portfolio";
import { CertificationCard } from "@/components/research/CertificationCard";
import { CertificationCollection } from "@/components/research/CertificationCollection";

export function CertificationVault({ certificates }: { certificates: Certification[] }) {
  return <>
    <div className="vault-heading"><p className="eyebrow">EVIDENCE OF LEARNING</p><h3>Certifications &<br />competency vault.</h3><p>Sertifikasi kompetensi dan pembelajaran terstruktur yang mendukung kemampuan engineering, pengembangan produk digital, dan komunikasi visual.</p></div>
    <div className="certification-grid">{certificates.filter((certificate) => certificate.featured).map((certificate) => <CertificationCard certificate={certificate} key={certificate.id} />)}</div>
    <CertificationCollection items={certificates.filter((certificate) => !certificate.featured).map((certificate) => ({ id: certificate.id, category: certificate.category, content: <CertificationCard certificate={certificate} /> }))} />
  </>;
}
