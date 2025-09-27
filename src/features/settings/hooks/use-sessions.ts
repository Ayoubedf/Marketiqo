import { useAxiosPrivate } from '@/features/auth';
import * as sessionService from '@/services/sessionService';
import { ApiError, isApiError, ISession } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export default function useSessions() {
	const [sessions, setSessions] = useState<ISession[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const axiosPrivate = useAxiosPrivate();
	const getSessions = useCallback(
		(controller?: AbortController) =>
			sessionService.getSessions(axiosPrivate, controller),
		[axiosPrivate]
	);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchSessions = async () => {
			const response = await getSessions(controller);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setSessions(response);
			setLoading(false);
		};

		fetchSessions();
		return () => controller.abort();
	}, [getSessions]);

	return {
		error,
		loading,
		sessions,
	};
}
