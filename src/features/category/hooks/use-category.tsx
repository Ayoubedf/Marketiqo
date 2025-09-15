import { APP_NAME } from '@/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import * as productService from '@/services/productService';
import { ApiError, Category, isApiError, Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function useCategory() {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const axiosPrivate = useAxiosPrivate();
	const { cat } = useParams<{ cat?: string }>();
	const category: Category | null = cat
		? (cat.replace('_', ' ') as Category)
		: null;

	const getProductsByCategory = useCallback(
		(category: Category, controller?: AbortController) =>
			productService.getProductsByCategory(axiosPrivate, category, controller),
		[axiosPrivate]
	);

	const fetchProducts = useCallback(
		async (category: Category, controller?: AbortController) => {
			setLoading(true);
			const response = await getProductsByCategory(category, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		},
		[getProductsByCategory]
	);

	useEffect(() => {
		if (!category) return;

		const controller = new AbortController();
		fetchProducts(category, controller);

		return () => controller.abort();
	}, [category, fetchProducts, getProductsByCategory]);

	const title = `${category && category?.charAt(0).toUpperCase() + category?.slice(1)} | ${APP_NAME}`;
	useDocumentTitle(title);

	return {
		products,
		category,
		loading,
		error,
	};
}
