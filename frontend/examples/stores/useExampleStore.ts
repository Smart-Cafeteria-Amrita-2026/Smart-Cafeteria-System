import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ExampleStore
 * Replace 'example' with your store name
 * Use for both simple (non-persistent) and persistent state
 */

// Non-persistent example
type ExampleUiStoreState = {
	isExampleModalOpen: boolean;
	openExampleModal: () => void;
	closeExampleModal: () => void;
};

export const useExampleUiStore = create<ExampleUiStoreState>((set) => ({
	isExampleModalOpen: false,
	openExampleModal: () => set({ isExampleModalOpen: true }),
	closeExampleModal: () => set({ isExampleModalOpen: false }),
}));

// Persistent example
type ExampleAuthStoreState = {
	token: string | null;
	setToken: (token: string | null) => void;
};

export const useExampleAuthStore = create<ExampleAuthStoreState>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token) => set({ token }),
		}),
		{
			name: "example-auth-store", // Key in localStorage
		}
	)
);
