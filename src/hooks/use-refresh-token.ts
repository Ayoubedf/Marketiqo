import axios from '@/services/api';
import { API_ENDPOINTS } from '@/constants/app';
import { tokenManager as token } from '@/lib/auth';
import { useAuthState } from '@/contexts/authContexts';
import { Refresh } from '@/types';

const useRefreshToken = () => {
	const { dispatch } = useAuthState();

	const refresh: Refresh = async () => {
		const response = await axios.get(API_ENDPOINTS.REFRESH, {
			withCredentials: true,
		});

		dispatch({ type: 'SET_USER', payload: response.data.user });
		token.setAccessToken(response.data.token);

		return response.data.token;
	};
	return refresh;
};

export default useRefreshToken;
