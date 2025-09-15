export function extractRule<T>(rule: T | [T, string] | undefined): {
	value?: T;
	message?: string;
} {
	if (Array.isArray(rule)) {
		return { value: rule[0], message: rule[1] };
	}
	if (rule !== undefined) {
		return { value: rule as T };
	}
	return {};
}
