"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { useForecastStore } from "@/src/stores/useForecastStore";
import { runAIForecast } from "@/lib/api/forecast";
import type { ForecastParams } from "@/lib/types/forecast";

export const useForecastData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateForecast } = useForecastStore();

  const generateForecast = useCallback(async (params?: ForecastParams) => {
    setIsLoading(true);
    try {
      const forecast = await runAIForecast(params);
      updateForecast(forecast);
      
      toast({
        title: "Forecast Generated",
        description: "AI predictions updated for next 24 hours",
      });
    } catch (error) {
      toast({
        title: "Forecast Failed",
        description: "Unable to generate predictions. Using historical data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [updateForecast, toast]);

  return {
    generateForecast,
    isLoading,
  };
};