import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import ErrorMessage from '@/components/common/ErrorMessage';
import { APP_NAME } from '@/constants/app';
import { useProductService } from '@/hooks/use-product-service';
import { ApiError, isApiError, Product, Category as Cat } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { containerVariants, itemVariants } from '@/constants/motion';

const Category = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const productService = useProductService();

	const { cat } = useParams<{ cat?: string }>();
	const category: Cat | null = cat ? (cat.replace('_', ' ') as Cat) : null;

	useEffect(() => {
		if (!category) return;
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			const response = await productService.getProductsByCategory(
				category,
				controller
			);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else setProducts(response);
			setLoading(false);
		};
		fetchProducts();

		return () => {
			controller.abort();
		};
	}, [category, productService]);

	const title = `${category && category?.charAt(0).toUpperCase() + category?.slice(1)} | ${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
		>
			<div className="mt-1 mb-3 flex w-full items-center justify-between pl-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">Products</h3>
					{category && (
						<p className="text-slate-500">
							Overview of the {category.toUpperCase()}.
						</p>
					)}
				</div>
			</div>

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
		</motion.section>
	);
};

export default Category;
