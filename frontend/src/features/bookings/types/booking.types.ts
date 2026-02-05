export type BookingStatus = 'COMPLETED' | 'CONFIRMED' | 'CANCELLED' | 'PENDING';
export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
    totalSeats: number;
}

export interface BookingItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Booking {
    id: string;
    status: BookingStatus;
    items: BookingItem[];
    totalAmount: number;
    date: string;
    slot: string;
    mealType: MealType;
    members: number;
}
