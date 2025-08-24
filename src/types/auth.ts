import { Dispatch } from 'react';
import { PasswordChangePayload, Store, Token } from './api';

export interface User {
	_id?: string;
	name: string;
	email: string;
	birthDate?: Date;
	role?: string;
	store?: Store;
	avatar: string;
}

export interface UserReset {
	email: string;
	resetToken?: Token;
}

export interface Auth {
	user: User | null;
}

export type AuthAction =
	| { type: 'SET_USER'; payload: User }
	| { type: 'LOGOUT' };

export interface UserProfile {
	avatar: File | string;
	name: string;
	email: string;
	birthDate: Date;
}

export type UpdateProfile = (data: FormData) => void;
export type UpdatePassword = (data: PasswordChangePayload) => void;

export interface AuthContextProps {
	state: Auth;
	dispatch: Dispatch<AuthAction>;
	updateProfile: UpdateProfile;
	updatePassword?: UpdatePassword;
	logout: () => void;
}

export const category = [
	'cosmetics',
	'electronics',
	'apparels',
	'home appliances',
	'furnitures',
	'books',
] as const;
export type Category = (typeof category)[number];

export interface AuthResponse {
	user: User;
	token: Token;
	logout: () => void;
}

export interface ErrorResponse {
	status?: number;
	message?: string;
	statusText?: string;
}
