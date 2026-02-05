'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileForm } from './EditProfileForm';
import { toast } from 'react-hot-toast';

export function EditProfileFormContainer() {
    const router = useRouter();

    // In a real app, this would use a mutation hook
    const [name, setName] = useState('Demo User');
    const [email, setEmail] = useState('demo@cafeteria.com');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsPending(false);
        toast.success('Profile updated successfully!');
        router.push('/profile');
    };

    return (
        <EditProfileForm
            name={name}
            email={email}
            setName={setName}
            setEmail={setEmail}
            onSubmit={handleSubmit}
            onBack={() => router.back()}
            isLoading={isPending}
        />
    );
}
