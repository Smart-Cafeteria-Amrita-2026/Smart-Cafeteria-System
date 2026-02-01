import { client } from "./client";

export interface ForecastParams {
  academicSchedule?: "regular" | "exam" | "holiday" | "festival";
  weather?: "sunny" | "rainy" | "cold" | "hot" | "stormy";
  dayOfWeek?: "weekday" | "weekend";
  specialEvent?: boolean;
  mealSlot?: "breakfast" | "lunch" | "dinner";
}

export interface ForecastResponse {
  predictedCrowd: number;
  avgWaitTime: number;
  peakHours: string[];
  hourlyPredictions: Array<{
    hour: string;
    predicted: number;
    actual: number;
    historical: number;
  }>;
  factors: {
    academicImpact: number;
    weatherImpact: number;
    dayOfWeekImpact: number;
    specialEventImpact: number;
  };
}

// Mock forecast data for development
export const mockForecastData: ForecastResponse = {
  predictedCrowd: 156,
  avgWaitTime: 18,
  peakHours: ["12:00-13:00", "18:00-19:00"],
  hourlyPredictions: Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 7}:00`,
    predicted: Math.floor(Math.random() * 50) + 30,
    actual: Math.floor(Math.random() * 50) + 25,
    historical: Math.floor(Math.random() * 50) + 20,
  })),
  factors: {
    academicImpact: 15,
    weatherImpact: -5,
    dayOfWeekImpact: 10,
    specialEventImpact: 0,
  },
};

// Generate AI forecast
export const runAIForecast = async (params?: ForecastParams): Promise<ForecastResponse> => {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === "development") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Modify mock data based on params
      let predictedCrowd = 156;
      let avgWaitTime = 18;
      
      if (params?.academicSchedule === "exam") {
        predictedCrowd += 30;
        avgWaitTime += 5;
      }
      
      if (params?.weather === "rainy" || params?.weather === "cold") {
        predictedCrowd += 20;
      }
      
      if (params?.mealSlot === "lunch") {
        predictedCrowd += 40;
        avgWaitTime += 8;
      }
      
      return {
        ...mockForecastData,
        predictedCrowd,
        avgWaitTime,
      };
    }
    
    // In production, call real API
    return await client.post("/forecast", params);
  } catch (error) {
    console.error("Forecast API error:", error);
    throw error;
  }
};

// Get historical forecast data
export const getHistoricalForecast = async (days: number = 7) => {
  return await client.get(`/forecast/historical?days=${days}`);
};

// Get forecast accuracy metrics
export const getForecastAccuracy = async () => {
  return await client.get("/forecast/accuracy");
};