import useAxiosPrivate from '@/hooks/use-axios-private';
import * as rawService from '@/services/productService';
import { getProductsParams, Category } from '@/types';
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
			getProductsByCategory: (
				category: Category,
				controller: AbortController
			) => rawService.getProductsByCategory(axiosPrivate, category, controller),
			searchProducts: (
				params: { query: string },
				controller: AbortController
			) => rawService.searchProducts(axiosPrivate, params, controller),
		}),
		[axiosPrivate]
	);
}
