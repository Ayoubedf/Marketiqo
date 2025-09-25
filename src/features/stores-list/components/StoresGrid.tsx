import ErrorMessage from '@/shared/components/common/ErrorMessage';
import StoreCard from '@/shared/components/stores/StoreCard';
import StoreSkeleton from '@/shared/components/stores/StoreSkeleton';
import { ApiError, Store } from '@/types';
import { motion } from 'framer-motion';

interface StoresGridProps {
	error: ApiError | null;
	loading: boolean;
	stores: Store[] | null;
}

export const StoresGrid = ({ error, loading, stores }: StoresGridProps) => {
	return (
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
				<motion.p
					className="col-span-full text-center text-gray-500 italic"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					No products found.
				</motion.p>
			)}
		</div>
	);
};
