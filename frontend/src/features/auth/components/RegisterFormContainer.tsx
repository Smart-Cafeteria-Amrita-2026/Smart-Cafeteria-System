'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    registerSchema,
    type RegisterFormValues,
} from '../schemas/auth.schemas';
import { useRegister } from '../../../hooks/useRegister';
import { RegisterForm } from './RegisterForm';
import { RegisterFormSkeleton } from './RegisterFormSkeleton';

export function RegisterFormContainer() {
    const { mutate, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'USER',
        },
    });

    if (isPending) {
        return <RegisterFormSkeleton />;
    }

    return (
        <RegisterForm
            register={register}
            watch={watch}
            isLoading={isPending}
            errors={errors}
            onSubmit={handleSubmit((data) => mutate(data))}
        />
    );
}
