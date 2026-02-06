import { MEAL_TYPES, TOKEN_STATUS } from "@/src/lib/constants";

export type MealType = keyof typeof MEAL_TYPES;
export type TokenStatus = (typeof TOKEN_STATUS)[keyof typeof TOKEN_STATUS];

export interface Slot {
	id: string;
	mealType: MealType;
	timing: string;
	startTime: string;
	endTime: string;
	capacity: number;
	booked: number;
	available: number;
	isActive: boolean;
}

export interface Token {
	id: string;
	tokenNumber: string;
	userId: string;
	userName: string;
	slotId: string;
	slotTiming: string;
	status: TokenStatus;
	counterId?: number;
	counterName?: string;
	createdAt: Date;
	servedAt?: Date;
}

export interface ForecastData {
	currentParam: number;
	seatsInCanteen: number;
	timePerMealSlot: number;
	ingredients: Array<{
		id: string;
		name: string;
		quantity: number;
		unit: string;
	}>;
	mealCategories: Array<{
		id: string;
		name: string;
		slots: Slot[];
	}>;
}

export interface InventoryItem {
	id: string;
	name: string;
	category: string;
	quantity: number;
	unit: string;
	reorderLevel: number;
	lastUpdated: Date;
}
