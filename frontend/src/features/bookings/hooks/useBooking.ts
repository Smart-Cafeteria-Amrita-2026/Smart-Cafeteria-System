import { useQuery } from '@tanstack/react-query';
import { BookingService } from '../services/BookingService';

export function useBooking(id: string | null) {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => BookingService.getBookingById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}
