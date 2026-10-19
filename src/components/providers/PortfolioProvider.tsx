"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createPortfolioStore, type PortfolioState, type PortfolioStore } from "@/store/portfolioStore";
import { ScrollExperience } from "@/components/providers/ScrollExperience";

const PortfolioContext = createContext<PortfolioStore | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createPortfolioStore);
  return <PortfolioContext.Provider value={store}><ScrollExperience store={store} />{children}</PortfolioContext.Provider>;
}

export function usePortfolioStore<T>(selector: (state: PortfolioState) => T) {
  const store = useContext(PortfolioContext);
  if (!store) throw new Error("usePortfolioStore requires PortfolioProvider");
  return useStore(store, selector);
}
