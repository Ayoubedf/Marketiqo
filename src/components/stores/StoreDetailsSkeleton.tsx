import { Skeleton } from '../ui/skeleton';
import ProductSkeleton from '../products/ProductSkeleton';

const StoreDetailsSkeleton = () => (
	<div className="container mx-auto max-w-6xl space-y-8 px-6 py-16">
		{/* Store Header Skeleton */}
		<div className="mb-8 flex flex-wrap items-center justify-between gap-8 rounded-xl p-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-16 w-16 rounded-2xl" />
				<div>
					<Skeleton className="mb-2 h-6 w-40" />
					<Skeleton className="h-4 w-28" />
				</div>
			</div>
			<div className="flex gap-3">
				<Skeleton className="h-10 w-28 rounded-md" />
				<Skeleton className="h-10 w-32 rounded-md" />
			</div>
		</div>

		{/* Products Skeleton */}
		<section>
			<div className="mb-4 flex items-center justify-between">
				<Skeleton className="h-6 w-32" />
			</div>
			<div className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
				{[...Array(3)].map((_, id) => (
					<ProductSkeleton key={`store-skeleton-${id}`} />
				))}
			</div>
		</section>
	</div>
);

export default StoreDetailsSkeleton;
