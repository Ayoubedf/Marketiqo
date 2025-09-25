import env from '@/core/config/env';
import axios, { Axios } from 'axios';
import { ApiError, toApiError } from '@/types';
import { notify } from '@/lib/notify';
import { isCancel, AxiosRequestConfig } from 'axios';

const api = axios.create({
	baseURL: env.VITE_API_BASE_URL,
	timeout: 5000,
	withCredentials: true,
});

export async function apiRequest<T>(
	config: AxiosRequestConfig,
	successMessage?: { title: string; description?: string },
	errorMessage?: { title: string; description?: string },
	axios?: Axios
): Promise<T | ApiError> {
	try {
		const response = await (axios ?? api).request<T>(config);

		if (successMessage) {
			notify.success(successMessage.title, {
				description: successMessage.description,
			});
		}

		return response.data;
	} catch (error) {
		const apiError = toApiError(error);

		if (!isCancel(error)) {
			console.error(apiError);
			notify.error(errorMessage?.title || 'Request failed', {
				description: errorMessage?.description || apiError.message,
			});
		}

		return apiError;
	}
}

export default api;
