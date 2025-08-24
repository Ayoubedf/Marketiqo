import env from '@/config/env';
import axios from 'axios';

const api = axios.create({
	baseURL: env.VITE_API_BASE_URL,
	timeout: 5000,
	withCredentials: true,
});

export default api;
