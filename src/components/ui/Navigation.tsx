"use client";

import { navigation } from "@/data/navigation";
import { usePortfolioStore } from "@/components/providers/PortfolioProvider";

export function Navigation() {
  const activeZone = usePortfolioStore((state) => state.activeZone);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#home" aria-label="zk — Zidan Khainur — Home">zk<span aria-hidden="true">.</span></a>
        <nav aria-label="Navigasi utama">
          {navigation.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={activeZone === id ? "location" : undefined}>{label}</a>)}
        </nav>
        <span className="header-note"><span className="signal" aria-hidden="true" /> OPEN TO OPPORTUNITIES</span>
      </div>
    </header>
  );
}
