export const humanize = (str: string): string => {
	if (!str) return str;
	const words = str.split('-');
	return words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
