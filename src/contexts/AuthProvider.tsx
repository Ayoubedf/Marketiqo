import {
	createContext,
	useRef,
	useEffect,
	ReactNode,
	useCallback,
	useReducer,
	useMemo,
} from 'react';
import {
	AuthContextProps,
	UpdatePassword,
	UpdateProfile,
	User,
} from '@/types/auth';
import { toast } from 'sonner';
import { CheckCircle2Icon } from 'lucide-react';
import { withAbortToast } from '@/utils/withAbortToast';
import { tokenManager as token } from '@/lib/auth';
// import { useAuthService } from '@/hooks/useAuthService';
import * as rawService from '@/services/authService';
import { authReducer } from './authReducer';
import { PasswordChangePayload } from '@/types/api';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const AuthContext = createContext<AuthContextProps>({
	state: { user: null },
	dispatch: () => {},
	updateProfile: async () => {},
	updatePassword: async () => {},
	logout: async () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });
	// const authService = useAuthService();
	const axiosPrivate = useAxiosPrivate();
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const logout = useCallback(async () => {
		try {
			await rawService.logout(axiosPrivate);
			if (isMounted.current) {
				dispatch({ type: 'LOGOUT' });
				token.clearToken();
			}
		} catch (err) {
			console.error('Logout failed', err);
			toast.error('Logout failed', {
				description: 'Something went wrong while logging out.',
			});
		}
	}, [axiosPrivate]);

	const updateProfile: UpdateProfile = useCallback(
		async (data: FormData) => {
			await withAbortToast({
				label: 'Updating Profile',
				description: 'Your profile is being updated.',
				duration: 3000,
				onConfirm: async (controller) => {
					const updatedData = await rawService.updateProfile(
						axiosPrivate,
						data
					);

					if (!controller.signal.aborted) {
						const updatedUser = { ...state.user, ...updatedData } as User;
						toast.success('Profile Updated', {
							description: 'Your profile has been updated successfully.',
							icon: <CheckCircle2Icon className="size-5 text-green-500" />,
						});
						if (isMounted.current)
							dispatch({ type: 'SET_USER', payload: updatedUser });
					}
				},
			});
		},
		[axiosPrivate, state.user]
	);

	const updatePassword: UpdatePassword = useCallback(
		async (data: PasswordChangePayload) => {
			await withAbortToast({
				label: 'Updating Password',
				description: 'Your password is being updated.',
				onConfirm: async (controller) => {
					await rawService.updatePassword(axiosPrivate, data);

					if (!controller.signal.aborted) {
						toast.success('Password Updated', {
							description: 'Your password has been updated successfully.',
							icon: <CheckCircle2Icon className="size-5 text-green-500" />,
						});
						if (isMounted.current) await logout();
					}
				},
			});
		},
		[axiosPrivate, logout]
	);

	const value = useMemo(
		() => ({
			state,
			dispatch,
			updateProfile,
			updatePassword,
			logout,
		}),
		[state, updateProfile, updatePassword, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
