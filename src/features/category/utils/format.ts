import { Category } from '@/types';
import { capitalize } from '@/shared/utils/capitalize';

export const humanize = (str: string): string => {
	if (!str) return str;
	const words = str.split('-');
	return words.map((word) => capitalize(word)).join(' ');
};

export const slugify = (str: string): Category => {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') as Category;
};
