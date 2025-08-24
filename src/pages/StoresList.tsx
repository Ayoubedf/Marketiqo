import StoreSkeleton from '@/components/common/ProductSkeleton';
import StoreCard from '@/components/common/StoreCard';
import { APP_NAME } from '@/constants/app';
import { useStoreService } from '@/hooks/useStoreService';
import { Store } from '@/types/api';
import { AxiosError, isCancel } from 'axios';
import { useEffect, useState } from 'react';
import { ErrorResponse } from 'react-router-dom';

const StoresList = () => {
	const [stores, setStores] = useState<[Store] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const storeService = useStoreService();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStores = async () => {
			try {
				const res = await storeService.getStores(controller);
				setStores(res.data);
			} catch (err) {
				if (isCancel(err)) return;
				if (err instanceof AxiosError)
					setError(
						err.response?.data ?? { status: 0, statusText: err.message }
					);
			} finally {
				setLoading(false);
			}
		};

		fetchStores();

		return () => {
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const Error = () => (
		<div className="col-span-full mx-auto w-full px-4 py-2">
			<h1 className="mt-8 text-center text-lg text-gray-700 italic">
				There was an error while retrieving the stores.
			</h1>
			<p className="mt-4 text-center text-gray-400">
				Reason: {error?.statusText}
			</p>
			<img
				className="mx-auto w-full max-w-96"
				src="/assets/images/errors/NotFound2.svg"
				alt="data not found"
			/>
		</div>
	);

	document.title = `Collections | ${APP_NAME}`;
	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mb-12 text-center">
				<h1 className="mb-2 text-4xl font-extrabold">Discover Stores</h1>
				<p className="mx-auto max-w-xl text-gray-500">
					Explore unique brands and businesses built on Marketiqo. Click any
					store to browse their products and learn more.
				</p>
			</div>

			<div className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
				{error ? (
					<Error />
				) : loading ? (
					[...Array(3)].map((_, id) => <StoreSkeleton key={id} />)
				) : (
					stores?.map((store) => <StoreCard key={store._id} store={store} />)
				)}
			</div>
		</section>
	);
};

export default StoresList;
