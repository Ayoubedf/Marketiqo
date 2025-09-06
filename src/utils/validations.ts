import {
	ResetConfPasswordPayload,
	User,
	AddProductFormValues,
	LoginFormValues,
	ManageStoreFormValues,
	PasswordChangeFormValues,
	RegisterFormValues,
} from '@/types';
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;

type FieldSchema = {
	required?: boolean;
	email?: boolean;
	password?: boolean;
	confirmed?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	fieldName?: string;
	date?: boolean;
	number?: boolean;
	major?: boolean;
	checked?: boolean;
	message?: string;
};

export type ValidationSchema<T> = {
	[K in keyof T]: FieldSchema;
};

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

type ValidationErrors<T> = {
	[K in keyof T]?: string;
};

export function validateSchema<T extends Record<string, unknown>>(
	values: Partial<T>,
	schema: ValidationSchema<T>
): ValidationErrors<T> {
	const errors: ValidationErrors<T> = {};

	for (const key in schema) {
		const rules = schema[key];
		const value = values[key];
		const label = rules.fieldName || key;

		// Trim string values
		const trimmedValue = typeof value === 'string' ? value.trim() : value;

		const numValue = Number(trimmedValue);

		// Required validation first
		if (rules.required && !trimmedValue && trimmedValue !== 0) {
			errors[key] = rules.message ?? `${label} is required`;
			continue;
		}

		// Email
		if (
			rules.email &&
			typeof trimmedValue === 'string' &&
			!emailRegex.test(trimmedValue)
		) {
			errors[key] = rules.message ?? 'Invalid email address';
			continue;
		}

		// Password
		if (
			rules.password &&
			typeof trimmedValue === 'string' &&
			!passwordRegex.test(trimmedValue)
		) {
			errors[key] =
				'Password must be at least 8 characters long and include letters, numbers, and a special character.';
			continue;
		}

		// Confirm password
		if (rules.confirmed && trimmedValue !== values['password']) {
			errors[key] = rules.message ?? 'Passwords do not match';
			continue;
		}

		// Min Length
		if (
			rules.minLength &&
			typeof trimmedValue === 'string' &&
			trimmedValue.length < rules.minLength
		) {
			errors[key] =
				rules.message ??
				`${label} must be at least ${rules.minLength} characters`;
			continue;
		}

		if (
			rules.minLength &&
			Array.isArray(value) &&
			value.length < rules.minLength
		) {
			errors[key] =
				rules.message ?? `You must select at least ${rules.minLength} ${label}`;
			continue;
		}

		// Max Length
		if (
			rules.maxLength &&
			typeof trimmedValue === 'string' &&
			trimmedValue.length > rules.maxLength
		) {
			errors[key] =
				rules.message ??
				`${label} must be at most ${rules.maxLength} characters`;
			continue;
		}

		if (
			rules.maxLength &&
			Array.isArray(value) &&
			value.length < rules.maxLength
		) {
			errors[key] =
				rules.message ?? `You must select at most ${rules.maxLength} ${label}`;
			continue;
		}

		// Number required
		if (rules.number && (trimmedValue === '' || isNaN(numValue))) {
			errors[key] = rules.message ?? `${label} is invalid`;
			continue;
		}

		// Number min
		if (rules.min && rules.number && numValue < rules.min) {
			errors[key] = rules.message ?? `${label} must be at least ${rules.min}`;
			continue;
		}

		// Number max
		if (rules.max && rules.number && numValue > rules.max) {
			errors[key] = rules.message ?? `${label} must be at most ${rules.max}`;
			continue;
		}

		// Date required
		if (rules.date && !(trimmedValue instanceof Date)) {
			errors[key] = rules.message ?? `${label} is not a valid date`;
			continue;
		}

		// Major (18+ age check)
		if (
			rules.major &&
			trimmedValue instanceof Date &&
			new Date().getFullYear() - trimmedValue.getFullYear() < 18
		) {
			errors[key] = rules.message ?? 'You must be at least 18 years old';
			continue;
		}

		// Checkbox
		if (rules.checked && trimmedValue !== true) {
			errors[key] = rules.message ?? `${label} must be accepted`;
			continue;
		}
	}

	return errors;
}
