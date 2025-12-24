import { APP_NAME } from '@/core/config/constants';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { getProductsByCategory } from '@/services/productService';
import { ApiError, Category, isApiError, isCategory, Product } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxiosPrivate } from '@/features/auth';
import { capitalize } from '@/shared/utils/capitalize';

export function useCategory() {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const axiosPrivate = useAxiosPrivate();
	const { cat = '' } = useParams<{ cat?: string }>();
	const category: Category | null = cat && isCategory(cat) ? cat : null;

	const handleGetProductsByCategory = useCallback(
		(category: Category, controller?: AbortController) =>
			getProductsByCategory(axiosPrivate, category, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		if (!category) return;

		const fetchProducts = async (
			category: Category,
			controller?: AbortController
		) => {
			setLoading(true);
			const response = await handleGetProductsByCategory(category, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response.items);
			setLoading(false);
		};

		const controller = new AbortController();
		fetchProducts(category, controller);

		return () => controller.abort();
	}, [category, handleGetProductsByCategory]);

	const title = useMemo(
		() => `${(category && capitalize(category)) || 'Category'} | ${APP_NAME}`,
		[category]
	);
	useDocumentTitle(title);

	return {
		products,
		category,
		loading,
		error,
	};
}
