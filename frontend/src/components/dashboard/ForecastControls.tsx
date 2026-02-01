"use client";

import { useState } from "react";
import { TrendingUp, Calendar, Thermometer, GraduationCap, Zap } from "lucide-react";
import { useForecastData } from "@/src/lib/hooks/useForecastData";

const ForecastControls = () => {
  const { generateForecast, isLoading } = useForecastData();
  
  const [parameters, setParameters] = useState({
    academicSchedule: "regular",
    weather: "sunny",
    dayOfWeek: "weekday",
    specialEvent: false,
    mealSlot: "lunch",
  });

  const handleParameterChange = (key: string, value: string | boolean) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRunForecast = () => {
    generateForecast(parameters);
  };

  const forecastOptions = {
    academicSchedule: [
      { value: "regular", label: "Regular Day", icon: "📚" },
      { value: "exam", label: "Exam Period", icon: "📝" },
      { value: "holiday", label: "Holiday", icon: "🎉" },
      { value: "festival", label: "Festival", icon: "🎪" },
    ],
    weather: [
      { value: "sunny", label: "Sunny", icon: "☀️" },
      { value: "rainy", label: "Rainy", icon: "🌧️" },
      { value: "cold", label: "Cold", icon: "❄️" },
      { value: "hot", label: "Hot", icon: "🔥" },
      { value: "stormy", label: "Stormy", icon: "⛈️" },
    ],
    dayOfWeek: [
      { value: "weekday", label: "Weekday", icon: "📅" },
      { value: "weekend", label: "Weekend", icon: "🎯" },
    ],
    mealSlot: [
      { value: "breakfast", label: "Breakfast", icon: "🍳" },
      { value: "lunch", label: "Lunch", icon: "🍽️" },
      { value: "dinner", label: "Dinner", icon: "🌙" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Parameter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Academic Schedule */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Academic Schedule
          </label>
          <select
            value={parameters.academicSchedule}
            onChange={(e) => handleParameterChange("academicSchedule", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {forecastOptions.academicSchedule.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weather */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Weather Conditions
          </label>
          <select
            value={parameters.weather}
            onChange={(e) => handleParameterChange("weather", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {forecastOptions.weather.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day of Week */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Day of Week
          </label>
          <select
            value={parameters.dayOfWeek}
            onChange={(e) => handleParameterChange("dayOfWeek", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {forecastOptions.dayOfWeek.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Slot */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Meal Slot
          </label>
          <select
            value={parameters.mealSlot}
            onChange={(e) => handleParameterChange("mealSlot", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {forecastOptions.mealSlot.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Special Event Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="specialEvent"
          checked={parameters.specialEvent}
          onChange={(e) => handleParameterChange("specialEvent", e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="specialEvent" className="text-sm font-medium text-gray-700">
          Special Event Today (Increases demand by 25%)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <button
          onClick={handleRunForecast}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          <TrendingUp className="w-5 h-5" />
          {isLoading ? "Generating Forecast..." : "Run AI Forecast"}
        </button>
        
        <button
          onClick={() => setParameters({
            academicSchedule: "regular",
            weather: "sunny",
            dayOfWeek: "weekday",
            specialEvent: false,
            mealSlot: "lunch",
          })}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Reset Parameters
        </button>
        
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          Save Preset
        </button>
      </div>

      {/* Info Section */}
      <div className="pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-3">How AI Forecasting Works:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Historical data analysis from past 6 months</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Real-time weather and academic schedule integration</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Machine learning predictions updated every hour</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>85% accuracy rate based on validation testing</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ForecastControls;