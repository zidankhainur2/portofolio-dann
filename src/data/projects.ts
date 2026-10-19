import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "savebill",
    title: "SaveBill",
    subtitle: "AI-Powered Electricity Bill Analyzer",
    category: "Full-Stack Web & AI",
    visibility: "public",
    featured: true,
    accent: "#ddf7bb",
    repositoryUrl: "https://github.com/zidankhainur2/savebill",
    liveUrl: "https://savebill-iota.vercel.app/",
    tech: ["Next.js", "Golang", "Tailwind CSS", "AI Integration"],
    description:
      "Platform audit energi rumah tangga untuk menganalisis konsumsi listrik, mengidentifikasi perangkat dengan penggunaan energi tinggi, dan memberikan rekomendasi penghematan berbasis AI.",
  },
  {
    id: "eventsika",
    title: "EventSika",
    subtitle: "Campus Event Recommendation Platform",
    category: "Recommendation System / Web Platform",
    visibility: "public",
    featured: true,
    accent: "#b8d6ff",
    repositoryUrl: "https://github.com/zidankhainur2/eventsika",
    liveUrl: "https://eventsika.vercel.app/",
    tech: [
      "Next.js",
      "Supabase",
      "PostgreSQL",
      "Sentence Transformer",
      "Recommendation Algorithm",
    ],
    description:
      "Platform eksplorasi kegiatan kampus dengan sistem rekomendasi hybrid yang mencocokkan event terhadap minat, program studi, dan profil mahasiswa.",
    caseStudy:
      "EventSika dibangun sebagai platform terpusat untuk membantu mahasiswa menemukan kegiatan kampus yang relevan. Sistem rekomendasinya menggabungkan semantic similarity berbasis Sentence Transformer dengan rule-based matching untuk menghasilkan rekomendasi yang lebih personal.",
  },
  {
    id: "loghub",
    title: "LogHub",
    subtitle: "Internship Activity Management",
    category: "Productivity Web App",
    visibility: "private",
    featured: true,
    accent: "#f0d2ab",
    tech: ["Next.js", "React", "Tailwind CSS", "Modern Web UI"],
    description:
      "Platform manajemen logbook untuk membantu peserta magang mendokumentasikan aktivitas kerja, menyusun catatan periodik, dan memantau progres secara terstruktur.",
    caseStudy:
      "Repository proyek bersifat privat. Detail implementasi ditampilkan melalui studi kasus, arsitektur ringkas, dan galeri UI tanpa membuka source code.",
    liveUrl: "https://loghub.web.id/",
  },
  {
    id: "vymo",
    title: "VYMO",
    subtitle: "Real-Time Facial Expression Classification",
    category: "Computer Vision & Web Integration",
    visibility: "public",
    featured: true,
    accent: "#d6bfff",
    repositoryUrl: "https://github.com/zidankhainur2/vymo",
    tech: [
      "React.js",
      "Python",
      "Flask",
      "CNN / Deep Learning",
      "Computer Vision",
    ],
    description:
      "Aplikasi analisis ekspresi wajah yang mengintegrasikan model Convolutional Neural Network pada backend Python Flask dengan antarmuka web React untuk pemrosesan gambar dan video.",
  },
  {
    id: "money-note",
    title: "Money-Note",
    subtitle: "Personal Finance & Expense Tracker",
    category: "Financial Web App",
    visibility: "private",
    featured: false,
    accent: "#a2e2df",
    tech: [],
    description:
      "Aplikasi pencatatan keuangan personal untuk memantau pemasukan, pengeluaran, kategori transaksi, dan ringkasan kondisi keuangan melalui tampilan yang ringkas.",
    liveUrl: "https://money-note.vercel.app/",
  },
  {
    id: "gridify",
    title: "Gridify",
    category: "Web Tool / Visual Utility",
    visibility: "public",
    featured: false,
    accent: "#f7c7cf",
    repositoryUrl: "https://github.com/zidankhainur2/gridify",
    tech: [],
    description:
      "Utilitas berbasis web untuk membantu penyusunan tata letak grid dan eksplorasi komposisi elemen visual secara cepat langsung dari browser.",
  },
  {
    id: "download-organizer-pro",
    title: "Download Organizer Pro",
    category: "Automation & File Utility",
    visibility: "public",
    featured: false,
    accent: "#f3df9b",
    repositoryUrl: "https://github.com/zidankhainur2/download-organizer-pro",
    tech: ["PowerShell"],
    description:
      "Utilitas otomatisasi berbasis PowerShell untuk memindai, mengklasifikasikan, dan merapikan file di direktori unduhan berdasarkan aturan yang dapat dikembangkan secara modular.",
    liveUrl: "https://download-organizer-pro-three.vercel.app/",
  },
];
