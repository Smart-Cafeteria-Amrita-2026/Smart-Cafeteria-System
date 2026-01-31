'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    registerSchema,
    type RegisterFormValues,
} from '../schemas/auth.schemas';
import { useRegister } from '../hooks/useRegister';
import { RegisterForm } from './RegisterForm';
import { RegisterFormSkeleton } from './RegisterFormSkeleton';

export function RegisterFormContainer() {
    const { mutate, isPending } = useRegister();

    const {
        register,
        handleSubmit,
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
            isLoading={isPending}
            errors={{
                email: errors.email?.message,
                password: errors.password?.message,
                first_name: errors.first_name?.message,
                last_name: errors.last_name?.message,
                college_id: errors.college_id?.message,
                mobile: errors.mobile?.message,
                department: errors.department?.message,
                role: errors.role?.message,
            }}
            onSubmit={handleSubmit((data) => mutate(data))}
        />
    );
}
