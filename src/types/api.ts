import { Category } from './auth';

export type Token = string | null;

export interface ApiResponse<T> {
	data: T;
	status: number;
	message: string;
}

export interface RegisterRequestPayload {
	name?: string;
	email: string;
	password: string;
	password_confirm: string;
	birthDate: Date | undefined;
	conditions: boolean;
}

export interface PasswordChangePayload {
	current_password: string;
	password: string;
	password_confirm: string;
}

export interface ResetPasswordPayload {
	email: string;
}

export interface VerifyOtpPayload {
	email: string;
	otp: string;
}

export interface ResetConfPasswordPayload {
	password: string;
	password_confirm: string;
	resetToken: Token;
}

export interface getProductsParams {
	category?: Category | null;
	pageSize?: number;
}

export interface Product {
	_id: number;
	name: string;
	description: string;
	imageAlt: string;
	imageSrc: string;
	price: {
		old: number;
		current: number;
	};
	feature?: string;
	href: string;
	rating: {
		rate: number;
		count: number;
	};
}

export interface Store {
	_id: number;
	name: string;
	description: string;
	logo: string;
	owner: number;
	products: [Product];
	categories: [string];
}
