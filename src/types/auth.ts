import { Dispatch } from 'react';
import {
	ApiError,
	AuthResponse,
	PasswordChangePayload,
	PasswordResetResponse,
	RegisterRequestPayload,
	ResetConfPasswordPayload,
	ResetPasswordPayload,
	Store,
	Token,
	VerifyOtpPayload,
	VerifyOtpResponse,
	LoginFormValues,
} from './';

export interface User {
	_id?: string;
	oauth_id?: string;
	oauth_provider?: string;
	isVerified?: boolean;
	name: string;
	email: string;
	birthDate?: Date;
	role?: string;
	store?: Store;
	avatar: File | string;
}

export interface Auth {
	user: User | null;
}

export type AuthAction =
	| { type: 'SET_USER'; payload: User }
	| { type: 'UPDATE_USER'; payload: Partial<User> }
	| { type: 'LOGOUT' };

export interface UserProfile {
	avatar: File | string;
	name: string | undefined;
	email: string;
	birthDate: Date;
}

export type Register = (
	data: RegisterRequestPayload
) => Promise<User | ApiError | void>;
export type CompleteProfile = (
	data: FormData
) => Promise<User | ApiError | void>;
export type Login = (
	data: LoginFormValues
) => Promise<AuthResponse | ApiError | void>;
export type UpdateProfile = (data: FormData) => Promise<User | ApiError | void>;
export type UpdatePassword = (
	data: PasswordChangePayload
) => Promise<void | ApiError>;
export type ResetPassword = (
	data: ResetPasswordPayload
) => Promise<PasswordResetResponse | ApiError | void>;
export type ResetConfPassword = (
	data: ResetConfPasswordPayload
) => Promise<void | ApiError>;
export type VerifyOTP = (
	data: VerifyOtpPayload
) => Promise<VerifyOtpResponse | ApiError | void>;
export type Logout = () => Promise<void | ApiError>;
export type Refresh = () => Promise<Token>;

export interface AuthContextState {
	state: Auth;
	loading: boolean;
	isAuthenticated: boolean;
	isOAuthUser: boolean;
	dispatch: Dispatch<AuthAction>;
}

export interface AuthActions {
	register: Register;
	completeProfile: CompleteProfile;
	login: Login;
	updateProfile: UpdateProfile;
	updatePassword: UpdatePassword;
	resetPassword: ResetPassword;
	resetConfPassword: ResetConfPassword;
	verifyOTP: VerifyOTP;
	logout: Logout;
}

export interface ErrorResponse {
	status?: number;
	statusText?: string;
	message?: string;
}
