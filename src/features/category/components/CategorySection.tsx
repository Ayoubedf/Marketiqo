import { motion } from 'framer-motion';
import ProductsHeader from './ProductsHeader';
import ProductsGrid from '@/components/products/ProductsGrid';

import { useCategory } from '../hooks/use-category';

export default function CategorySection() {
	const { error, loading, products, category } = useCategory();

	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
		>
			<ProductsHeader category={category} />
			<ProductsGrid error={error} loading={loading} products={products} />
		</motion.section>
	);
}
