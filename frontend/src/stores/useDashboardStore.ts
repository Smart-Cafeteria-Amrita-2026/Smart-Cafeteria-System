import { create } from "zustand";

interface SustainabilityMetrics {
  wasteReduction: number;
  carbonFootprint: number;
  fairnessIndex: number;
  resourceEfficiency: number;
}

interface DashboardState {
  realTimeStats: {
    avgWaitTime: number;
    activeTokens: number;
    servedToday: number;
    peakWaitTime: number;
  };
  sustainabilityMetrics: SustainabilityMetrics;
  setRealTimeStats: (stats: Partial<DashboardState["realTimeStats"]>) => void;
  setSustainabilityMetrics: (metrics: Partial<SustainabilityMetrics>) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  realTimeStats: {
    avgWaitTime: 12,
    activeTokens: 42,
    servedToday: 247,
    peakWaitTime: 28,
  },
  sustainabilityMetrics: {
    wasteReduction: 65,
    carbonFootprint: 0.9,
    fairnessIndex: 88,
    resourceEfficiency: 82,
  },
  
  setRealTimeStats: (stats) => set((state) => ({
    realTimeStats: { ...state.realTimeStats, ...stats }
  })),
  
  setSustainabilityMetrics: (metrics) => set((state) => ({
    sustainabilityMetrics: { ...state.sustainabilityMetrics, ...metrics }
  })),
}));