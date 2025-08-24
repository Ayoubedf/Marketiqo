import axios from '@/services/api';
import { API_ENDPOINTS } from '@/constants/app';
import useAuth from './useAuth';
import { tokenManager as token } from '@/lib/auth';

const useRefreshToken = () => {
	const { dispatch } = useAuth();

	const refresh = async () => {
		const response = await axios.get(API_ENDPOINTS.REFRESH, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		});

		dispatch({ type: 'SET_USER', payload: response.data.user });
		token.setAccessToken(response.data.token);

		return response.data.token;
	};
	return refresh;
};

export default useRefreshToken;
