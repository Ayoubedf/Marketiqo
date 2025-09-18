export const humanize = (str: string): string => {
	if (!str) return str;
	const words = str.split('-');
	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const slugify = (str: string): string => {
	if (!str) return str;
	return str.toLowerCase().replace(/\s+/g, '-');
};
