import axios from '@/services/api';
import { useEffect, useRef } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	const tokenRef = useRef(auth?.token);

	useEffect(() => {
		tokenRef.current = auth?.token;
		const requestIntercept = axios.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${auth.token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);
		const responseIntercept = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (
					(error.response?.status === 401 || error.response?.status === 403) &&
					!prevRequest?.sent
				) {
					prevRequest.sent = true;
					try {
						const newToken = await refresh();
						tokenRef.current = newToken;
						prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
						return axios(prevRequest);
					} catch (refreshError) {
						return Promise.reject(refreshError);
					}
				}
				return Promise.reject(error);
			},
		);
		return () => {
			axios.interceptors.request.eject(requestIntercept);
			axios.interceptors.response.eject(responseIntercept);
		};
	}, [auth, refresh]);
	return axios;
};

export default useAxiosPrivate;
