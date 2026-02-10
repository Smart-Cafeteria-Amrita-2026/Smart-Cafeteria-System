import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
	token: string | null;
	email: string | null;
	isHydrated: boolean;
	setToken: (token: string | null) => void;
	setEmail: (email: string | null) => void;
	logout: () => void;
	setHydrated: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
	persist(
		(set) => ({
			token: null,
			email: null,
			isHydrated: false,

			setToken: (token) => set({ token }),

			setEmail: (email) => set({ email }),

			logout: () => set({ token: null, email: null }),

			setHydrated: () => set({ isHydrated: true }),
		}),
		{
			name: "auth-store",

			// called when Zustand rehydrates from localStorage
			onRehydrateStorage: () => (state) => {
				state?.setHydrated();
			},

			// only persist what is needed
			partialize: (state) => ({
				token: state.token,
				email: state.email,
			}),
		}
	)
);
