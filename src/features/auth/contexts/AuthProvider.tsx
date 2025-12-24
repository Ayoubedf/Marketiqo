import {
	ReactNode,
	useCallback,
	useReducer,
	useMemo,
	useEffect,
	useState,
	useRef,
} from 'react';
import {
	AuthActions,
	AuthContextState,
	CompleteProfile,
	Login,
	Logout,
	Refresh,
	Register,
	ResetConfPassword,
	ResetPassword,
	UpdatePassword,
	UpdateProfile,
	VerifyOTP,
	isApiError,
} from '@/types';
import { withAbortToast } from '@/shared/utils/withAbortToast';
import { tokenManager } from '@/features/auth/globals/tokenManager';
import * as rawService from '@/services/authService';
import { authReducer } from './authReducer';
import { AuthActionsContext, AuthStateContext } from './authContexts';
import {
	AxiosError,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from 'axios';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/core/config/constants';
import { axiosPrivate } from '@/services/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const tokenRef = useRef<string | null>(tokenManager.getAccessToken());

	const register: Register = useCallback(async (data) => {
		return await rawService.register(data);
	}, []);

	const completeProfile: CompleteProfile = useCallback(async (data) => {
		return await rawService.completeProfile(data);
	}, []);

	const login: Login = useCallback(async (data) => {
		const response = await rawService.login(data);
		if (!isApiError(response)) {
			dispatch({ type: 'SET_USER', payload: response.user });
			tokenManager.setAccessToken(response.access_token);
		}
		return response;
	}, []);

	const logout: Logout = useCallback(async () => {
		const response = await rawService.logout();
		dispatch({ type: 'LOGOUT' });
		tokenManager.clear();
		return response;
	}, []);

	useEffect(() => {
		const initAuth = async () => {
			const response = await rawService.refresh();
			if (!isApiError(response)) {
				dispatch({ type: 'SET_USER', payload: response.user });
				tokenManager.setAccessToken(response.access_token);
			} else {
				dispatch({ type: 'LOGOUT' });
				tokenManager.clear();
			}
			setLoading(false);
		};
		initAuth();
	}, []);

	// attach interceptors
	useEffect(() => {
		tokenRef.current = tokenManager.getAccessToken();

		const refresh: Refresh = async () => {
			const response = await rawService.refresh();
			if (!isApiError(response)) {
				dispatch({ type: 'SET_USER', payload: response.user });
				tokenManager.setAccessToken(response.access_token);
				return response.access_token;
			}
			throw response;
		};

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
	}, [logout, navigate]);

	const updateProfile: UpdateProfile = useCallback(async (data) => {
		await withAbortToast({
			label: 'Updating Profile',
			description: 'Your profile is being updated.',
			duration: 3000,
			onConfirm: async (controller) => {
				const updatedProfile = await rawService.updateProfile(
					axiosPrivate,
					data
				);

				if (!controller.signal.aborted) {
					if (!isApiError(updatedProfile)) {
						dispatch({
							type: 'UPDATE_USER',
							payload: updatedProfile,
						});
					}
				}
			},
		});
	}, []);

	const updatePassword: UpdatePassword = useCallback(
		async (data) => {
			await withAbortToast({
				label: 'Updating Password',
				description: 'Your password is being updated.',
				onConfirm: async (controller) => {
					const response = await rawService.updatePassword(axiosPrivate, data);
					if (!controller.signal.aborted) {
						if (!isApiError(response)) {
							await logout();
						}
					}
				},
			});
		},
		[logout]
	);

	const resetPassword: ResetPassword = useCallback(async (data) => {
		return await rawService.resetPassword(data);
	}, []);

	const resetConfPassword: ResetConfPassword = useCallback(async (data) => {
		return await rawService.resetConfPassword(axiosPrivate, data);
	}, []);

	const verifyOTP: VerifyOTP = useCallback(async (data) => {
		const verificationData = await rawService.verifyOTP(data);
		if (!isApiError(verificationData)) {
			const resetToken = verificationData.reset_token;
			tokenManager.setResetToken(resetToken);
		}
		return verificationData;
	}, []);

	const value: AuthContextState = useMemo(
		() => ({
			state,
			loading,
			isAuthenticated: !loading && !!state.user,
			isOAuthUser:
				!loading && !!state.user?.oauth_provider && !!state.user?.oauth_id,
			dispatch,
		}),
		[loading, state]
	);

	const actions: AuthActions = {
		register,
		completeProfile,
		login,
		logout,
		updateProfile,
		updatePassword,
		resetPassword,
		resetConfPassword,
		verifyOTP,
	};

	return (
		<AuthStateContext.Provider value={value}>
			<AuthActionsContext.Provider value={actions}>
				{children}
			</AuthActionsContext.Provider>
		</AuthStateContext.Provider>
	);
};
