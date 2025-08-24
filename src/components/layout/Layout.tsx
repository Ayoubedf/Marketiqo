import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = () => {
	return (
		<div style={{}}>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
