import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { useEffect, useState } from 'react';
import { ApiError, isApiError, Product } from '@/types';
import { useProductService } from '@/hooks/use-product-service';
import { motion } from 'framer-motion';
import ErrorMessage from '../common/ErrorMessage';
import { containerVariants, itemVariants } from '@/constants/motion';

const FeaturedProducts = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const productService = useProductService();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			const response = await productService.getProducts(
				{ pageSize: 3 },
				controller
			);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		};

		fetchProducts();
		return () => controller.abort();
	}, [productService]);

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50"
			>
				Featured Products
			</motion.h2>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="text-md my-5 mb-16 text-center tracking-tight text-gray-500 italic dark:text-gray-400"
			>
				Discover our carefully curated selection of high-quality products, each
				designed to elevate your daily life. From handmade items to modern
				essentials, these products seamlessly blend top-notch craftsmanship,
				style, and practicality for a truly exceptional experience.
			</motion.p>

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
					[...Array(3)].map((_, id) => (
						<ProductSkeleton key={`skeleton-${id}`} />
					))
				) : products && products.length > 0 ? (
					products.map((product) => (
						<motion.div key={product._id} variants={itemVariants}>
							<ProductCard product={product} />
						</motion.div>
					))
				) : (
					<p className="col-span-full text-center text-gray-500 italic">
						No products found.
					</p>
				)}
			</motion.div>
		</section>
	);
};

export default FeaturedProducts;
