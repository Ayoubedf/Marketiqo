import { API_ENDPOINTS } from '@/config/constants';
import {
	getProductsParams,
	Product,
	Category,
	searchProductsParams,
} from '@/types';
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
			url: API_ENDPOINTS.PRODUCT_CATEGORY(category),
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
	params: searchProductsParams,
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
