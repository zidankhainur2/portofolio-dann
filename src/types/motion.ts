import type { ZoneId } from "@/data/navigation";

export type ConnectorId = "atmosphere" | "cave" | "flooded" | "deep" | "shore";

export interface MotionState {
  zones: Partial<Record<ZoneId, number>>;
  connectors: Partial<Record<ConnectorId, number>>;
  projectProgress: number;
  invalidate: (() => void) | null;
}

export interface MotionRef { current: MotionState }
