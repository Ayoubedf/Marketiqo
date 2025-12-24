import { APP_NAME } from '@/core/config/constants';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { getStores } from '@/services/storeService';
import { ApiError, isApiError, Store } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAxiosPrivate } from '@/features/auth';

export const useStoresList = () => {
	const [stores, setStores] = useState<Store[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const axiosPrivate = useAxiosPrivate();
	const handleGetStores = useCallback(
		(controller?: AbortController) => getStores(axiosPrivate, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStores = async () => {
			const response = await handleGetStores(controller);
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
	}, [handleGetStores]);

	const title = useMemo(() => `Stores | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		error,
		loading,
		stores,
	};
};
