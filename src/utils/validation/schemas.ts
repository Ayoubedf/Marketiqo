import {
	AddProductFormValues,
	ForgotPasswordFormValues,
	LoginFormValues,
	ManageStoreFormValues,
	PasswordChangeFormValues,
	RegisterFormValues,
	ResetConfPasswordPayload,
	User,
} from '@/types';
import { ValidationSchema } from './types';

export const loginSchema: ValidationSchema<LoginFormValues> = {
	email: {
		required: true,
		email: true,
		fieldName: 'Email',
	},
	password: {
		required: true,
		password: true,
		fieldName: 'Password',
	},
};

export const fogotPasswordSchema: ValidationSchema<ForgotPasswordFormValues> = {
	email: {
		required: true,
		email: true,
		fieldName: 'Email',
	},
};

export const editProfileSchema: ValidationSchema<Partial<User>> = {
	name: {
		required: true,
		minLength: 2,
		fieldName: 'Name',
	},
	email: {
		required: true,
		email: true,
		fieldName: 'Email',
	},
	birthDate: {
		required: true,
		date: true,
		major: true,
	},
};

export const addProductSchema: ValidationSchema<Partial<AddProductFormValues>> =
	{
		name: {
			fieldName: 'Name',
			required: true,
			minLength: 2,
		},
		price: {
			fieldName: 'Price',
			number: true,
			min: 0,
		},
	};

export const manageStoreSchema: ValidationSchema<
	Partial<ManageStoreFormValues>
> = {
	name: {
		fieldName: 'Name',
		required: true,
		minLength: 2,
	},
	categories: {
		minLength: 1,
		fieldName: 'category',
	},
};

export const createStoreSchema: ValidationSchema<
	Partial<ManageStoreFormValues>
> = {
	name: {
		fieldName: 'Name',
		required: true,
		minLength: 2,
	},
	categories: {
		minLength: 1,
		fieldName: 'category',
	},
};

export const registerSchema: ValidationSchema<Partial<RegisterFormValues>> = {
	email: {
		required: true,
		email: true,
		fieldName: 'Email',
	},
	password: {
		required: true,
		password: true,
		fieldName: 'Password',
	},
	password_confirm: {
		confirmed: true,
		fieldName: 'Password Confirm',
	},
	birthDate: {
		date: true,
		major: true,
	},
	conditions: {
		checked: true,
	},
};

export const resetPasswordSchema: ValidationSchema<
	Partial<ResetConfPasswordPayload>
> = {
	password: {
		required: true,
		password: true,
		fieldName: 'Password',
	},
	password_confirm: {
		confirmed: true,
		fieldName: 'Password Confirm',
	},
};

export const changePasswordSchema: ValidationSchema<
	Partial<PasswordChangeFormValues>
> = {
	current_password: {
		required: true,
		password: true,
		fieldName: 'Current password',
	},
	password: {
		password: true,
		fieldName: 'New Password',
	},
	password_confirm: {
		fieldName: 'Password Confirm',
		confirmed: true,
	},
};
