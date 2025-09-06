import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { APP_NAME } from '@/constants/app';
import { useProductService } from '@/hooks/use-product-service';
import { ApiError, isApiError, Product } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { containerVariants, itemVariants } from '@/constants/motion';

type Params = {
	q?: string;
};

const Collections = () => {
	const [products, setProducts] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const { q: query } = useParams<Params>();
	const productService = useProductService();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			const response = await productService.searchProducts(
				{ query: query || '' },
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
	}, [productService, query]);

	const title = `Collections | ${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mt-1 mb-3 flex w-full items-center justify-between pl-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">Products</h3>
					{query && <p className="text-slate-500">Results for "{query}".</p>}
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
		</section>
	);
};

export default Collections;
