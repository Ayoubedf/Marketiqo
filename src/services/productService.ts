import { API_ENDPOINTS } from '@/constants/app';
import { getProductsParams, Product, Category } from '@/types';
import { Axios } from 'axios';
import { apiRequest } from './api';

export async function getProducts(
	axios: Axios,
	params: getProductsParams,
	controller?: AbortController
) {
	return apiRequest<Product[]>(
		{
			url: API_ENDPOINTS.PRODUCTS,
			method: 'GET',
			params,
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}

export async function getProductsByCategory(
	axios: Axios,
	category: Category,
	controller?: AbortController
) {
	return apiRequest<Product[]>(
		{
			url: `${API_ENDPOINTS.PRODUCTS}/${category}`,
			method: 'GET',
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}

export async function searchProducts(
	axios: Axios,
	params: { query: string },
	controller?: AbortController
) {
	return apiRequest<Product[]>(
		{
			url: API_ENDPOINTS.PRODUCTS_SEARCH,
			method: 'GET',
			params,
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}
