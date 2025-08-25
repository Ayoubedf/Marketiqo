import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import axios from '@/services/api';
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
			register: (data: RegisterRequestPayload) =>
				rawService.register(axios, data),
			login: (data: LoginFormValues) => rawService.login(axios, dispatch, data),
			logout: () => rawService.logout(axiosPrivate),
			updateProfile: (data: FormData) =>
				rawService.updateProfile(axiosPrivate, data),
			updatePassword: (data: PasswordChangePayload) =>
				rawService.updatePassword(axiosPrivate, data),
			resetPassword: (data: ResetPasswordPayload) =>
				rawService.resetPassword(axios, data),
			verifyOTP: (data: VerifyOtpPayload) => rawService.verifyOTP(axios, data),
			resetConfPassword: (data: ResetConfPasswordPayload) =>
				rawService.resetConfPassword(axiosPrivate, data),
			refresh: () => rawService.refresh(axios, dispatch),
		}),
		[axiosPrivate, dispatch]
	);
}
