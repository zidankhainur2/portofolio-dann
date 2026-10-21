export interface Profile {
  name: string;
  fullName: string;
  role: string;
  summary: string;
  about: string[];
  email?: string;
  cvPath?: string;
}

export interface Experience {
  id: string;
  company: string;
  shortName: string;
  role: string;
  program?: string;
  period?: string;
  tech: string[];
  description: string;
}

interface ProjectContent {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  featured: boolean;
  accent: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  caseStudy?: string;
  banner?: { src: string; width: number; height: number };
}

export type Project = ProjectContent &
  (
    | { visibility: "public"; repositoryUrl: string }
    | { visibility: "private"; repositoryUrl?: never }
  );

export type Publication =
  | { id: string; status: "pending" }
  | {
      id: string;
      status: "verified";
      title: string;
      year: string;
      journal: string;
      indexLabel: string;
      summary: string;
      url: string;
    };

export type CertificatePreviewAsset =
  | { type: "image"; src: string; width: number; height: number }
  | { type: "pdf"; src: string };

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerDetail?: string;
  category: "design" | "frontend" | "backend" | "ai" | "development" | "other";
  featured: boolean;
  description?: string;
  credentialId?: string;
  verificationUrl?: string;
  previewAsset?: CertificatePreviewAsset;
}

export interface SocialLink {
  label: string;
  url?: string;
}
