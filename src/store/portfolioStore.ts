import { createStore } from "zustand/vanilla";
import type { ZoneId } from "@/data/navigation";

export type PerformanceTier = "balanced" | "lite";

export interface PortfolioState {
  activeZone: ZoneId | null;
  activeProjectId: string;
  reducedMotion: boolean;
  performanceTier: PerformanceTier;
  setActiveZone: (zone: ZoneId) => void;
  setActiveProjectId: (id: string) => void;
}

export const createPortfolioStore = () => createStore<PortfolioState>()((set) => ({
  activeZone: null,
  activeProjectId: "savebill",
  reducedMotion: true,
  performanceTier: "lite",
  setActiveZone: (activeZone) => set((state) => state.activeZone === activeZone ? state : { activeZone }),
  setActiveProjectId: (activeProjectId) => set((state) => state.activeProjectId === activeProjectId ? state : { activeProjectId }),
}));

export type PortfolioStore = ReturnType<typeof createPortfolioStore>;
