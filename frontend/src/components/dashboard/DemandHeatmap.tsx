"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { TrendingUp, Users, Clock } from "lucide-react";

const DemandHeatmap = () => {
  // Mock heatmap data
  const heatmapData = [
    { hour: "7 AM", demand: 20, color: "bg-green-100" },
    { hour: "8 AM", demand: 45, color: "bg-green-200" },
    { hour: "9 AM", demand: 60, color: "bg-green-300" },
    { hour: "10 AM", demand: 35, color: "bg-green-200" },
    { hour: "11 AM", demand: 50, color: "bg-green-300" },
    { hour: "12 PM", demand: 95, color: "bg-red-400" },
    { hour: "1 PM", demand: 85, color: "bg-red-300" },
    { hour: "2 PM", demand: 70, color: "bg-yellow-300" },
    { hour: "3 PM", demand: 40, color: "bg-green-200" },
    { hour: "4 PM", demand: 55, color: "bg-green-300" },
    { hour: "5 PM", demand: 65, color: "bg-yellow-200" },
    { hour: "6 PM", demand: 90, color: "bg-red-400" },
    { hour: "7 PM", demand: 75, color: "bg-red-300" },
    { hour: "8 PM", demand: 50, color: "bg-green-300" },
    { hour: "9 PM", demand: 30, color: "bg-green-200" },
  ];

  // Peak hours
  const peakHours = [
    { time: "12:00-13:00", demand: "Very High", wait: "25-30 mins" },
    { time: "18:00-19:00", demand: "High", wait: "20-25 mins" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Demand Heatmap & Peak Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Heatmap visualization */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">Hourly Demand Pattern</h3>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>High</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-1">
            {heatmapData.map((item) => (
              <div key={item.hour} className="flex flex-col items-center">
                <div 
                  className={`w-full h-8 rounded ${item.color} transition-all hover:opacity-80`}
                  title={`${item.demand}% demand at ${item.hour}`}
                />
                <span className="text-xs mt-1 text-gray-600">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak hours analysis */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Peak Hours Analysis
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peakHours.map((peak, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{peak.time}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    peak.demand === "Very High" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {peak.demand}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Wait: {peak.wait}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12-2 PM</div>
              <div className="text-xs text-gray-600">Busiest Period</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">7-9 AM</div>
              <div className="text-xs text-gray-600">Fastest Service</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">65%</div>
              <div className="text-xs text-gray-600">Capacity Used</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandHeatmap;