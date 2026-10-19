import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";
import { CvLink } from "@/components/ui/CvLink";
import { ContactEmail } from "@/components/ui/ContactEmail";
import { SeabedArt } from "@/components/illustrations/WorldArt";

export function ContactSeabed() {
  return (
    <section id="contact" className="zone seabed" aria-labelledby="contact-title">
      <SeabedArt />
      <div className="container">
        <div className="section-meta"><p className="eyebrow">06 / CONTACT</p><span>THE SEABED — A NEW BEGINNING</span></div>
        <span className="contact-spark" aria-hidden="true">✳</span>
        <h2 id="contact-title">Siap Berkolaborasi<br />untuk Proyek <span>Berikutnya?</span></h2>
        <p className="section-intro">Saat ini saya terbuka untuk peluang karier Full-Time, kolaborasi proyek Web Development, maupun diskusi seputar arsitektur Frontend dan Backend.</p>
        <div className="contact-actions">{profile.email ? <ContactEmail email={profile.email} /> : <p className="contact-pending">Email profesional <span>Menunggu konfirmasi</span></p>}<CvLink /></div>
        <div className="contact-socials">{socialLinks.map((social) => social.url ? <a className="text-link" href={social.url} key={social.label}>{social.label} <span aria-hidden="true">↗</span></a> : <span className="unavailable-social" key={social.label}>{social.label}<small>Tautan menyusul</small></span>)}</div>
      </div>
    </section>
  );
}
