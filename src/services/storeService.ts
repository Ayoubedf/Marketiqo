import { API_ENDPOINTS } from '@/core/config/constants';
import { Store } from '@/types';
import { Axios } from 'axios';
import { apiRequest } from './api';

export async function createStore(axios: Axios, data: FormData) {
	return apiRequest<Store>(
		{
			url: API_ENDPOINTS.STORE,
			method: 'POST',
			data,
		},
		{
			title: 'Store Created',
			description: 'Your store has been created successfully.',
		},
		{
			title: 'Failed to Create Store',
		},
		axios
	);
}

export async function getStores(axios: Axios, controller?: AbortController) {
	return apiRequest<Store[]>(
		{
			url: API_ENDPOINTS.STORE,
			method: 'GET',
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}

export async function getStore(
	axios: Axios,
	id: string,
	controller?: AbortController
) {
	return apiRequest<Store>(
		{
			url: API_ENDPOINTS.STORE_DETAILS(id),
			method: 'GET',
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}
