import { Store } from '@/types/api';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }: { store: Store }) => {
	return (
		<div
			key={store._id}
			className="bg-base-100 relative flex flex-col overflow-clip rounded-lg shadow-sm outline-offset-2 transition-all"
		>
			<figure className="relative h-32 w-full bg-gray-300">
				<Avatar className="absolute bottom-0 left-5 flex size-15 translate-y-1/5 items-center justify-center overflow-hidden rounded-2xl ring-2 ring-gray-100">
					<AvatarImage
						src={store?.logo}
						alt={`${store?.name}'s logo`}
						className="size-full rounded-2xl object-cover"
					/>
					<AvatarFallback className="flex h-full w-full items-center justify-center bg-white text-xs">
						{store?.name}
					</AvatarFallback>
				</Avatar>
			</figure>
			<div className="flex flex-auto flex-col gap-2 p-6">
				<Link
					to={`/stores/${store._id}`}
					className="text-gray-700 decoration-inherit"
				>
					<h2 className="flex items-center gap-2 text-xl font-semibold">
						{store.name}
					</h2>
				</Link>
				<p className="mb-2 line-clamp-3 text-sm text-gray-600">
					{store.description}
				</p>
				<div className="flex flex-wrap items-start justify-end gap-2 text-sm">
					<CategoryTags categories={store.categories} />
				</div>
			</div>
		</div>
	);
};

function CategoryTags({
	categories,
	max = 3,
}: {
	categories: string[];
	max?: number;
}) {
	return (
		<div className="flex flex-wrap items-start justify-end gap-2 text-xs">
			{categories.slice(0, max).map((cat) => (
				<div key={cat} className="rounded-md border px-2 py-1.5 text-gray-700">
					{cat}
				</div>
			))}
			{categories.length > max && (
				<div className="rounded-lg border bg-gray-50 px-2 py-1.5 text-gray-500">
					+{categories.length - max} more
				</div>
			)}
		</div>
	);
}

export default StoreCard;
