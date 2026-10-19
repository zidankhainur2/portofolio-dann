import { publications } from "@/data/publications";
import { certifications } from "@/data/certifications";
import { AbyssArt } from "@/components/illustrations/WorldArt";
import { PublicationCard } from "@/components/research/PublicationCard";
import { CertificationVault } from "@/components/research/CertificationVault";

export function AbyssZone() {
  return (
    <section id="research" className="zone abyss" aria-labelledby="research-title">
      <AbyssArt />
      <div className="container">
        <div className="section-meta"><p className="eyebrow">05 / RESEARCH & CREDENTIALS</p><span>−4,000 M — THE ABYSS</span></div>
        <h2 id="research-title">Scientific<br /><span>publications.</span></h2>
        <p className="section-intro">Kontribusi riset akademik di bidang rekayasa perangkat lunak, sistem rekomendasi, sistem cerdas, dan teknologi terkait.</p>
        <div className="research-grid">
          {publications.map((publication, index) => <PublicationCard publication={publication} index={index} key={publication.id} />)}
        </div>
        <CertificationVault certificates={certifications} />
      </div>
    </section>
  );
}
