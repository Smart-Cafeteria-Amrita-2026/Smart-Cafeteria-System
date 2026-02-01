"use client";

import { createContext, useContext, ReactNode } from "react";

interface ForecastContextType {
  // Add your context values here
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

export function ForecastProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode; 
  initialData?: any 
}) {
  return (
    <ForecastContext.Provider value={{}}>
      {children}
    </ForecastContext.Provider>
  );
}

export const useForecast = () => {
  const context = useContext(ForecastContext);
  if (context === undefined) {
    throw new Error('useForecast must be used within a ForecastProvider');
  }
  return context;
};