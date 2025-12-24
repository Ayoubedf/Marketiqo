import { Category } from '@/types';
import env from './env';
import { slugify } from '@/features/category/utils/format';

export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		LOGIN_GOOGLE: '/auth/google',
		LOGIN_GITHUB: '/auth/github',
		REGISTER: '/auth/register',
		COMPLETE_PROFILE: '/auth/complete-profile',
		LOGOUT: '/auth/logout',
		REFRESH: '/auth/refresh',
		VERIFY_OTP: '/auth/verify-otp',
		PASSWORD: {
			RESET_REQUEST: '/auth/password/reset',
			RESET_CONFIRM: '/auth/password/reset/confirm',
		},
	},
	SETTINGS: '/settings',
	USERS: {
		ROOT: '/users',
		PROFILE: '/users/profile',
		CHANGE_PASSWORD: '/users/password/change',
	},
	PRODUCTS: {
		ROOT: '/products',
		DETAILS: (id: string) => `/products/${id}`,
		CATEGORY: (category: Category) => `/products/${slugify(category)}`,
		STORE: (storeId: string) => `/stores/${storeId}/products`,
	},
	STORES: {
		ROOT: '/stores',
		DETAILS: (id: string) => `/stores/${id}`,
		UPDATE: (id: string) => `/stores/${id}`,
	},
	SESSIONS: {
		ROOT: '/sessions',
	},
} as const;

export const APP_ROUTES = {
	HOME: '/',
	CONTACT: '/contact',
	PRIVACY_POLICY: '/privacy-policy',
	TERMS_CONDITIONS: '/terms-conditions',
	NEW: '/new',
	NOT_FOUND: '*',
	AUTH: {
		LOGIN: '/login',
		REGISTER: '/register',
		COMPLETE_PROFILE: '/onboarding/complete-profile',
		PASSWORD: {
			RESET: '/password/reset',
			CHANGE: '/password/change',
		},
	},
	CATEGORY: (cat: Category | ':cat') =>
		`/category/${cat === ':cat' ? cat : slugify(cat)}`,
	COLLECTIONS: (query?: string) =>
		query ? `/collections/${query}` : '/collections',
	CART: '/cart',
	STORES: {
		ROOT: '/stores',
		DETAILS: (id: string | ':id') => `/stores/${id}`,
		CREATE: '/stores/create',
	},
	PROFILE: '/profile',
	SETTINGS: '/settings',
} as const;

const API_BASE_URL = env.VITE_API_BASE_URL;
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const APP_NAME = env.VITE_APP_NAME;
