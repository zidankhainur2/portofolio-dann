"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createPortfolioStore, type PortfolioState, type PortfolioStore } from "@/store/portfolioStore";
import { ScrollExperience } from "@/components/providers/ScrollExperience";
import type { MotionRef, MotionState } from "@/types/motion";

const PortfolioContext = createContext<PortfolioStore | null>(null);
const MotionContext = createContext<MotionRef | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createPortfolioStore);
  const motionRef = useRef<MotionState>({ zones: {}, connectors: {}, projectProgress: 0, invalidate: null });
  return (
    <PortfolioContext.Provider value={store}>
      <MotionContext.Provider value={motionRef}>
        <ScrollExperience store={store} motion={motionRef} />
        {children}
      </MotionContext.Provider>
    </PortfolioContext.Provider>
  );
}

export function useMotionRef() {
  const motion = useContext(MotionContext);
  if (!motion) throw new Error("useMotionRef requires PortfolioProvider");
  return motion;
}

export function usePortfolioStore<T>(selector: (state: PortfolioState) => T) {
  const store = useContext(PortfolioContext);
  if (!store) throw new Error("usePortfolioStore requires PortfolioProvider");
  return useStore(store, selector);
}
