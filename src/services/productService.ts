import { API_ENDPOINTS } from '@/core/config/constants';
import {
	getProductsParams,
	Category,
	searchProductsParams,
	ProductsResponse,
	Product,
} from '@/types';
import { Axios } from 'axios';
import { apiRequest } from './api';

export async function createProduct(
	axios: Axios,
	data: FormData,
	controller?: AbortController
) {
	return apiRequest<Product>(
		{
			url: API_ENDPOINTS.PRODUCTS.ROOT,
			method: 'POST',
			data,
			signal: controller?.signal,
		},
		{
			title: 'Product Added',
			description: 'Your product has been added successfully.',
		},
		{
			title: 'Failed to Add Product',
		},
		axios
	);
}

export async function addStoreProducts(
	axios: Axios,
	storeId: string,
	data: FormData,
	controller?: AbortController
) {
	return apiRequest<ProductsResponse>(
		{
			url: API_ENDPOINTS.PRODUCTS.STORE(storeId),
			method: 'POST',
			data,
			signal: controller?.signal,
		},
		{
			title: 'Product Added',
			description: 'Your product has been added successfully.',
		},
		{
			title: 'Failed to Add Product',
		},
		axios
	);
}

export async function getProducts(
	axios: Axios,
	params: getProductsParams,
	controller?: AbortController
) {
	return apiRequest<ProductsResponse>(
		{
			url: API_ENDPOINTS.PRODUCTS.ROOT,
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
	return apiRequest<ProductsResponse>(
		{
			url: API_ENDPOINTS.PRODUCTS.ROOT,
			params: { category },
			method: 'GET',
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}

export async function getStoreProducts(
	axios: Axios,
	storeId: string,
	controller?: AbortController
) {
	return apiRequest<ProductsResponse>(
		{
			url: API_ENDPOINTS.PRODUCTS.STORE(storeId),
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
	return apiRequest<ProductsResponse>(
		{
			url: API_ENDPOINTS.PRODUCTS.ROOT,
			method: 'GET',
			params,
			signal: controller?.signal,
		},
		undefined,
		undefined,
		axios
	);
}
