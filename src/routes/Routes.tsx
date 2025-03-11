import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from '@/pages/Home';
// import Profile from '@/pages/Profile';
// import Settings from '@/pages/Settings';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Layout />}>
					{/* <Route index element={<Home />} /> */}
					{/* <Route path='profile' element={<Profile />} /> */}
					{/* <Route path='settings' element={<Settings />} /> */}
					<Route path='login' element={<Login />} />
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
