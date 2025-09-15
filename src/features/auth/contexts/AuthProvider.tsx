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
	CompleteProfile,
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
import { tokenManager } from '@/features/auth/globals/tokenManager';
import * as rawService from '@/services/authService';
import { authReducer } from './authReducer';
import { useAxiosPrivate } from '@/features/auth/hooks/use-axios-private';
import { API_ENDPOINTS } from '@/config/constants';
import { AuthActionsContext, AuthStateContext } from './authContexts';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });
	const [loading, setLoading] = useState(true);
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
				tokenManager.clear();
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

	const completeProfile: CompleteProfile = useCallback(async (data) => {
		return await rawService.completeProfile(data);
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
		tokenManager.clear();
		return response;
	}, [axiosPrivate]);

	const updateProfile: UpdateProfile = useCallback(
		async (data) => {
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
		return await rawService.resetPassword(data);
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
			tokenManager.setResetToken(resetToken);
		}
		return verificationData;
	}, []);

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
