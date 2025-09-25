import { Skeleton } from '../ui/skeleton';

const ProductSkeleton = () => {
	return (
		<div className="mx-auto w-96 max-w-full animate-pulse rounded-xl border border-gray-500/10 shadow-sm dark:border-gray-200/20">
			{/* Image placeholder */}
			<div className="h-80 w-full overflow-hidden rounded-t-xl bg-gray-100" />

			{/* Content */}
			<div className="rounded-b-xl bg-white p-5 dark:bg-gray-800">
				{/* Title */}
				<Skeleton className="h-6 w-4/5" />

				{/* Description */}
				<div className="mt-3 mb-5 space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</div>

				{/* Price + rating */}
				<div className="flex gap-2">
					<del>
						<Skeleton className="h-4 w-10" />
					</del>
					<Skeleton className="h-4 w-10" />

					<div className="ml-auto flex flex-col items-end">
						{/* Rating stars */}
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="mx-[2.5px] h-4 w-4 rounded-full" />
							))}
						</div>
						{/* Reviews */}
						<Skeleton className="mt-1 h-4 w-12" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductSkeleton;
