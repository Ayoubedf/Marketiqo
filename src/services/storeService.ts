import { API_ENDPOINTS } from '@/constants/app';
import { tokenManager } from '@/lib/auth';
import { Axios } from 'axios';

export async function createStore(axios: Axios, data: FormData) {
	await axios.post(API_ENDPOINTS.STORE, data, {
		headers: { Authorization: `Bearer ${tokenManager.getAccessToken()}` },
	});
}

export async function getStores(axios: Axios, controller: AbortController) {
	const res = await axios.get(API_ENDPOINTS.STORE, {
		signal: controller.signal,
	});
	return res;
}

export async function getStore(
	axios: Axios,
	controller: AbortController,
	id: string
) {
	const res = await axios.get(`${API_ENDPOINTS.STORE}/${id}`, {
		headers: { Authorization: `Bearer ${tokenManager.getAccessToken()}` },
		signal: controller.signal,
	});
	return res;
}
