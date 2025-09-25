import ProductsGrid from '@/shared/components/products/ProductsGrid';
import ProductsHeader from './ProductsHeader';
import useCollection from '../hooks/use-collection';

export default function CollectionSection() {
	const { error, loading, products, query } = useCollection();

	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<ProductsHeader query={query} />
			<ProductsGrid error={error} loading={loading} products={products} />
		</section>
	);
}
