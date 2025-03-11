import AuthContext from '@/contexts/AuthProvider';
import { useContext } from 'react';

export default () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
