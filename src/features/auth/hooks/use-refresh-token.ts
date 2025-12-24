import { tokenManager, useAuthState } from '@/features/auth';
import { refresh } from '@/services/authService';
import { isApiError, Refresh } from '@/types';

export const useRefreshToken = () => {
	const { dispatch } = useAuthState();

	const handleRefresh: Refresh = async () => {
		const response = await refresh();
		if (!isApiError(response)) {
			dispatch({ type: 'SET_USER', payload: response.user });
			tokenManager.setAccessToken(response.access_token);
			return response.access_token;
		}
		throw response;
	};
	return handleRefresh;
};
