import { HeroBanner, FeaturedProducts } from '@/features/home';
import { APP_NAME } from '@/config/constants';
import { useDocumentTitle } from '@/hooks/use-document-title';
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
