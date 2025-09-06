import {
	ReactNode,
	useCallback,
	useReducer,
	useMemo,
	useEffect,
	useState,
} from 'react';
import axios from '@/services/api';
import {
	AuthActions,
	AuthContextState,
	Login,
	Logout,
	Register,
	ResetConfPassword,
	ResetPassword,
	UpdatePassword,
	UpdateProfile,
	VerifyOTP,
	isApiError,
} from '@/types';
import { withAbortToast } from '@/utils/withAbortToast';
import { tokenManager, userResetManager } from '@/lib/auth';
import * as rawService from '@/services/authService';
import { authReducer } from './authReducer';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { API_ENDPOINTS } from '@/constants/app';
import { AuthActionsContext, AuthStateContext } from './authContexts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });
	const [loading, setLoading] = useState(true);
	const value: AuthContextState = useMemo(
		() => ({
			state,
			loading,
			dispatch,
		}),
		[loading, state]
	);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.REFRESH, {
					withCredentials: true,
				});
				dispatch({ type: 'SET_USER', payload: response.data.user });
				tokenManager.setAccessToken(response.data.token);
			} catch {
				dispatch({ type: 'LOGOUT' });
				tokenManager.clearToken();
			} finally {
				setLoading(false);
			}
		};
		initAuth();
	}, []);

	const axiosPrivate = useAxiosPrivate();

	const register: Register = useCallback(async (data) => {
		return await rawService.register(data);
	}, []);

	const login: Login = useCallback(async (data) => {
		const response = await rawService.login(data);
		if (!isApiError(response)) {
			dispatch({ type: 'SET_USER', payload: response.user });
			tokenManager.setAccessToken(response.token);
		}
		return response;
	}, []);

	const logout: Logout = useCallback(async () => {
		const response = await rawService.logout(axiosPrivate);
		dispatch({ type: 'LOGOUT' });
		tokenManager.clearToken();
		return response;
	}, [axiosPrivate]);

	const updateProfile: UpdateProfile = useCallback(
		async (data: FormData) => {
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
		},
		[axiosPrivate]
	);

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
		[axiosPrivate, logout]
	);

	const resetPassword: ResetPassword = useCallback(async (data) => {
		const response = await rawService.resetPassword(data);
		if (!isApiError(response)) {
			userResetManager.set({ email: data.email });
			console.log(response);
		}
		return response;
	}, []);

	const resetConfPassword: ResetConfPassword = useCallback(
		async (data) => {
			return await rawService.resetConfPassword(axiosPrivate, data);
		},
		[axiosPrivate]
	);

	const verifyOTP: VerifyOTP = useCallback(async (data) => {
		const verificationData = await rawService.verifyOTP(data);
		if (!isApiError(verificationData)) {
			const resetToken = verificationData.resetToken;
			userResetManager.update({ resetToken });
		}
		return verificationData;
	}, []);

	const actions: AuthActions = {
		register,
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
