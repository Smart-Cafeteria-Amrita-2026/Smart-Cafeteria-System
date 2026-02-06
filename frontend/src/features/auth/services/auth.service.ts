import { apiPost } from '@/lib/api';
import type {
    LoginPayload,
    LoginResponse,
    VerifyOtpPayload,
    VerifyOtpResponse,
    RegisterPayload,
    RegisterResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
} from '../types/auth.types';

export const AuthService = {
    // 🔐 Login → sends OTP
    login: (payload: LoginPayload): Promise<LoginResponse> =>
        apiPost<LoginResponse>('/auth/login', payload, { skipAuth: true }),

    // 🔑 Verify OTP → returns token
    verifyOtp: (
        payload: VerifyOtpPayload
    ): Promise<VerifyOtpResponse> =>
        apiPost<VerifyOtpResponse>('/auth/verify-otp', payload),

    // 🧾 Register new user
    register: (
        payload: RegisterPayload
    ): Promise<RegisterResponse> =>
        apiPost<RegisterResponse>('/auth/register', payload, {
            skipAuth: true,
        }),

    // 🔁 Forgot password → sends reset link to email
    forgotPassword: (
        payload: ForgotPasswordPayload
    ): Promise<ForgotPasswordResponse> =>
        apiPost<ForgotPasswordResponse>(
            '/auth/forgot-password',
            payload,
            { skipAuth: true }
        ),

    // 🔐 Reset password → set new password using token
    resetPassword: (
        payload: ResetPasswordPayload
    ): Promise<ResetPasswordResponse> =>
        apiPost<ResetPasswordResponse>(
            '/auth/reset-password',
            payload,
            { skipAuth: true }
        ),
};
