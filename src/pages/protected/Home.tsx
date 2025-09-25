import { HeroBanner, FeaturedProducts } from '@/features/home';
import { APP_NAME } from '@/core/config/constants';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useMemo } from 'react';

const Home = () => {
	const title = useMemo(() => `${APP_NAME}`, []);
	useDocumentTitle(title);

	return (
		<>
			<HeroBanner />
			<FeaturedProducts />
		</>
	);
};

export default Home;
