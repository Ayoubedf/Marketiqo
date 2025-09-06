import { createContext } from 'react';
import { AuthActions, AuthContextState } from '@/types';
import { useContext } from 'react';

export const AuthStateContext = createContext<AuthContextState>({
	state: { user: null },
	loading: false,
	dispatch: () => {},
});

export const AuthActionsContext = createContext<AuthActions>({
	register: async () => {},
	login: async () => {},
	updateProfile: async () => {},
	updatePassword: async () => {},
	resetPassword: async () => {},
	resetConfPassword: async () => {},
	verifyOTP: async () => {},
	logout: async () => {},
});

export const useAuthState = () => {
	const ctx = useContext(AuthStateContext);
	if (!ctx) throw new Error('useAuthState must be used within AuthProvider');
	return ctx;
};

export const useAuthActions = () => {
	const ctx = useContext(AuthActionsContext);
	if (!ctx) throw new Error('useAuthActions must be used within AuthProvider');
	return ctx;
};
