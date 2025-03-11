import {
	createContext,
	useState,
	useRef,
	useEffect,
	ReactNode,
	useCallback,
} from 'react';
import axios from '@/services/api';

interface AuthContextProps {
	auth: { user: object | null; token: string | null };
	setAuth: (auth: { user: object | null; token: string | null }) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
	auth: { user: null, token: null },
	setAuth: () => {},
	logout: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [auth, setAuth] = useState<{ user: object | null; token: string | null }>(
		{
			user: null,
			token: null,
		},
	);
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const logout = useCallback(async () => {
		try {
			await axios.delete('/auth/logout');
			if (isMounted.current) {
				setAuth({ user: null, token: null });
			}
		} catch (err) {
			console.error('Logout failed', err);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
