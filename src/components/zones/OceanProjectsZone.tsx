import { projects } from "@/data/projects";
import { ProjectArticle } from "@/components/projects/ProjectArticle";
import { OceanArt } from "@/components/illustrations/WorldArt";

export function OceanProjectsZone() {
  return (
    <section id="projects" className="zone ocean" aria-labelledby="projects-title">
      <OceanArt />
      <div className="container">
        <div className="section-meta"><p className="eyebrow">04 / SELECTED WORK</p><span>−500 M — MID-OCEAN</span></div>
        <div className="projects-heading"><h2 id="projects-title">Deep dive<br /><span>into my works.</span></h2><p className="section-intro">Eksplorasi proyek aplikasi web, integrasi AI, sistem rekomendasi, hingga utilitas produktivitas yang telah saya bangun.</p></div>
        <p className="collection-label">A / FLAGSHIP WEB & AI APPLICATIONS</p>
        <div className="flagship-list">{projects.filter((project) => project.featured).map((project, index) => <ProjectArticle project={project} index={index} key={project.id} />)}</div>
        <p className="collection-label utility-label">B / FINANCE APP & DEVELOPER UTILITIES</p>
        <div className="utility-grid">{projects.filter((project) => !project.featured).map((project, index) => <ProjectArticle project={project} index={index + 4} key={project.id} />)}</div>
      </div>
    </section>
  );
}
