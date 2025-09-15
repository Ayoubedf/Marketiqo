import { motion } from 'framer-motion';
import ProductsGrid from '@/components/products/ProductsGrid';
import { useProducts } from '../hooks/use-products';

export const FeaturedProducts = () => {
	const { error, loading, products } = useProducts();

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

			<ProductsGrid error={error} loading={loading} products={products} />
		</section>
	);
};
