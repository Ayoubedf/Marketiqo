type FieldSchema = {
	fieldName?: string;
	required?: true | [true, string];
	email?: true | [true, string];
	password?: true | [true, string];
	confirmed?: true | [true, string];
	minLength?: number | [number, string];
	maxLength?: number | [number, string];
	min?: number | [number, string];
	max?: number | [number, string];
	date?: true | [true, string];
	number?: true | [true, string];
	major?: true | [true, string];
	checked?: true | [true, string];
	pattern?: RegExp | [RegExp, string];
};

export type ValidationSchema<T> = {
	[K in keyof T]: FieldSchema;
};

// export type ValidationErrors<T> = {
// 	[K in keyof T]?: string;
// };
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;
