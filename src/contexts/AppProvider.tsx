import { createContext, useState, ReactNode, useMemo } from 'react';

export interface AppContextProps {
	query: string;
	setQuery: (query: string) => void;
}

const AppContext = createContext<AppContextProps>({
	query: '',
	setQuery: () => {},
});

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const [query, setQuery] = useState('');

	const value = useMemo(() => ({ query, setQuery }), [query]);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
