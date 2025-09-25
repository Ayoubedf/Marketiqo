import { APP_NAME } from '@/core/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import * as productService from '@/services/productService';
import { ApiError, Category, isApiError, isCategory, Product } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { slugify } from '../utils/format';
import { capitalize } from '@/shared/utils/capitalize';

export function useCategory() {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const axiosPrivate = useAxiosPrivate();
	const { cat = '' } = useParams<{ cat?: string }>();
	const category: Category | null =
		cat && isCategory(cat) ? slugify(cat) : null;

	const getProductsByCategory = useCallback(
		(category: Category, controller?: AbortController) =>
			productService.getProductsByCategory(axiosPrivate, category, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		if (!category) return;

		const fetchProducts = async (
			category: Category,
			controller?: AbortController
		) => {
			setLoading(true);
			const response = await getProductsByCategory(category, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		};

		const controller = new AbortController();
		fetchProducts(category, controller);

		return () => controller.abort();
	}, [category, getProductsByCategory]);

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
