import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define interfaces inline
interface HourlyPrediction {
  hour: string;
  predicted: number;
  actual: number;
  historical: number;
}

interface ForecastData {
  predictedCrowd: number;
  avgWaitTime: number;
  peakHours: string[];
  historicalAccuracy: number;
  factors: {
    academicImpact: number;
    weatherImpact: number;
    dayOfWeekImpact: number;
    specialEventImpact: number;
  };
  hourlyPredictions: HourlyPrediction[];
  lastUpdated: Date | null;
}

interface ForecastStore extends ForecastData {
  updateForecast: (data: Partial<ForecastData>) => void;
  resetForecast: () => void;
  getPredictionForHour: (hour: number) => HourlyPrediction | undefined;
}

const initialData: ForecastData = {
  predictedCrowd: 120,
  avgWaitTime: 18,
  peakHours: ["12:00-13:00", "18:00-19:00"],
  historicalAccuracy: 87,
  factors: {
    academicImpact: 15,
    weatherImpact: -5,
    dayOfWeekImpact: 10,
    specialEventImpact: 0,
  },
  hourlyPredictions: Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 7}:00`,
    predicted: Math.floor(Math.random() * 50) + 30,
    actual: Math.floor(Math.random() * 50) + 25,
    historical: Math.floor(Math.random() * 50) + 20,
  })),
  lastUpdated: null,
};

export const useForecastStore = create<ForecastStore>()(
  persist(
    (set, get) => ({
      ...initialData,
      
      updateForecast: (data: Partial<ForecastData>) => set((state) => ({
        ...state,
        ...data,
        lastUpdated: new Date(),
      })),
      
      resetForecast: () => set({
        ...initialData,
        lastUpdated: new Date(),
      }),
      
      getPredictionForHour: (hour: number) => {
        const state = get();
        return state.hourlyPredictions.find(p => {
          const hourNum = parseInt(p.hour.split(':')[0]);
          return hourNum === hour;
        });
      },
    }),
    {
      name: "forecast-storage",
    }
  )
);