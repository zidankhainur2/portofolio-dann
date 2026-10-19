import { profile } from "@/data/profile";

export function CvLink() {
  const local = profile.cvPath?.startsWith("/");
  return profile.cvPath ? (
    <a href={profile.cvPath} className="button button-secondary" download={local || undefined} target={local ? undefined : "_blank"} rel={local ? undefined : "noopener noreferrer"}>
      {local ? "Unduh CV" : "Buka CV (PDF, tab baru)"} <span aria-hidden="true">{local ? "↓" : "↗"}</span>
    </a>
  ) : (
    <span className="pending-action">CV <span className="pending-label">Segera tersedia</span></span>
  );
}
