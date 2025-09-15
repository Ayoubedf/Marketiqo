import ErrorMessage from '@/components/common/ErrorMessage';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { containerVariants } from '@/animations';
import { ApiError, Product } from '@/types';
import { motion } from 'framer-motion';

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
				<motion.p
					className="col-span-full text-center text-gray-500 italic"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					No products found.
				</motion.p>
			)}
		</motion.div>
	);
}
