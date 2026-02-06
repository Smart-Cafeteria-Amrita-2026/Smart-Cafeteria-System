import { create } from "zustand";

interface MaintenanceStore {
	isMaintenance: boolean;
	setMaintenance: (v: boolean) => void;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
	isMaintenance: false,
	setMaintenance: (v: boolean) => set({ isMaintenance: v }),
}));
