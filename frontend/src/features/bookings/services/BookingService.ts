import { apiGet } from '@/lib/api';
import { Booking } from '../types/booking.types';

const MOCK_BOOKING: Booking = {
    id: 'b1',
    status: 'CONFIRMED',
    totalAmount: 145,
    date: new Date().toISOString(),
    slot: '08:00 AM - 09:00 AM',
    mealType: 'breakfast',
    members: 2,
    items: [
        { id: '1', name: 'Idli Sambar', quantity: 2, price: 40 },
        { id: '2', name: 'Masala Dosa', quantity: 1, price: 65 },
    ]
};

export const BookingService = {
    getBookings: (): Promise<Booking[]> => apiGet('/bookings'),
    getBookingById: async (id: string): Promise<Booking> => {
        try {
            return await apiGet<Booking>(`/bookings/${id}`);
        } catch (error) {
            console.warn('Backend not detected, using mock booking.');
            return { ...MOCK_BOOKING, id };
        }
    }
};
