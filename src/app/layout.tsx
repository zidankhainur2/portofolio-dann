import type { Metadata } from "next";
import "./globals.css";
import "./world.css";
import "lenis/dist/lenis.css";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";

export const metadata: Metadata = {
  title: "Zidan Khainur — Full-Stack & Backend Engineer",
  description: "Portfolio Ahmad Fauzidan Yahya Khainur. Eksplorasi pengalaman backend engineering, pengembangan full-stack, integrasi AI, proyek, dan riset dari orbit hingga abyss.",
  openGraph: {
    title: "Zidan Khainur — Full-Stack & Backend Engineer",
    description: "From orbit to the abyss. Eksplorasi proyek, pengalaman engineering, dan riset Zidan Khainur.",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary", title: "Zidan Khainur — Full-Stack & Backend Engineer" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><PortfolioProvider>{children}</PortfolioProvider></body></html>;
}
