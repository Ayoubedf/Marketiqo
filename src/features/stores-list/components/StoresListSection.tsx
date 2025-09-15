import { StoresGrid } from './StoresGrid';
import { useStoresList } from '../hooks/use-stores-list';
import { StoresListHeader } from './StoresListHeader';

const StoresListSection = () => {
	const { error, loading, stores } = useStoresList();
	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<StoresListHeader />
			<StoresGrid error={error} loading={loading} stores={stores} />
		</section>
	);
};

export default StoresListSection;
