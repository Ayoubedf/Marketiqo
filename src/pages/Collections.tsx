import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { APP_NAME } from '@/constants/app';
import { useProductService } from '@/hooks/useProductService';
import { Product } from '@/types/api';
import { AxiosError, isCancel } from 'axios';
import { useEffect, useState } from 'react';
import { ErrorResponse, useParams } from 'react-router-dom';

const Collections = () => {
	const [products, setProducts] = useState<[Product] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const query = useParams().q;
	const productService = useProductService();

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchProducts = async () => {
			try {
				const res = await productService.searchProducts(
					{
						query: query || '',
					},
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
	}, [productService, query]);

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

	document.title = `Collections | ${APP_NAME}`;
	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div className="mt-1 mb-3 flex w-full items-center justify-between pl-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">Products</h3>
					{query && <p className="text-slate-500">Results of "{query}".</p>}
				</div>
				{/* <div className='ml-3'>
					<div className='w-full max-w-sm min-w-[300px] relative'>
						<Input placeholder='Search for products...' className='rounded-md' />
					</div>
				</div> */}
			</div>

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

export default Collections;
