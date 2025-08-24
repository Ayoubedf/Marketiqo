import { StructuredDate } from '@/types/form';

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString();
};

export const parseStructuredDate = (structuredDate: StructuredDate): Date => {
	const { year, month, day, era } = structuredDate;
	const adjustedYear = era === 'AD' ? year : -year;
	const date = new Date(adjustedYear, month - 1, day);
	return date;
};
