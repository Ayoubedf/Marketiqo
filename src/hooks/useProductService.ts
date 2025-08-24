import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import * as rawService from '@/services/productService';
import { getProductsParams } from '@/types/api';
import { useMemo } from 'react';

// type AuthService = {
// 	[K in keyof typeof rawService]: unknown;
// };

export function useProductService() {
	const axiosPrivate = useAxiosPrivate();

	return useMemo(
		() => ({
			getProducts: (params: getProductsParams, controller: AbortController) =>
				rawService.getProducts(axiosPrivate, params, controller),
			searchProducts: (
				params: { query: string },
				controller: AbortController
			) => rawService.searchProducts(axiosPrivate, params, controller),
		}),
		[axiosPrivate]
	);
}
