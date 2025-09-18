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
	},
	password: {
		required: true,
		password: true,
	},
};

export const fogotPasswordSchema: ValidationSchema<ForgotPasswordFormValues> = {
	email: {
		required: true,
		email: true,
	},
};

export const profileSchema: ValidationSchema<Partial<User>> = {
	name: {
		required: true,
		minLength: 2,
	},
	email: {
		required: true,
		email: true,
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
			required: true,
			minLength: 2,
		},
		price: {
			number: true,
			min: 0,
		},
	};

export const manageStoreSchema: ValidationSchema<
	Partial<ManageStoreFormValues>
> = {
	name: {
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
	},
	password: {
		required: true,
		password: true,
	},
	password_confirm: {
		confirmed: true,
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
	},
	password_confirm: {
		confirmed: true,
	},
};

export const changePasswordSchema: ValidationSchema<
	Partial<PasswordChangeFormValues>
> = {
	current_password: {
		required: true,
		password: true,
		fieldName: 'current password',
	},
	password: {
		password: true,
		fieldName: 'new password',
	},
	password_confirm: {
		fieldName: 'password confirm',
		confirmed: true,
	},
};
