import { APP_NAME } from '@/constants/app';
import { useLayoutEffect } from 'react';
import FeaturedProducts from '@/components/section/FeaturedProducts';
import HeroBanner from '@/components/section/HeroBanner';

const Home = () => {
	document.title = `${APP_NAME}`;
	useLayoutEffect(() => {
		return () => {};
	}, []);

	return (
		<>
			<HeroBanner />
			<FeaturedProducts />
		</>
	);
};

export default Home;
