import { experiences } from "@/data/experiences";
import { TechList } from "@/components/ui/TechList";
import { BunkerArt, WorkstationBase } from "@/components/illustrations/WorldArt";

export function BunkerZone() {
  return (
    <section id="experience" className="zone bunker" aria-labelledby="experience-title">
      <BunkerArt />
      <div className="container">
        <div className="section-meta"><p className="eyebrow">03 / PROFESSIONAL EXPERIENCE</p><span>0 M — UNDERGROUND BUNKER</span></div>
        <h2 id="experience-title">Systems built<br /><span>in the real world.</span></h2>
        <p className="section-intro">Pengalaman belajar dan bekerja yang membentuk cara saya merancang perangkat lunak untuk kebutuhan nyata—dari aplikasi internal berskala enterprise hingga produk full-stack dengan integrasi AI.</p>
        <div className="experience-grid">
          {experiences.map((experience, index) => (
            <article className="experience-monitor" key={experience.id}>
              <div className="monitor-toolbar"><span><span className="signal" aria-hidden="true" /> EXPERIENCE LOG / 0{index + 1}</span><span aria-hidden="true">↗</span></div>
              <div className="monitor-content">
                <p className="company-name">{experience.company}</p>
                <h3>{experience.shortName}</h3>
                <p className="experience-role">{experience.role}</p>
                {experience.program && <p className="muted">{experience.program}</p>}
                <p className="period">{experience.period ?? "Periode program menunggu konfirmasi"}</p>
                <p>{experience.description}</p>
                <TechList tech={experience.tech} />
              </div>
            </article>
          ))}
        </div>
        <WorkstationBase />
      </div>
    </section>
  );
}
