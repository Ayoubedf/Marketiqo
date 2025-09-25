import { Routes, Route } from 'react-router-dom';
import Layout from '@/shared/components/layout/Layout';
import { RequireAuth } from '@/features/auth';
import { APP_ROUTES } from '@/core/config/constants';

import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import CompleteProfile from '@/pages/public/CompleteProfile';
import OTPReset from '@/pages/public/ResetPasswordOTP';
import ResetPassword from '@/pages/public/ResetPassword';
import Home from '@/pages/protected/Home';
import Category from '@/pages/protected/Category';
import Collections from '@/pages/protected/Collections';
import CreateStore from '@/pages/protected/CreateStore';
import StoresList from '@/pages/protected/StoresList';
import StoreDetails from '@/pages/protected/StoreDetails';
import Profile from '@/pages/protected/Profile';
import Settings from '@/pages/protected/Settings';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => (
	<Routes>
		<Route path={APP_ROUTES.HOME} element={<Layout />}>
			<Route path={APP_ROUTES.LOGIN} element={<Login />} />
			<Route path={APP_ROUTES.REGISTER} element={<Register />} />
			<Route path={APP_ROUTES.COMPLETE_PROFILE} element={<CompleteProfile />} />
			<Route path={APP_ROUTES.PASS_RESET} element={<OTPReset />} />
			<Route path={APP_ROUTES.PASS_CHANGE} element={<ResetPassword />} />

			<Route element={<RequireAuth />}>
				<Route index element={<Home />} />
				<Route path={APP_ROUTES.CATEGORY(':cat')} element={<Category />} />
				<Route path={APP_ROUTES.COLLECTIONS(':q?')} element={<Collections />} />
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

export default AppRoutes;
