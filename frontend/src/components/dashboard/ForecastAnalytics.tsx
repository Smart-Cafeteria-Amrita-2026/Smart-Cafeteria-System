"use client";

import { useForecastStore } from "@/src/stores/useForecastStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Calendar, Thermometer, GraduationCap } from "lucide-react";
import { useForecastData } from "@/src/lib/hooks/useForecastData";

const ForecastAnalytics = () => {
  // Access data directly from the store (not forecastData property)
  const { 
    predictedCrowd, 
    avgWaitTime, 
    peakHours, 
    hourlyPredictions, 
    factors 
  } = useForecastStore();
  
  const { generateForecast, isLoading } = useForecastData();

  const predictionFactors = [
    {
      name: "Academic Schedule",
      icon: GraduationCap,
      impact: factors.academicImpact,
      description: "Exam periods increase demand by 30%",
    },
    {
      name: "Weather Conditions",
      icon: Thermometer,
      impact: factors.weatherImpact,
      description: factors.weatherImpact > 0 ? "Cold weather increases hot meals" : "Normal conditions",
    },
    {
      name: "Day of Week",
      icon: Calendar,
      impact: factors.dayOfWeekImpact,
      description: factors.dayOfWeekImpact > 0 ? "Weekend patterns applied" : "Weekday patterns",
    },
  ];

  // Wrap generateForecast in a click handler
  const handleGenerateForecast = () => {
    generateForecast();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Demand Forecast</span>
          <button
            onClick={handleGenerateForecast}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isLoading ? "Generating..." : "Run Forecast"}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show summary stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Predicted Crowd</div>
            <div className="text-2xl font-bold">{predictedCrowd}</div>
            <div className="text-sm text-gray-500">Expected visitors</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Avg Wait Time</div>
            <div className="text-2xl font-bold">{avgWaitTime}m</div>
            <div className="text-sm text-gray-500">Estimated delay</div>
          </div>
        </div>

        {/* Simple chart visualization */}
        <div className="h-48 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Forecast Visualization</div>
            <div className="text-sm text-gray-400">
              {hourlyPredictions.length > 0 
                ? `${hourlyPredictions.length} data points available` 
                : "No forecast data yet"}
            </div>
          </div>
        </div>

        {/* Prediction Factors */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Prediction Factors</h4>
          <div className="grid grid-cols-3 gap-4">
            {predictionFactors.map((factor) => (
              <div key={factor.name} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <factor.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{factor.name}</span>
                </div>
                <div className={`text-lg font-bold ${
                  factor.impact > 0 ? 'text-green-600' : 
                  factor.impact < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {factor.impact > 0 ? '+' : ''}{factor.impact}%
                </div>
                <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastAnalytics;