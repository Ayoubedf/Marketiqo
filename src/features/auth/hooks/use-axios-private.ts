import {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosError,
	InternalAxiosRequestConfig,
} from 'axios';
import { axiosPrivate } from '@/services/api';
import { useEffect, useRef } from 'react';
import { tokenManager, useAuthActions, useRefreshToken } from '@/features/auth';
import { APP_ROUTES } from '@/core/config/constants';
import { useNavigate } from 'react-router-dom';

export const useAxiosPrivate = (): AxiosInstance => {
	const { logout } = useAuthActions();
	const refresh = useRefreshToken();
	const navigate = useNavigate();
	const tokenRef = useRef<string | null>(tokenManager.getAccessToken());

	tokenRef.current = tokenManager.getAccessToken();

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				if (!config.headers!['Authorization'] && tokenRef.current) {
					config.headers!['Authorization'] = `Bearer ${tokenRef.current}`;
				}
				return config;
			},
			(error: AxiosError) => Promise.reject(error)
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const prevRequest = error.config as AxiosRequestConfig & {
					sent?: boolean;
				};

				if (error.response?.status === 401 && !prevRequest.sent) {
					prevRequest.sent = true;
					try {
						const newToken = await refresh();
						tokenRef.current = newToken;
						prevRequest.headers!['Authorization'] = `Bearer ${newToken}`;
						return axiosPrivate(prevRequest);
					} catch (refreshError) {
						await logout();
						navigate(APP_ROUTES.AUTH.LOGIN, { replace: true });
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);
		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [logout, navigate, refresh]);

	return axiosPrivate;
};
