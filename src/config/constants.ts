import { Category } from '@/types';
import env from './env';
import { slugify } from '@/features/category/utils/format';

export const API_ENDPOINTS = {
	USERS: '/users',
	PRODUCTS: '/products',
	PRODUCT_CATEGORY: (category: Category) => `/products/${slugify(category)}`,
	PRODUCTS_SEARCH: '/products/search',
	STORE: '/stores',
	STORE_DETAILS: (id: string) => `/stores/${id}`,
	LOGIN: '/auth/login',
	LOGIN_GOOGLE: '/auth/google',
	LOGIN_GITHUB: '/auth/github',
	REGISTER: '/auth/register',
	COMPLETE_PROFILE: '/auth/complete-profile',
	LOGOUT: '/auth/logout',
	PASS_RESET_REQUEST: '/auth/password/reset',
	PASS_RESET_CONFIRM: '/auth/password/reset/confirm',
	PASS_CHANGE: '/users/password/change',
	VERIFY_OTP: '/auth/verify-otp',
	PROFILE: '/users/profile',
	REFRESH: '/refresh',
	SETTINGS: '/settings',
};

export const APP_ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	COMPLETE_PROFILE: '/onboarding/complete-profile',

	PASS_RESET: '/password/reset',
	PASS_CHANGE: '/password/change',

	CATEGORY: (cat: Category | ':cat') => `/category/${slugify(cat)}`,
	COLLECTIONS: (q?: string) => (q ? `/collections/${q}` : '/collections'),
	STORES: '/stores',
	STORE_DETAILS: (id: string) => `/stores/${id}`,
	CREATE_STORE: '/stores/create',
	CART: '/cart',
	PROFILE: '/profile',
	SETTINGS: '/settings',

	CONTACT: '/contact',
	PRIVACY_POLICY: '/privacy_policy',
	TERMS_CONDITIONS: '/terms_conditions',
	NEW: '/new',

	NOT_FOUND: '*',
};

const API_BASE_URL = env.VITE_API_BASE_URL;
export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const APP_NAME = env.VITE_APP_NAME;
