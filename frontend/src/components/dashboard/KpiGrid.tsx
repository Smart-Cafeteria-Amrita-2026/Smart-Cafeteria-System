"use client";

import { useDashboardStore } from "@/src/stores/useDashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Users, Clock, TrendingUp, Utensils, Package, CheckCircle, AlertTriangle, LucideIcon } from "lucide-react";
import { formatNumber, calculateChange } from "@/src/lib/utils";

// Define types
interface KpiData {
  predictedCrowd: number;
  yesterdayCrowd: number;
  tokenUtilization: number;
  mealsPrepared: number;
  foodWastePercent: number;
  supplyDemandMatch: number;
  peakLoadFactor: number;
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend: string;
  color: "blue" | "green" | "red" | "yellow" | "purple" | "indigo";
  metric: string;
}

interface KpiGridProps {
  data: KpiData;
}

const KpiGrid = ({ data }: KpiGridProps) => {
  const { realTimeStats } = useDashboardStore();

  const kpis: KpiCardProps[] = [
    {
      title: "Predicted Crowd",
      value: `${data.predictedCrowd}+`,
      subtitle: "Expected visitors",
      icon: Users,
      trend: calculateChange(data.predictedCrowd, data.yesterdayCrowd),
      color: "blue",
      metric: "crowd",
    },
    {
      title: "Avg Wait Time",
      value: `${realTimeStats.avgWaitTime}m`,
      subtitle: "Token queue delay",
      icon: Clock,
      trend: `${calculateChange(realTimeStats.avgWaitTime, 15)} vs target`,
      color: realTimeStats.avgWaitTime > 20 ? "red" : "green",
      metric: "waitTime",
    },
    {
      title: "Token Utilization",
      value: `${data.tokenUtilization}%`,
      subtitle: "Active vs capacity",
      icon: TrendingUp,
      trend: `${data.tokenUtilization >= 85 ? "Optimal" : "Underutilized"}`,
      color: data.tokenUtilization >= 85 ? "green" : "yellow",
      metric: "utilization",
    },
    {
      title: "Food Prepared",
      value: formatNumber(data.mealsPrepared),
      subtitle: "Optimized portions",
      icon: Utensils,
      trend: `Waste: ${data.foodWastePercent}%`,
      color: data.foodWastePercent <= 10 ? "green" : "red",
      metric: "food",
    },
    {
      title: "Supply-Demand Match",
      value: `${data.supplyDemandMatch}%`,
      subtitle: "Accuracy rate",
      icon: CheckCircle,
      trend: data.supplyDemandMatch >= 90 ? "Excellent" : "Needs improvement",
      color: data.supplyDemandMatch >= 90 ? "green" : "yellow",
      metric: "accuracy",
    },
    {
      title: "Peak Load Factor",
      value: `${data.peakLoadFactor}x`,
      subtitle: "Capacity multiplier",
      icon: AlertTriangle,
      trend: `${data.peakLoadFactor >= 1.5 ? "High pressure" : "Manageable"}`,
      color: data.peakLoadFactor >= 1.5 ? "red" : "blue",
      metric: "load",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};

const KpiCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}: KpiCardProps) => {
  const colorClasses: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    red: "border-red-200 bg-red-50",
    yellow: "border-yellow-200 bg-yellow-50",
    purple: "border-purple-200 bg-purple-50",
    indigo: "border-indigo-200 bg-indigo-50",
  };

  const textColors: Record<string, string> = {
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    indigo: 'text-indigo-700',
  };

  const colorClass = colorClasses[color] || "border-gray-200 bg-gray-50";
  const textColor = textColors[color] || "text-gray-700";

  return (
    <Card className={`border ${colorClass}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
        <div className={`text-xs font-medium px-2 py-1 rounded-full bg-white/70 ${textColor}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiGrid;