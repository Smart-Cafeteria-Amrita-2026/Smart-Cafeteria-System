import { apiGet } from '@/lib/api';
import { Slot, MealType } from '../types/booking.types';

// Generate meal-specific time slots
const generateMockSlots = (mealType: MealType): Slot[] => {
    const slotConfigs = {
        breakfast: [
            { start: 8, end: 9 },
            { start: 9, end: 10 },
            { start: 10, end: 11 },
            { start: 11, end: 12 },
        ],
        lunch: [
            { start: 12, end: 13 },
            { start: 13, end: 14 },
            { start: 14, end: 15 },
            { start: 15, end: 16 },
        ],
        snacks: [
            { start: 16, end: 17 },
            { start: 17, end: 18 },
        ],
        dinner: [
            { start: 18, end: 19 },
            { start: 19, end: 20 },
            { start: 20, end: 21 },
        ],
    };

    const formatTime = (hour: number): string => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    };

    const configs = slotConfigs[mealType];
    return configs.map((config, index) => ({
        id: `${mealType}-s${index + 1}`,
        startTime: formatTime(config.start),
        endTime: formatTime(config.end),
        availableSeats: Math.floor(Math.random() * 30) + 10, // Random seats between 10-40
        totalSeats: 50,
    }));
};

export const SlotService = {
    getSlots: async (mealType: MealType): Promise<Slot[]> => {
        try {
            return await apiGet<Slot[]>(`/slots?type=${mealType}`);
        } catch (error) {
            console.warn('Backend not detected, using mock slots.');
            return generateMockSlots(mealType);
        }
    }
};
