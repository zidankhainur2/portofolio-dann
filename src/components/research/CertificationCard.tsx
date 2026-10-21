import type { Certification } from "@/types/portfolio";
import { DetailDisclosure } from "@/components/ui/DetailDisclosure";
import { CertificatePreview } from "@/components/research/CertificatePreview";

export function CertificationCard({ certificate }: { certificate: Certification }) {
  const Heading = certificate.featured ? "h4" : "h5";
  const verification = certificate.verificationUrl && <a className="text-link" href={certificate.verificationUrl}>Verifikasi kredensial ↗</a>;
  return (
    <article id={`certificate-${certificate.id}`} className={`certificate ${certificate.featured ? "featured-certificate" : "technical-certificate"}`} aria-labelledby={`${certificate.id}-title`}>
      {certificate.featured && <span className="certificate-seal" aria-hidden="true">✳</span>}
      <div className="certificate-body">
        <p className="eyebrow">{certificate.issuer}{certificate.issuer === "BNSP" && " / NATIONAL COMPETENCY"}</p>
        <Heading id={`${certificate.id}-title`}>{certificate.title}</Heading>
        {certificate.featured && certificate.description && <p>{certificate.description}</p>}
        {certificate.credentialId && <p className="credential-id">ID kredensial: <span>{certificate.credentialId}</span></p>}
        {!certificate.previewAsset && <p className="pending-note">Pratinjau sertifikat belum tersedia.</p>}
        <DetailDisclosure title={certificate.title} label={certificate.previewAsset ? "Lihat Sertifikat" : "Lihat Detail Kredensial"} eyebrow="COMPETENCY VAULT / CREDENTIAL" closeLabel="Tutup detail kredensial">
          <dl className="credential-metadata">
            <div><dt>Penerbit</dt><dd>{certificate.issuerDetail ?? certificate.issuer}</dd></div>
            <div><dt>ID kredensial</dt><dd>{certificate.credentialId ?? "Menunggu verifikasi"}</dd></div>
          </dl>
          {certificate.description && <p>{certificate.description}</p>}
          {certificate.issuer === "BNSP" && !certificate.issuerDetail && <p className="pending-note">Detail LSP menunggu verifikasi.</p>}
          {verification}
          {certificate.previewAsset ? <CertificatePreview key={certificate.previewAsset.src} asset={certificate.previewAsset} title={certificate.title} /> : <p className="pending-note">Pratinjau sertifikat belum tersedia.</p>}
        </DetailDisclosure>
      </div>
    </article>
  );
}
