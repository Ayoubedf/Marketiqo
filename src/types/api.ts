import { AxiosError, isCancel } from 'axios';
import { Category, User } from './auth';
import { SentMessageInfo } from 'nodemailer';

export type Token = string | null;

export interface AccessTokenPayload {
	id: string;
	iat: number;
	exp: number;
}

export interface ResetTokenPayload {
	email: string;
	iat: number;
	exp: number;
}

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

export interface CompleteProfilePayload {
	oauth_id: string;
	oauth_provider: string;
	avatar: File | string;
	email: string;
	isVerified: boolean;
	name: string;
	birthDate: Date | string | undefined;
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

export interface searchProductsParams {
	query: string;
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
	_id: string;
	name: string;
	description: string;
	logo: string;
	owner: number;
	products: Product[];
	categories: Category[];
}

export interface AuthResponse {
	user: User;
	token: Token;
}

export interface VerifyOtpResponse {
	resetToken: Token;
}

export interface PasswordResetResponse {
	info: SentMessageInfo;
	data: {
		_id: string;
		email: string;
	};
}

export interface ApiError {
	status: number; // HTTP status code
	code: string; // Short machine-readable identifier
	message: string; // User-friendly error message
	details?: string; // Extra description (developer-friendly)
	fields?: Record<string, string[]>; // For validation errors
	meta?: unknown; // Optional extra debugging info
}

export function toApiError(error: unknown): ApiError {
	if (isCancel(error)) {
		return {
			status: 499,
			code: 'REQUEST_CANCELLED',
			message: `Request was cancelled.`,
		};
	}

	if (error && typeof error === 'object' && 'isAxiosError' in error) {
		const axiosErr = error as AxiosError<Partial<ApiError>>;
		return {
			status: axiosErr.response?.status ?? 500,
			code: axiosErr.code ?? 'AXIOS_ERROR',
			message: axiosErr.response?.data?.message ?? axiosErr.message,
			details: axiosErr.response?.data?.details,
			fields: axiosErr.response?.data?.fields,
			meta: axiosErr.toJSON(),
		};
	}

	return {
		status: 500,
		code: 'UNKNOWN_ERROR',
		message: 'An unexpected error occurred.',
		details: error instanceof Error ? error.message : String(error),
	};
}

export function isApiError(value: unknown): value is ApiError {
	return (
		typeof value === 'object' &&
		value !== null &&
		'status' in value &&
		'code' in value &&
		'message' in value
	);
}
