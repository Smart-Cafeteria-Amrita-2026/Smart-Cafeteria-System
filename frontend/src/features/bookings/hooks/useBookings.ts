import { useQuery } from '@tanstack/react-query';
import { BookingService } from '../services/BookingService';
import { Booking } from '../types/booking.types';

export function useBookings() {
    return useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: BookingService.getBookings,
        staleTime: 5 * 60 * 1000,
    });
}
