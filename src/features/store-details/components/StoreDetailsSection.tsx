import ErrorMessage from '@/shared/components/common/ErrorMessage';
import { useStoreDetails } from '../hooks/use-store-details';
import StoreDetailsSkeleton from '@/shared/components/stores/StoreDetailsSkeleton';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { AddProduct } from './actions/AddProduct';
import { ManageStore } from './actions/ManageStore';
import { Store } from '@/types';
import ProductsGrid from '@/shared/components/products/ProductsGrid';

const StoreHeader = ({ store }: { store: Store }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="mb-8 flex flex-wrap items-center justify-between gap-8 rounded-xl p-6"
		>
			<StoreInfo store={store} />
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className="flex gap-3"
			>
				<AddProduct />
				<ManageStore store={store} />
			</motion.div>
		</motion.div>
	);
};

const StoreInfo = ({ store }: { store: Store }) => {
	return (
		<div className="flex items-center gap-4">
			<Avatar className="flex size-15 items-center justify-center overflow-hidden rounded-2xl shadow ring-2 ring-gray-100">
				<AvatarImage
					src={store.logo}
					alt={`${store.name}'s logo`}
					className="size-4/5 rounded-2xl object-cover"
				/>
				<AvatarFallback className="text-xs">{store.name}</AvatarFallback>
			</Avatar>
			<div>
				<h2 className="text-2xl font-bold">{store.name}</h2>
				<p className="text-sm text-gray-500">Store ID: {store._id}</p>
			</div>
		</div>
	);
};

const StoreNotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center py-24 text-center">
			<AlertCircleIcon className="mb-4 h-16 w-16 text-gray-400" />
			<h2 className="mb-2 text-2xl font-semibold">Store not found</h2>
			<p className="mb-6 max-w-md text-gray-500">
				We couldn’t find the store you’re looking for. It may have been removed
				or never existed.
			</p>
			<Button asChild>
				<Link to="/">Go back home</Link>
			</Button>
		</div>
	);
};

const StoreDetailsSection = () => {
	const { error, loading, store } = useStoreDetails();
	if (error) {
		return (
			<ErrorMessage
				title="There was an error while retrieving the products."
				reason={error.message}
			/>
		);
	}
	if (loading) return <StoreDetailsSkeleton />;
	if (!store) return <StoreNotFound />;

	return (
		<main className="container mx-auto max-w-6xl space-y-8 px-6 py-16">
			<StoreHeader store={store} />

			<section>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-4 flex items-center justify-between"
				>
					<h3 className="text-xl font-semibold">Products</h3>
				</motion.div>
				<ProductsGrid
					error={error}
					loading={loading}
					products={store.products}
				/>
			</section>
		</main>
	);
};

export default StoreDetailsSection;
