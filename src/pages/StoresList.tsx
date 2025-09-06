import ErrorMessage from '@/components/common/ErrorMessage';
import StoreSkeleton from '@/components/common/ProductSkeleton';
import StoreCard from '@/components/common/StoreCard';
import { APP_NAME } from '@/constants/app';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useStoreService } from '@/hooks/use-store-service';
import { ApiError, isApiError, Store } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StoresList = () => {
	const [stores, setStores] = useState<Store[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const storeService = useStoreService();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStores = async () => {
			const response = await storeService.getStores(controller);
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
	}, [storeService]);

	const title = `Stores | ${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mb-12 text-center">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-2 text-4xl font-extrabold"
				>
					Discover Stores
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="mx-auto max-w-xl text-gray-500"
				>
					Explore unique brands and businesses built on Marketiqo. Click any
					store to browse their products and learn more.
				</motion.p>
			</div>

			<div className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
				{error ? (
					<ErrorMessage
						title="There was an error while retrieving the stores."
						reason={error.message}
					/>
				) : loading ? (
					[...Array(3)].map((_, id) => <StoreSkeleton key={`skeleton-${id}`} />)
				) : stores && stores.length > 0 ? (
					stores.map((store) => (
						<motion.div
							key={store._id}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<StoreCard store={store} />
						</motion.div>
					))
				) : (
					<p className="col-span-full text-center text-gray-500 italic">
						No stores found.
					</p>
				)}
			</div>
		</section>
	);
};

export default StoresList;
