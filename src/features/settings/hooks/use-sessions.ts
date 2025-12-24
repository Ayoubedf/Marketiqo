import { useAxiosPrivate } from '@/features/auth';
import { getSessions } from '@/services/sessionService';
import { ApiError, isApiError, ISession } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export default function useSessions() {
	const [sessions, setSessions] = useState<ISession[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const axiosPrivate = useAxiosPrivate();
	const handleGetSessions = useCallback(
		(controller?: AbortController) => getSessions(axiosPrivate, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchSessions = async () => {
			const response = await handleGetSessions(controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setSessions(response);
			setLoading(false);
		};

		fetchSessions();
		return () => controller.abort();
	}, [handleGetSessions]);

	return {
		error,
		loading,
		sessions,
	};
}
