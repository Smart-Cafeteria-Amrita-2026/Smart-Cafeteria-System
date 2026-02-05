import { useQuery } from '@tanstack/react-query';
import { ProfileService } from '../services/ProfileService';
import { UserProfile } from '../types/profile.types';

export function useProfile() {
    return useQuery<UserProfile>({
        queryKey: ['profile'],
        queryFn: ProfileService.getProfile,
        staleTime: 5 * 60 * 1000,
    });
}
