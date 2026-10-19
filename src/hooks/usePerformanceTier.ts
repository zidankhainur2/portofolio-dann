"use client";

import { useSyncExternalStore } from "react";
import type { PerformanceTier } from "@/store/portfolioStore";

const query = "(max-width: 767px)";
type DataConnection = EventTarget & { readonly saveData?: boolean };
const getConnection = () => (navigator as Navigator & { connection?: DataConnection }).connection;
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  const connection = getConnection();
  media.addEventListener("change", onChange);
  connection?.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    connection?.removeEventListener("change", onChange);
  };
};

export function usePerformanceTier(): PerformanceTier {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches || getConnection()?.saveData === true ? "lite" : "balanced", () => "lite");
}
