import { Skeleton } from '@/shared/components/ui/skeleton';

const StoreSkeleton = () => {
	return (
		<div className="bg-base-100 relative flex animate-pulse flex-col overflow-clip rounded-lg shadow-sm">
			{/* Header image placeholder */}
			<div className="relative h-32 w-full bg-gray-200">
				{/* Avatar placeholder */}
				<div className="absolute bottom-0 left-5 translate-y-1/5">
					<Skeleton className="h-16 w-16 rounded-2xl ring-2 ring-gray-100" />
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-auto flex-col gap-3 p-6">
				{/* Store name */}
				<Skeleton className="h-6 w-2/3" />

				{/* Description */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</div>

				{/* Category tags */}
				<div className="mt-3 flex flex-wrap gap-2">
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} className="h-6 w-16 rounded-md" />
					))}
				</div>
			</div>
		</div>
	);
};

export default StoreSkeleton;
