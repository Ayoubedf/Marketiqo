import env from '@/core/config/env';
import axios, { Axios } from 'axios';
import { ApiError, toApiError } from '@/types';
import { notify } from '@/lib/notify';
import { isCancel, AxiosRequestConfig } from 'axios';

export const axiosPublic = axios.create({
	baseURL: env.VITE_API_BASE_URL,
	timeout: 5000,
	withCredentials: true,
	headers: {
		'Content-Type': 'json/application',
	},
});

export const axiosPrivate = axios.create({
	baseURL: env.VITE_API_BASE_URL,
	timeout: 5000,
	withCredentials: true,
	headers: {
		'Content-Type': 'json/application',
	},
});

// axiosPrivate.interceptors.request.use(
// 	(config: InternalAxiosRequestConfig) => {
// 		if (!config.headers!['Authorization'] && tokenManager.getAccessToken()) {
// 			config.headers!['Authorization'] =
// 				`Bearer ${tokenManager.getAccessToken()}`;
// 		}
// 		return config;
// 	},
// 	(error: AxiosError) => Promise.reject(error)
// );

// axiosPrivate.interceptors.response.use(
// 	(response) => response,
// 	async (error: AxiosError) => {
// 		const prevRequest = error.config as AxiosRequestConfig & {
// 			sent?: boolean;
// 		};

// 		if (error.response?.status === 401 && !prevRequest.sent) {
// 			prevRequest.sent = true;
// 			const res = await refresh();
// 			if (!isApiError(res)) {
// 				prevRequest.headers!['Authorization'] = `Bearer ${res.access_token}`;
// 				tokenManager.setAccessToken(res.access_token);
// 				return axiosPrivate(prevRequest);
// 			}
// 			// logout
// 		}

// 		return Promise.reject(error);
// 	}
// );

const toastMap = new Map<string, boolean>();

export async function apiRequest<T>(
	config: AxiosRequestConfig,
	successMessage?: { title: string; description?: string },
	errorMessage?: { title: string; description?: string },
	axios?: Axios,
	autoResetMs: number = 5000
): Promise<T | ApiError> {
	const toastKey = (config.url ?? 'unknown_url') + (config.method ?? 'GET');
	try {
		const response = await (axios ?? axiosPublic).request<T>(config);

		if (successMessage && !toastMap.get(toastKey)) {
			notify.success(successMessage.title, {
				description: successMessage.description,
			});
			toastMap.set(toastKey, true);

			if (autoResetMs > 0)
				setTimeout(() => toastMap.delete(toastKey), autoResetMs);
		}

		return response.data;
	} catch (error) {
		const apiError = toApiError(error);

		if (!isCancel(error) && !toastMap.get(toastKey)) {
			notify.error(errorMessage?.title || 'Request failed', {
				description: errorMessage?.description || apiError.message,
			});
			toastMap.set(toastKey, true);

			if (autoResetMs > 0)
				setTimeout(() => toastMap.delete(toastKey), autoResetMs);
		}

		return apiError;
	}
}
