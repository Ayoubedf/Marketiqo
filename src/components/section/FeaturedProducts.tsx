import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { useEffect, useState } from 'react';
import { Category, ErrorResponse } from '@/types/auth';
import { Product } from '@/types/api';
import { AxiosError, isCancel } from 'axios';
import { useProductService } from '@/hooks/useProductService';

const FeaturedProducts = () => {
	const [products, setProducts] = useState<[Product] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const productService = useProductService();
	const category: Category | null = null;

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			try {
				const res = await productService.getProducts(
					{ pageSize: 3, category },
					controller
				);
				setProducts(res.data);
			} catch (err) {
				if (isCancel(err)) return;
				if (err instanceof AxiosError)
					setError(
						err.response?.data ?? { status: 0, statusText: err.message }
					);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();

		return () => {
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category]);

	const Error = () => (
		<div className="col-span-full mx-auto w-full px-4 py-2">
			<h1 className="mt-8 text-center text-lg text-gray-700 italic">
				There was an error while retrieving the products.
			</h1>
			<p className="mt-4 text-center text-gray-400">
				Reason: {error?.statusText}
			</p>
			<img
				className="mx-auto w-full max-w-96"
				src="/assets/images/errors/NotFound2.svg"
				alt="data not found"
			/>
		</div>
	);

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<h2 className="text-center text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
				Featured Products
			</h2>
			<p className="text-md my-5 mb-16 text-center tracking-tight text-gray-500 italic dark:text-gray-400">
				Discover our carefully curated selection of high-quality products, each
				designed to elevate your daily life. From handmade items to modern
				essentials, these products seamlessly blend top-notch craftsmanship,
				style, and practicality for a truly exceptional experience.Discover our
				carefully curated selection of high-quality products, each designed to
				elevate your daily life. From handmade items to modern essentials, these
				products seamlessly blend top-notch craftsmanship, style, and
				practicality for a truly exceptional experience.
			</p>

			<div className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
				{error ? (
					<Error />
				) : loading ? (
					[...Array(3)].map((_, id) => <ProductSkeleton key={id} />)
				) : (
					products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))
				)}
			</div>
		</section>
	);
};

export default FeaturedProducts;
