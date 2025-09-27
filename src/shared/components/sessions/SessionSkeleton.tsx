import { Skeleton } from '../ui/skeleton';

const SessionSkeleton = () => {
	return (
		<div className="flex animate-pulse items-center justify-between rounded-lg border p-3">
			{/* Left side: icon + text */}
			<div className="flex items-center gap-3">
				{/* Device icon placeholder */}
				<Skeleton className="h-5 w-5 rounded-md" />

				<div className="space-y-2">
					{/* Browser + device line */}
					<Skeleton className="h-4 w-32" />
					{/* IP + date line */}
					<Skeleton className="h-3 w-40" />
				</div>
			</div>

			{/* Right side: button */}
			<Skeleton className="h-8 w-16 rounded-md" />
		</div>
	);
};

export default SessionSkeleton;
