import axios from '@/services/api';
import { API_ENDPOINTS } from '@/config/constants';
import { tokenManager, useAuthState } from '@/features/auth';
import { Refresh } from '@/types';

export const useRefreshToken = () => {
	const { dispatch } = useAuthState();

	const refresh: Refresh = async () => {
		const response = await axios.get(API_ENDPOINTS.REFRESH, {
			withCredentials: true,
		});

		dispatch({ type: 'SET_USER', payload: response.data.user });
		tokenManager.setAccessToken(response.data.token);

		return response.data.token;
	};
	return refresh;
};
