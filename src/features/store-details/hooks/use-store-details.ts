import { APP_NAME } from '@/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import * as storeService from '@/services/storeService';
import { ApiError, isApiError, Store } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useStoreDetails = () => {
	const [error, setError] = useState<ApiError | null>(null);
	const [loading, setLoading] = useState(false);
	const [store, setStore] = useState<Store | null>(null);
	const { id = '' } = useParams();

	const axiosPrivate = useAxiosPrivate();
	const getStore = useCallback(
		(id: string, controller?: AbortController) =>
			storeService.getStore(axiosPrivate, id, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStore = async () => {
			const response = await getStore(id, controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else {
				setStore(response);
			}
			setLoading(false);
		};

		fetchStore();

		return () => {
			controller.abort();
		};
	}, [getStore, id]);

	const title = `${store?.name ?? 'Store'} | ${APP_NAME}`;
	useDocumentTitle(title);

	return {
		error,
		loading,
		store,
	};
};
