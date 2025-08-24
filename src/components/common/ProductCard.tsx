import { Product } from '@/types/api';
import { StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type ProductFeature =
	| 'new'
	| 'best seller'
	| 'limited edition'
	| 'exclusive'
	| 'coming soon'
	| 'discounted'
	| 'out of stock';

const featureColors: Record<ProductFeature, string> = {
	new: 'blue',
	'best seller': 'red',
	'limited edition': 'purple',
	exclusive: 'green',
	'coming soon': 'yellow',
	discounted: 'orange',
	'out of stock': 'gray',
};

const ProductCard = ({ product }: { product: Product }) => {
	const featureColor = featureColors[product.feature as ProductFeature];

	return (
		<div className="group relative mx-auto grid max-w-96 grid-rows-1 overflow-clip rounded-xl border-[1px] border-gray-500/10 shadow-sm dark:border-gray-200/20">
			{featureColor && (
				<span
					className={`absolute top-0 left-0 m-2 inline-flex items-center rounded-md bg-${featureColor}-500 z-10 px-2 py-1 text-xs font-medium text-gray-50 capitalize`}
				>
					{product.feature}
				</span>
			)}
			<div className="w-full overflow-clip rounded-t-xl bg-gray-200 group-hover:opacity-75 lg:h-80">
				<img
					alt={product.imageAlt}
					src={`/assets/images/products/${product.imageSrc}`}
					loading="lazy"
					className="h-full w-full object-cover object-center lg:h-full lg:w-full"
				/>
			</div>
			<div className="rounded-b-xl bg-white p-5 dark:bg-gray-800">
				<h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
					<Link to={product.href}>{product.name}</Link>
				</h3>

				<p className="mt-3 mb-5 line-clamp-3 justify-center text-sm text-gray-500 dark:text-gray-400">
					{product.description}
				</p>
				<div className="flex gap-2">
					<del className="text-sm font-medium text-gray-600 dark:text-gray-400">
						${product.price.old}
					</del>
					<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
						${product.price.current}
					</span>
					<div className="ml-auto flex flex-col items-end">
						<div className="flex items-center">
							{[...Array(5)].map((_, key) => (
								<StarIcon
									key={key}
									size={20}
									fill="currentColor"
									className={
										key < Math.round(product.rating.rate)
											? 'text-yellow-400'
											: 'text-gray-400/50'
									}
								/>
							))}
						</div>
						<p className="mt-1 text-sm text-gray-400">
							{product.rating.count} reviews
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
