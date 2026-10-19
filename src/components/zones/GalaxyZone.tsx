import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";
import { CvLink } from "@/components/ui/CvLink";
import { GalaxyArt } from "@/components/illustrations/WorldArt";

export function GalaxyZone() {
  return (
    <section id="home" className="zone galaxy" aria-labelledby="hero-title">
      <GalaxyArt />
      <div className="container hero-content">
        <p className="eyebrow"><span className="tiny-cross" aria-hidden="true">✦</span> PORTFOLIO / 2026 <span className="eyebrow-divider">01 — GALAXY & ORBIT</span></p>
        <h1 id="hero-title">ZIDAN<br /><span>KHAINUR</span><span className="hero-role">{profile.role}</span></h1>
        <p className="hero-summary">{profile.summary}</p>
        <div className="hero-actions"><a className="button button-primary" href="#about">Mulai Penjelajahan <span aria-hidden="true">↓</span></a><CvLink /></div>
        <div className="hero-socials" aria-label="Profil profesional">
          {socialLinks.slice(0, 2).map((social) => social.url ? <a href={social.url} key={social.label}>{social.label} <span aria-hidden="true">↗</span></a> : <span className="muted" key={social.label}>{social.label} — tautan menyusul</span>)}
        </div>
      </div>
      <div className="container hero-bottom"><span>FROM ORBIT TO THE ABYSS</span><a href="#about">SCROLL TO DESCEND <span aria-hidden="true">↓</span></a><span aria-hidden="true">+10,000 KM</span></div>
    </section>
  );
}
