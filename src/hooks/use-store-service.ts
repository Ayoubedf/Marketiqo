import useAxiosPrivate from '@/hooks/use-axios-private';
import * as rawService from '@/services/storeService';
import { useMemo } from 'react';

// type AuthService = {
// 	[K in keyof typeof rawService]: rawService.method();
// };

export function useStoreService() {
	const axiosPrivate = useAxiosPrivate();

	return useMemo(
		() => ({
			createStore: (data: FormData) =>
				rawService.createStore(axiosPrivate, data),
			getStores: (controller: AbortController) =>
				rawService.getStores(axiosPrivate, controller),
			getStore: (controller: AbortController, id: string) =>
				rawService.getStore(axiosPrivate, controller, id),
		}),
		[axiosPrivate]
	);
}
