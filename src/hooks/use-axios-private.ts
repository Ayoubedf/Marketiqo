import {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosError,
	InternalAxiosRequestConfig,
} from 'axios';
import axios from '@/services/api';
import { useEffect, useRef } from 'react';
import useRefreshToken from './use-refresh-token';
import { tokenManager } from '@/lib/auth';
import { Token } from '@/types';

interface FailedRequest {
	resolve: (token: Token) => void;
	reject: (error: unknown) => void;
}

const useAxiosPrivate = (): AxiosInstance => {
	const refresh = useRefreshToken();
	const tokenRef = useRef<string | null>(tokenManager.getAccessToken());

	tokenRef.current = tokenManager.getAccessToken();

	useEffect(() => {
		let isRefreshing = false;
		let failedQueue: FailedRequest[] = [];

		const processQueue = (error: unknown, token: Token = null) => {
			failedQueue.forEach((prom) => {
				if (error) prom.reject(error);
				else prom.resolve(token!);
			});
			failedQueue = [];
		};

		const requestIntercept = axios.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				if (!config.headers!['Authorization'] && tokenRef.current) {
					config.headers!['Authorization'] = `Bearer ${tokenRef.current}`;
				}
				return config;
			},
			(error: AxiosError) => Promise.reject(error)
		);

		const responseIntercept = axios.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const prevRequest = error.config as AxiosRequestConfig & {
					sent?: boolean;
				};

				if (error.response?.status === 403 && !prevRequest.sent) {
					if (isRefreshing) {
						return new Promise<Token>((resolve, reject) => {
							failedQueue.push({ resolve, reject });
						})
							.then((token) => {
								prevRequest.headers!['Authorization'] = `Bearer ${token}`;
								return axios(prevRequest);
							})
							.catch((err) => Promise.reject(err));
					}

					prevRequest.sent = true;
					isRefreshing = true;
					try {
						const newToken = await refresh();
						tokenRef.current = newToken;
						prevRequest.headers!['Authorization'] = `Bearer ${newToken}`;
						processQueue(null, newToken);
						return axios(prevRequest);
					} catch (refreshError) {
						processQueue(refreshError, null);
						return Promise.reject(refreshError);
					} finally {
						isRefreshing = false;
					}
				}

				return Promise.reject(error);
			}
		);
		return () => {
			axios.interceptors.request.eject(requestIntercept);
			axios.interceptors.request.eject(responseIntercept);
		};
	});

	return axios;
};

export default useAxiosPrivate;
