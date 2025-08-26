import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import * as rawService from '@/services/authService';
import {
	PasswordChangePayload,
	RegisterRequestPayload,
	ResetConfPasswordPayload,
	ResetPasswordPayload,
	VerifyOtpPayload,
} from '@/types/api';
import useAuth from './useAuth';
import { LoginFormValues } from '@/types/form';
import { useMemo } from 'react';

// type AuthService = {
// 	[K in keyof typeof rawService]: unknown;
// };

export function useAuthService() {
	const axiosPrivate = useAxiosPrivate();
	const { dispatch } = useAuth();

	return useMemo(
		() => ({
			register: (data: RegisterRequestPayload) => rawService.register(data),
			login: (data: LoginFormValues) => rawService.login(dispatch, data),
			logout: () => rawService.logout(axiosPrivate),
			updateProfile: (data: FormData) =>
				rawService.updateProfile(axiosPrivate, data),
			updatePassword: (data: PasswordChangePayload) =>
				rawService.updatePassword(axiosPrivate, data),
			resetPassword: (data: ResetPasswordPayload) =>
				rawService.resetPassword(data),
			verifyOTP: (data: VerifyOtpPayload) => rawService.verifyOTP(data),
			resetConfPassword: (data: ResetConfPasswordPayload) =>
				rawService.resetConfPassword(axiosPrivate, data),
			refresh: () => rawService.refresh(dispatch),
		}),
		[axiosPrivate, dispatch]
	);
}
