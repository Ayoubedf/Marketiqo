import { API_ENDPOINTS } from '@/constants/app';
import { getBase64 } from '@/utils/getBase64';
import { AuthAction, AuthResponse, UserProfile } from '@/types/auth';
import { tokenManager, userResetManager as userReset } from '@/lib/auth';
import { Axios } from 'axios';
import { Dispatch } from 'react';
import { LoginFormValues } from '@/types/form';
import {
	PasswordChangePayload,
	RegisterRequestPayload,
	ResetConfPasswordPayload,
	ResetPasswordPayload,
	Token,
	VerifyOtpPayload,
} from '@/types/api';

export async function register(axios: Axios, data: RegisterRequestPayload) {
	await axios.post(API_ENDPOINTS.REGISTER, data);
}

export async function login(
	axios: Axios,
	dispatch: Dispatch<AuthAction>,
	data: LoginFormValues
) {
	const res: { data: AuthResponse } = await axios.post<AuthResponse>(
		API_ENDPOINTS.LOGIN,
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	const { user, token } = res.data;
	dispatch({ type: 'SET_USER', payload: user });
	tokenManager.setAccessToken(token);
}

export async function logout(axios: Axios) {
	await axios.delete(API_ENDPOINTS.LOGOUT);
	tokenManager.clearToken();
}

export async function updateProfile(
	axios: Axios,
	userId: string,
	data: FormData
) {
	const updatedData: Partial<UserProfile> = Object.fromEntries(data.entries());
	if (updatedData.avatar instanceof File) {
		updatedData.avatar = await getBase64(updatedData.avatar);
	}

	await axios.put(`${API_ENDPOINTS.PROFILE}${userId}`, data, {
		headers: { Authorization: `Bearer ${tokenManager.getAccessToken()}` },
	});

	return updatedData;
}

export async function updatePassword(
	axios: Axios,
	data: PasswordChangePayload
) {
	await axios.patch(API_ENDPOINTS.PASS_CHANGE, data, {
		headers: { Authorization: `Bearer ${tokenManager.getAccessToken()}` },
	});
}

export async function resetPassword(axios: Axios, data: ResetPasswordPayload) {
	await axios.post(
		API_ENDPOINTS.PASS_RESET_REQUEST,
		{
			email: data.email,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
	userReset.set({ email: data.email });
}

export async function verifyOTP(axios: Axios, data: VerifyOtpPayload) {
	const res = await axios.post(API_ENDPOINTS.VERIFY_OTP, data, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const resetToken = res.data.resetToken;
	userReset.update({ resetToken });
}

export async function resetConfPassword(
	axios: Axios,
	data: ResetConfPasswordPayload
) {
	await axios.patch(API_ENDPOINTS.PASS_RESET_CONFIRM, data, {
		withCredentials: true,
	});
}

export async function refresh(
	axios: Axios,
	dispatch: Dispatch<AuthAction>
): Promise<Token> {
	try {
		const response = await axios.get(API_ENDPOINTS.REFRESH, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		});

		dispatch({ type: 'SET_USER', payload: response.data.user });
		tokenManager.setAccessToken(response.data.token);

		return response.data.token;
	} catch (error) {
		console.error(error);
		dispatch({ type: 'LOGOUT' });
		tokenManager.clearToken();
		return null;
	}
}
