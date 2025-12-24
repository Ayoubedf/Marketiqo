import { APP_NAME } from '@/core/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { getStore } from '@/services/storeService';
import { getStoreProducts } from '@/services/productService';
import { ApiError, isApiError, Store } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useStoreDetails = () => {
	const [error, setError] = useState<ApiError | null>(null);
	const [loading, setLoading] = useState(false);
	const [store, setStore] = useState<Store | null>(null);
	const { id = '' } = useParams();

	const axiosPrivate = useAxiosPrivate();
	const handleGetStore = useCallback(
		(id: string, controller?: AbortController) =>
			getStore(axiosPrivate, id, controller),
		[axiosPrivate]
	);
	const handleGetProducts = useCallback(
		(id: string, controller?: AbortController) =>
			getStoreProducts(axiosPrivate, id, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		if (!id) return;

		const controller = new AbortController();
		setLoading(true);

		const fetchStore = async () => {
			const [store, products] = await Promise.all([
				handleGetStore(id, controller),
				handleGetProducts(id, controller),
			]);

			if (isApiError(store)) {
				if (store.code !== 'REQUEST_CANCELLED') setError(store);
				return;
			}
			if (isApiError(products)) {
				if (products.code !== 'REQUEST_CANCELLED') setError(products);
				return;
			}

			store.products = products.items;
			setStore(store);
			setLoading(false);
		};

		fetchStore();

		return () => controller.abort();
	}, [handleGetProducts, handleGetStore, id]);

	const title = useMemo(
		() => `${store?.name ?? 'Store'} | ${APP_NAME}`,
		[store?.name]
	);
	useDocumentTitle(title);

	return {
		error,
		loading,
		store,
	};
};
