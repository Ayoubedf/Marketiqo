import { Auth, AuthAction } from '@/types';

export function authReducer(state: Auth, action: AuthAction): Auth {
	switch (action.type) {
		case 'SET_USER':
			return { ...state, user: action.payload };
		case 'UPDATE_USER':
			if (!state.user) return state;
			return { ...state, user: { ...state.user, ...action.payload } };
		case 'LOGOUT':
			return { ...state, user: null };
		default:
			return state;
	}
}
