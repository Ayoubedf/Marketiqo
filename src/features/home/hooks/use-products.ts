import { useAxiosPrivate } from '@/features/auth';
import { ApiError, getProductsParams, isApiError, Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import * as productService from '@/services/productService';

export const useProducts = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const axiosPrivate = useAxiosPrivate();

	const getProducts = useCallback(
		(params: getProductsParams, controller?: AbortController) =>
			productService.getProducts(axiosPrivate, params, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			const response = await getProducts({ pageSize: 3 }, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		};

		fetchProducts();
		return () => controller.abort();
	}, [getProducts]);

	return {
		error,
		loading,
		products,
	};
};
