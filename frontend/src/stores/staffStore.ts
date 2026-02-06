import { create } from "zustand";
import { Slot, Token, TokenStatus } from "@/src/lib/types/staff";

interface StaffState {
	slots: Slot[];
	tokens: Token[];
	selectedSlot: Slot | null;
	isCreateSlotModalOpen: boolean;
	isForecastPanelOpen: boolean;

	// Actions
	setSlots: (slots: Slot[]) => void;
	setTokens: (tokens: Token[]) => void;
	setSelectedSlot: (slot: Slot | null) => void;
	openCreateSlotModal: () => void;
	closeCreateSlotModal: () => void;
	toggleForecastPanel: () => void;
	updateTokenStatus: (tokenId: string, status: TokenStatus, counterId?: number) => void;
	addToken: (token: Token) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
	slots: [],
	tokens: [],
	selectedSlot: null,
	isCreateSlotModalOpen: false,
	isForecastPanelOpen: false,

	setSlots: (slots) => set({ slots }),
	setTokens: (tokens) => set({ tokens }),
	setSelectedSlot: (slot) => set({ selectedSlot: slot }),
	openCreateSlotModal: () => set({ isCreateSlotModalOpen: true }),
	closeCreateSlotModal: () => set({ isCreateSlotModalOpen: false }),
	toggleForecastPanel: () => set((state) => ({ isForecastPanelOpen: !state.isForecastPanelOpen })),
	updateTokenStatus: (tokenId, status, counterId) =>
		set((state) => ({
			tokens: state.tokens.map((token) =>
				token.id === tokenId
					? {
							...token,
							status,
							counterId,
							counterName: counterId ? `Counter ${counterId}` : undefined,
						}
					: token
			),
		})),
	addToken: (token) =>
		set((state) => ({
			tokens: [token, ...state.tokens],
		})),
}));
