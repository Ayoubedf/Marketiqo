import { emailRegex, passwordRegex } from './constants';
import { extractRule } from './extractRules';

export function validateRequired(
	value: unknown,
	label: string,
	rule: true | [true, string] | undefined
) {
	const { value: required, message } = extractRule(rule);
	if (
		required &&
		(value === undefined || value === null || value === '' || value === false)
	) {
		return message ?? `${label} is required.`;
	}
}

export function validatePattern(
	value: unknown,
	label: string,
	rule: RegExp | [RegExp, string] | undefined
) {
	const { value: pattern, message } = extractRule(rule);
	if (pattern && typeof value === 'string' && !pattern.test(value)) {
		return message ?? `Invalid ${label}.`;
	}
}

export function validateEmail(
	value: unknown,
	_label: string,
	rule: true | [true, string] | undefined
) {
	const { value: email, message } = extractRule(rule);
	if (email && typeof value === 'string' && !emailRegex.test(value)) {
		return message ?? 'Invalid email address.';
	}
}

export function validatePassword(
	value: unknown,
	_label: string,
	rule: true | [true, string] | undefined
) {
	const { value: password, message } = extractRule(rule);
	if (password && typeof value === 'string' && !passwordRegex.test(value)) {
		return (
			message ??
			'Password must be at least 8 characters long and include letters, numbers, and a special character.'
		);
	}
}

export function validateConfirmed(
	value: unknown,
	_label: string,
	rule: true | [true, string] | undefined,
	reference?: unknown
) {
	const { value: confirmed, message } = extractRule(rule);
	if (confirmed && value !== reference) {
		return message ?? 'Passwords do not match.';
	}
}

export function validateMinLength(
	value: unknown,
	label: string,
	rule: number | [number, string] | undefined
) {
	const { value: min, message } = extractRule(rule);
	if (min && typeof value === 'string' && value.length < min) {
		return message ?? `${label} must be at least ${min} characters.`;
	}
	if (min && Array.isArray(value) && value.length < min) {
		return message ?? `You must select at least ${min} ${label}.`;
	}
}

export function validateMaxLength(
	value: unknown,
	label: string,
	rule: number | [number, string] | undefined
) {
	const { value: max, message } = extractRule(rule);
	if (max && typeof value === 'string' && value.length > max) {
		return message ?? `${label} must be at most ${max} characters.`;
	}
	if (max && Array.isArray(value) && value.length > max) {
		return message ?? `You must select at most ${max} ${label}.`;
	}
}

export function validateNumber(
	value: unknown,
	label: string,
	rule: true | [true, string] | undefined
) {
	const { value: numberRule, message } = extractRule(rule);
	const numValue = Number(value);
	if (numberRule && (value === '' || isNaN(numValue))) {
		return message ?? `${label} is invalid.`;
	}
}

export function validateMin(
	value: unknown,
	label: string,
	rule: number | [number, string] | undefined
) {
	const { value: min, message } = extractRule(rule);
	const numValue = Number(value);
	if (min !== undefined && numValue < min) {
		return message ?? `${label} must be at least ${min}.`;
	}
}

export function validateMax(
	value: unknown,
	label: string,
	rule: number | [number, string] | undefined
) {
	const { value: max, message } = extractRule(rule);
	const numValue = Number(value);
	if (max !== undefined && numValue > max) {
		return message ?? `${label} must be at most ${max}.`;
	}
}

export function validateDate(
	value: unknown,
	label: string,
	rule: true | [true, string] | undefined
) {
	const { value: date, message } = extractRule(rule);
	if (date && !(value instanceof Date)) {
		return message ?? `${label} is not a valid date.`;
	}
}

export function validateMajor(
	value: unknown,
	_label: string,
	rule: true | [true, string] | undefined
) {
	const { value: major, message } = extractRule(rule);
	if (major && value instanceof Date) {
		const age = new Date().getFullYear() - value.getFullYear();
		if (age < 18) {
			return message ?? 'You must be at least 18 years old.';
		}
	}
}

export function validateChecked(
	value: unknown,
	label: string,
	rule: true | [true, string] | undefined
) {
	const { value: checked, message } = extractRule(rule);
	if (checked && value !== true) {
		return message ?? `${label} must be accepted.`;
	}
}
