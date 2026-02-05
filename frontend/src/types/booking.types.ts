export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
    totalSeats: number;
}

export interface BookingSession {
    mealType: MealType | null;
    slotId: string | null;
    members: number;
}
