import { useContext } from 'react';
import axios from '@/services/api';
import AuthContext from '@/contexts/AuthProvider';

const useRefreshToken = () => {
	const { auth, setAuth } = useContext(AuthContext);

	const refresh = async () => {
		const response = await axios.get('/refresh', {
			withCredentials: true,
		});

		setAuth({
			...auth,
			user: response.data.user,
			token: response.data.token,
		});

		return response.data.token;
	};
	return refresh;
};

export default useRefreshToken;
