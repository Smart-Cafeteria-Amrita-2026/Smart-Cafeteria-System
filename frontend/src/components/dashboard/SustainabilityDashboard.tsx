"use client";

import { useDashboardStore } from "@/src/stores/useDashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Leaf, Recycle, Shield, Target } from "lucide-react";
import { sustainabilityGoals } from "@/src/lib/constants";

const SustainabilityDashboard = () => {
  const { sustainabilityMetrics } = useDashboardStore();

  const metrics = [
    {
      title: "Food Waste Reduction",
      current: sustainabilityMetrics.wasteReduction,
      target: sustainabilityGoals.wasteReduction,
      icon: Recycle,
      description: "Compared to baseline month",
      color: "green",
    },
    {
      title: "Carbon Footprint",
      current: sustainabilityMetrics.carbonFootprint,
      target: sustainabilityGoals.carbonFootprint,
      icon: Leaf,
      description: "kg CO₂ per meal",
      color: "blue",
    },
    {
      title: "Fair Allocation Index",
      current: sustainabilityMetrics.fairnessIndex,
      target: sustainabilityGoals.fairnessIndex,
      icon: Shield,
      description: "Token distribution equity",
      color: "purple",
    },
    {
      title: "Resource Efficiency",
      current: sustainabilityMetrics.resourceEfficiency,
      target: sustainabilityGoals.resourceEfficiency,
      icon: Target,
      description: "Staff & equipment utilization",
      color: "orange",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sustainability & Ethics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const percentage = (metric.current / metric.target) * 100;
            const isOnTrack = percentage >= 85;
            
            return (
              <div key={metric.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`w-5 h-5 ${
                      metric.color === 'green' ? 'text-green-600' :
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                    <span className="font-medium">{metric.title}</span>
                  </div>
                  <span className={`font-bold ${
                    isOnTrack ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {metric.current}/{metric.target}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{metric.description}</span>
                  <span className={isOnTrack ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                    {isOnTrack ? 'On Track' : 'Needs Attention'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical Considerations */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-4">Ethical Guidelines in Practice</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Transparent wait time predictions ensure fairness</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Dynamic portion adjustment reduces food waste</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Priority access for special needs considered in scheduling</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
              <span>Peak hour pricing considered for demand balancing</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityDashboard;