import type { Experience } from "@/types/portfolio";

export const experiences: Experience[] = [
  {
    id: "xlsmart",
    company: "PT XLSMART Telecom Sejahtera Tbk (XLSMART)",
    shortName: "XLSMART",
    role: "Backend Engineer Intern",
    period: "Agustus 2026 – Sekarang",
    tech: ["Java Spring Boot", "Angular", "Enterprise Architecture", "REST API"],
    description: "Berperan dalam pengembangan dan pemeliharaan aplikasi internal Customer Service berskala enterprise. Fokus pada implementasi logika bisnis di sisi backend menggunakan Java Spring Boot serta integrasi data dengan antarmuka berbasis Angular untuk mendukung kebutuhan operasional layanan pelanggan.",
  },
  {
    id: "ruangguru",
    company: "PT Ruang Raya Indonesia (Ruangguru)",
    shortName: "Ruangguru",
    program: "MSIB — Studi Independen Bersertifikat",
    role: "Full-Stack Web Development & AI Cohort",
    tech: ["React.js", "Golang", "AI Integration", "Full-Stack Web Development"],
    description: "Menyelesaikan program intensif pengembangan web modern dengan fokus pada pembangunan aplikasi full-stack menggunakan React.js di sisi frontend dan Golang di sisi backend, serta mengimplementasikan integrasi Artificial Intelligence ke dalam produk web fungsional.",
  },
];
