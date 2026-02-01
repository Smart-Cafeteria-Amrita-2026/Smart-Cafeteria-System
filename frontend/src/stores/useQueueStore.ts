import { create } from "zustand";

interface QueueStore {
  tokenNumber: number;
  waitingTime: number;
  mealType: string;
  slotTime: string;
  assignToken: (mealType?: string, slotTime?: string) => number;
  resetToken: () => void;
  updateWaitingTime: (time: number) => void;
}

export const useQueueStore = create<QueueStore>((set) => ({
  tokenNumber: 0,
  waitingTime: 15,
  mealType: "",
  slotTime: "",
  
  assignToken: (mealType = "", slotTime = "") => {
    const newTokenNumber = Math.floor(Math.random() * 1000) + 1000;
    const waitingTime = mealType === "Lunch" ? 20 : mealType === "Dinner" ? 18 : 10;
    
    set({
      tokenNumber: newTokenNumber,
      waitingTime,
      mealType,
      slotTime,
    });
    
    return newTokenNumber;
  },
  
  resetToken: () => {
    set({
      tokenNumber: 0,
      waitingTime: 15,
      mealType: "",
      slotTime: "",
    });
  },
  
  updateWaitingTime: (time: number) => {
    set({ waitingTime: time });
  },
}));