import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Category from '@/pages/Category';
import Collections from '@/pages/Collections';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import { RequireAuth } from '@/features/auth';
import OTPReset from '@/pages/ResetPasswordOTP';
import ResetPassword from '@/pages/ResetPassword';
import CreateStore from '@/pages/CreateStore';
import StoresList from '@/pages/StoresList';
import StoreDetails from '@/pages/StoreDetails';
import CompleteProfile from '@/pages/CompleteProfile';
import { APP_ROUTES } from '@/config/constants';

const AppRoutes = () => {
	return (
		<Routes>
			<Route path={APP_ROUTES.HOME} element={<Layout />}>
				<Route path={APP_ROUTES.LOGIN} element={<Login />} />
				<Route path={APP_ROUTES.REGISTER} element={<Register />} />
				<Route
					path={APP_ROUTES.COMPLETE_PROFILE}
					element={<CompleteProfile />}
				/>
				<Route path={APP_ROUTES.PASS_RESET} element={<OTPReset />} />
				<Route path={APP_ROUTES.PASS_CHANGE} element={<ResetPassword />} />
				<Route element={<RequireAuth />}>
					<Route index element={<Home />} />
					<Route path={APP_ROUTES.CATEGORY(':cat')} element={<Category />} />
					<Route
						path={APP_ROUTES.COLLECTIONS(':q?')}
						element={<Collections />}
					/>
					<Route path={APP_ROUTES.STORES} element={<StoresList />} />
					<Route
						path={APP_ROUTES.STORE_DETAILS(':id')}
						element={<StoreDetails />}
					/>
					<Route path={APP_ROUTES.PROFILE} element={<Profile />} />
					<Route path={APP_ROUTES.SETTINGS} element={<Settings />} />
					<Route path={APP_ROUTES.CREATE_STORE} element={<CreateStore />} />
				</Route>
			</Route>
			<Route path={APP_ROUTES.NOT_FOUND} element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
