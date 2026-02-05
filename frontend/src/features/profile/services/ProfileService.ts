import { apiGet } from '@/lib/api';
import { UserProfile } from '../types/profile.types';

const MOCK_PROFILE: UserProfile = {
    id: 'u1',
    name: 'Irene Divya',
    email: 'irene@example.com',
};

export const ProfileService = {
    getProfile: async (): Promise<UserProfile> => {
        try {
            return await apiGet<UserProfile>('/user/profile');
        } catch (error) {
            console.warn('Backend not detected, using mock profile.');
            return MOCK_PROFILE;
        }
    },
};
