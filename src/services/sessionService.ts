import { API_ENDPOINTS } from '@/core/config/constants';
import { ISession } from '@/types';
import { Axios } from 'axios';
import { apiRequest } from './api';

export async function getSessions(axios: Axios, controller?: AbortController) {
	return apiRequest<ISession[]>(
		{
			url: API_ENDPOINTS.SESSIONS,
			method: 'GET',
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}
