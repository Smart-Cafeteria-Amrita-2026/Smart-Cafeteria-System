export interface HourlyPrediction {
  hour: string;
  predicted: number;
  actual: number;
  historical: number;
}

export interface ForecastFactors {
  academicImpact: number;
  weatherImpact: number;
  dayOfWeekImpact: number;
  specialEventImpact: number;
}

export interface ForecastData {
  predictedCrowd: number;
  avgWaitTime: number;
  peakHours: string[];
  historicalAccuracy: number;
  factors: ForecastFactors;
  hourlyPredictions: HourlyPrediction[];
  lastUpdated: Date | null;
}

export interface ForecastStore extends ForecastData {
  updateForecast: (data: Partial<ForecastData>) => void;
  resetForecast: () => void;
  getPredictionForHour: (hour: number) => HourlyPrediction | undefined;
}

export interface ForecastParams {
  academicSchedule?: 'regular' | 'exam' | 'holiday' | 'festival';
  weather?: 'sunny' | 'rainy' | 'cold' | 'hot' | 'stormy';
  dayOfWeek?: 'weekday' | 'weekend';
  specialEvent?: boolean;
  mealSlot?: 'breakfast' | 'lunch' | 'dinner';
}

// Initial data without methods
export const initialForecastData: ForecastData = {
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