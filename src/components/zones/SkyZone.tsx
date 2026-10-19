import { profile, techGroups } from "@/data/profile";
import { TechList } from "@/components/ui/TechList";
import { SkyArt } from "@/components/illustrations/WorldArt";

export function SkyZone() {
  return (
    <section id="about" className="zone sky" aria-labelledby="about-title">
      <SkyArt />
      <div className="container">
        <div className="section-meta"><p className="eyebrow">02 / ABOUT & TECH STACK</p><span>+2,000 M — ATMOSPHERE</span></div>
        <div className="about-layout">
          <h2 id="about-title">Dari Logika Sistem<br /><span>hingga Pengalaman Visual.</span></h2>
          <div className="about-copy">{profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <div className="stack-grid">{techGroups.map((group, index) => <div className="stack-group" key={group.title}><span className="index" aria-hidden="true">0{index + 1}</span><h3>{group.title}</h3><TechList tech={group.tech} /></div>)}</div>
      </div>
    </section>
  );
}
