import { APP_NAME } from '@/constants/app';
import FeaturedProducts from '@/components/section/FeaturedProducts';
import HeroBanner from '@/components/section/HeroBanner';
import { useDocumentTitle } from '@/hooks/use-document-title';

const Home = () => {
	const title = `${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<>
			<HeroBanner />
			<FeaturedProducts />
		</>
	);
};

export default Home;
