import { ValidationErrors, ValidationSchema } from './types';
import {
	validateChecked,
	validateConfirmed,
	validateDate,
	validateEmail,
	validateMajor,
	validateMax,
	validateMaxLength,
	validateMin,
	validateMinLength,
	validateNumber,
	validatePassword,
	validatePattern,
	validateRequired,
} from './validators';

export function validateSchema<T extends Record<string, unknown>>(
	values: Partial<T>,
	schema: ValidationSchema<T>
): ValidationErrors<T> {
	const errors: ValidationErrors<T> = {};

	for (const key in schema) {
		const rules = schema[key];
		const value =
			typeof values[key] === 'string'
				? (values[key] as string).trim()
				: values[key];
		const label = rules.fieldName || key;

		// Call validators one by one
		const validators = [
			() => validateRequired(value, label, rules.required),
			() => validatePattern(value, label, rules.pattern),
			() => validateEmail(value, label, rules.email),
			() => validatePassword(value, label, rules.password),
			() =>
				validateConfirmed(value, label, rules.confirmed, values['password']),
			() => validateMinLength(value, label, rules.minLength),
			() => validateMaxLength(value, label, rules.maxLength),
			() => validateNumber(value, label, rules.number),
			() => validateMin(value, label, rules.min),
			() => validateMax(value, label, rules.max),
			() => validateDate(value, label, rules.date),
			() => validateMajor(value, label, rules.major),
			() => validateChecked(value, label, rules.checked),
		];

		for (const check of validators) {
			const error = check();
			if (error) {
				errors[key] = error;
				break; // stop at first error per field
			}
		}
	}

	return errors;
}
