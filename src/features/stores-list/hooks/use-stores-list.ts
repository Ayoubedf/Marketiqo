import { APP_NAME } from '@/config/constants';
import { useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import * as storeService from '@/services/storeService';
import { ApiError, isApiError, Store } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useStoresList = () => {
	const [stores, setStores] = useState<Store[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const axiosPrivate = useAxiosPrivate();
	const getStores = useCallback(
		(controller?: AbortController) =>
			storeService.getStores(axiosPrivate, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStores = async () => {
			const response = await getStores(controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setStores(response);
			setLoading(false);
		};
		fetchStores();

		return () => {
			controller.abort();
		};
	}, [getStores]);

	const title = useMemo(() => `Stores | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		error,
		loading,
		stores,
	};
};
