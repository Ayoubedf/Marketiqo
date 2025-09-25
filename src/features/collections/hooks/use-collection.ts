import { APP_NAME } from '@/core/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import * as productService from '@/services/productService';
import { ApiError, isApiError, Product, searchProductsParams } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

type Params = {
	q?: string;
};

export default function useCollection() {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const { q: query } = useParams<Params>();

	const axiosPrivate = useAxiosPrivate();
	const searchProducts = useCallback(
		(params: searchProductsParams, controller?: AbortController) =>
			productService.searchProducts(axiosPrivate, params, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			const response = await searchProducts({ query: query || '' }, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		};

		fetchProducts();
		return () => controller.abort();
	}, [query, searchProducts]);

	const title = useMemo(() => `Collections | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		error,
		loading,
		products,
		query,
	};
}
