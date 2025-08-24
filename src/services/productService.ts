import { API_ENDPOINTS } from '@/constants/app';
import { getProductsParams } from '@/types/api';
import { Axios } from 'axios';

export async function getProducts(
	axios: Axios,
	params: getProductsParams,
	controller: AbortController
) {
	const res = await axios.get(API_ENDPOINTS.PRODUCTS, {
		params,
		signal: controller.signal,
	});
	return res;
}

export async function searchProducts(
	axios: Axios,
	params: { query: string },
	controller: AbortController
) {
	const res = await axios.get(API_ENDPOINTS.PRODUCTS_SEARCH, {
		params,
		signal: controller.signal,
	});
	return res;
}
