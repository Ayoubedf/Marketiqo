import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import * as rawService from '@/services/storeService';

// type AuthService = {
// 	[K in keyof typeof rawService]: rawService.method();
// };

export function useStoreService() {
	const axiosPrivate = useAxiosPrivate();

	return {
		createStore: (data: FormData) => rawService.createStore(axiosPrivate, data),
		getStores: (controller: AbortController) =>
			rawService.getStores(axiosPrivate, controller),
		getStore: (controller: AbortController, id: string) =>
			rawService.getStore(axiosPrivate, controller, id),
	};
}
