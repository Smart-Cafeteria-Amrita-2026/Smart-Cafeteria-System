"use client";

import { useState, useCallback } from "react";

interface ForecastParams {
  academicSchedule?: string;
  weather?: string;
  dayOfWeek?: string;
  specialEvent?: boolean;
}

interface ForecastData {
  predictedCrowd: number;
  avgWaitTime: number;
  peakHours: string[];
  hourlyPredictions: Array<{
    hour: string;
    predicted: number;
    actual: number;
    historical: number;
  }>;
}

export const useForecastData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  const generateForecast = useCallback(async (params?: ForecastParams) => {
    setIsLoading(true);
    
    try {
      // Mock forecast generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: ForecastData = {
        predictedCrowd: Math.floor(Math.random() * 100) + 100,
        avgWaitTime: Math.floor(Math.random() * 30) + 10,
        peakHours: ["12:00-13:00", "18:00-19:00"],
        hourlyPredictions: Array.from({ length: 12 }, (_, i) => ({
          hour: `${i + 7}:00`,
          predicted: Math.floor(Math.random() * 50) + 30,
          actual: Math.floor(Math.random() * 50) + 25,
          historical: Math.floor(Math.random() * 50) + 20,
        })),
      };
      
      setForecastData(mockData);
      return mockData;
    } catch (error) {
      console.error("Forecast generation failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateForecast,
    isLoading,
    forecastData,
  };
};