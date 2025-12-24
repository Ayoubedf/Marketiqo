import { createContext } from 'react';
import { AuthActions, AuthContextState } from '@/types';
import { useContext } from 'react';

export const AuthStateContext = createContext<AuthContextState | undefined>(
	undefined
);

export const AuthActionsContext = createContext<AuthActions | undefined>(
	undefined
);

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
