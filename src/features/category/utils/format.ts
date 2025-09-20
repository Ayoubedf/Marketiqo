import { Category } from '@/types';

export const humanize = (str: string): string => {
	if (!str) return str;
	const words = str.split('-');
	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const slugify = (str: string): Category => {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') as Category;
};
