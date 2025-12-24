import { API_ENDPOINTS } from '@/core/config/constants';
import { getBase64 } from '@/shared/utils/getBase64';
import { apiRequest } from '@/services/api';
import { Axios } from 'axios';
import {
	UserProfile,
	LoginFormValues,
	AuthResponse,
	VerifyOtpResponse,
	isApiError,
	PasswordChangePayload,
	RegisterRequestPayload,
	ResetConfPasswordPayload,
	ResetPasswordPayload,
	VerifyOtpPayload,
	User,
	PasswordResetResponse,
	RefreshResponse,
} from '@/types';

export async function register(data: RegisterRequestPayload) {
	return apiRequest<User>(
		{
			url: API_ENDPOINTS.AUTH.REGISTER,
			method: 'POST',
			data,
		},
		{
			title: 'Registration successful. Please login.',
			description: 'Your account has been created successfully.',
		},
		{ title: 'Registration failed' }
	);
}

export async function completeProfile(data: FormData) {
	return await apiRequest<User>(
		{
			url: API_ENDPOINTS.AUTH.COMPLETE_PROFILE,
			method: 'POST',
			data,
		},
		{
			title: 'Registration successful. Please login.',
			description: 'Your account has been created successfully.',
		},
		{ title: 'Registration failed' }
	);
}

export async function login(data: LoginFormValues) {
	return apiRequest<AuthResponse>(
		{
			url: API_ENDPOINTS.AUTH.LOGIN,
			method: 'POST',
			data,
		},
		{
			title: 'Login successful!',
			description: 'You’re all set — let’s get started.',
		},
		{ title: 'Login failed' }
	);
}

export async function logout() {
	return apiRequest<void>(
		{
			url: API_ENDPOINTS.AUTH.LOGOUT,
			method: 'DELETE',
		},
		undefined,
		{ title: 'Logout failed' }
	);
}

export async function updateProfile(axios: Axios, data: FormData) {
	const updatedData: Partial<UserProfile> = Object.fromEntries(data.entries());
	if (updatedData.avatar instanceof File)
		updatedData.avatar = await getBase64(updatedData.avatar);

	const response = await apiRequest<User>(
		{
			url: API_ENDPOINTS.USERS.PROFILE,
			method: 'PATCH',
			data,
		},
		{
			title: 'Profile Updated',
			description: 'Your profile has been updated successfully.',
		},
		{ title: 'Profile Update Failed' },
		axios
	);

	if (isApiError(response)) return response;
	return updatedData;
}

export async function updatePassword(
	axios: Axios,
	data: PasswordChangePayload
) {
	return apiRequest<void>(
		{
			url: API_ENDPOINTS.USERS.CHANGE_PASSWORD,
			method: 'PATCH',
			data,
		},
		{
			title: 'Password Updated',
			description: 'Your password has been updated successfully.',
		},
		{ title: 'Password Change Failed' },
		axios
	);
}

export async function resetPassword(data: ResetPasswordPayload) {
	return apiRequest<PasswordResetResponse>(
		{
			url: API_ENDPOINTS.AUTH.PASSWORD.RESET_REQUEST,
			method: 'POST',
			data: { email: data.email },
		},
		{ title: 'Password reset OTP sent to your email.' },
		{ title: 'Failed to send OTP.' }
	);
}

export async function verifyOTP(data: VerifyOtpPayload) {
	return apiRequest<VerifyOtpResponse>(
		{
			url: API_ENDPOINTS.AUTH.VERIFY_OTP,
			method: 'POST',
			data,
		},
		undefined,
		{ title: 'OTP incorrect.' }
	);
}

export async function resetConfPassword(
	axios: Axios,
	data: ResetConfPasswordPayload
) {
	return apiRequest<void>(
		{
			url: API_ENDPOINTS.AUTH.PASSWORD.RESET_CONFIRM,
			method: 'PATCH',
			data,
			withCredentials: true,
		},
		undefined,
		{ title: 'Failed to Reset Password.' },
		axios
	);
}

export async function refresh() {
	return apiRequest<RefreshResponse>({
		url: API_ENDPOINTS.AUTH.REFRESH,
		method: 'POST',
		withCredentials: true,
	});
}
