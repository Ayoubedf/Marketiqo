import { Category } from './auth';

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface PasswordChangeFormValues {
	current_password: string;
	password: string;
	password_confirm: string;
}

export interface RegisterFormValues {
	email: string;
	password: string;
	password_confirm: string;
	birthDate: Date;
	conditions: boolean;
}

export interface AddProductFormValues {
	name: string;
	description: string;
	price: number;
}

export interface ManageStoreFormValues {
	name: string;
	description: string;
	categories: Category[];
}

export interface ValidationErrors {
	email?: string;
	password?: string;
	password_confirm?: string;
	birthDate?: string;
	conditions?: string;
}

export interface StoreValidationErrors {
	name?: string;
	categories?: string;
}

export interface ProductValidationErrors {
	name?: string;
	price?: string;
}

export interface StructuredDate {
	calendar: { identifier: string };
	era: string;
	year: number;
	month: number;
	day: number;
}
