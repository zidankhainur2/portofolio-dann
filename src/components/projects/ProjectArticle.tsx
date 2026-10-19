import type { Project } from "@/types/portfolio";
import { TechList } from "@/components/ui/TechList";
import { ProjectInteraction } from "@/components/projects/ProjectInteraction";
import { DetailDisclosure } from "@/components/ui/DetailDisclosure";

export function ProjectArticle({ project, index }: { project: Project; index: number }) {
  const actions = (project.visibility === "public" || project.liveUrl) && <>
    {project.visibility === "public" && <a className="text-link" href={project.repositoryUrl}>Lihat Source Code <span aria-hidden="true">↗</span></a>}
    {project.liveUrl && <a className="text-link" href={project.liveUrl}>Buka Live Demo <span aria-hidden="true">↗</span></a>}
  </>;
  return (
    <ProjectInteraction id={project.id} title={project.title} accent={project.accent} featured={project.featured} header={<><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className={`project-status ${project.visibility === "private" ? "private-status" : ""}`}>{project.visibility === "public" ? "Public Repo" : "Private Build"}</span></>}>
      <div className="project-body">
        <p className="project-category">{project.category}</p>
        <h3 id={`${project.id}-title`}>{project.title}</h3>
        {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
        <p>{project.description}</p>
        <TechList tech={project.tech} />
        <div className="project-actions">
          {actions}
          {(project.caseStudy || project.visibility === "private") && (
            <DetailDisclosure title={project.title} actions={actions} eyebrow="PROJECT LOG / DETAIL" closeLabel="Tutup detail proyek" label={project.visibility === "private" ? "Lihat Ringkasan Proyek" : "Lihat Studi Kasus"}>
              <p className="project-category">{project.category} / {project.visibility === "private" ? "Private Build" : "Public Repo"}</p>
              <p>{project.description}</p>
              {project.visibility === "public" && <p>{project.caseStudy}</p>}
              <TechList tech={project.tech} />
              {project.visibility === "private" && <p className="pending-note">Private Build. Source code tidak tersedia untuk publik. Studi kasus lengkap, arsitektur, dan galeri UI menunggu materi yang disetujui.</p>}
            </DetailDisclosure>
          )}
        </div>
      </div>
    </ProjectInteraction>
  );
}
