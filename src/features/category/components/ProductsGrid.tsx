import { containerVariants } from '@/shared/animations';
import { motion } from 'framer-motion';
import ErrorMessage from '@/shared/components/common/ErrorMessage';
import ProductSkeleton from '@/shared/components/products/ProductSkeleton';
import ProductCard from '@/shared/components/products/ProductCard';
import { ApiError, Product } from '@/types';

interface ProductsGridProps {
	error: ApiError | null;
	loading: boolean;
	products: Product[] | null;
}

export default function ProductsGrid({
	error,
	loading,
	products,
}: ProductsGridProps) {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
		>
			{error ? (
				<ErrorMessage
					title="There was an error while retrieving the products."
					reason={error.message}
				/>
			) : loading ? (
				[...Array(3)].map((_, id) => <ProductSkeleton key={`skeleton-${id}`} />)
			) : products && products.length > 0 ? (
				products.map((product) => (
					<ProductCard key={product._id} product={product} />
				))
			) : (
				<p className="col-span-full text-center text-gray-500 italic">
					No products found.
				</p>
			)}
		</motion.div>
	);
}
