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

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route
					path="onboarding/complete-profile"
					element={<CompleteProfile />}
				/>
				<Route path="password/reset" element={<OTPReset />} />
				<Route path="password/change" element={<ResetPassword />} />ù
				<Route element={<RequireAuth />}>
					<Route index element={<Home />} />
					<Route path="category/:cat" element={<Category />} />
					<Route path="collections/:q?" element={<Collections />} />
					<Route path="stores" element={<StoresList />} />
					<Route path="stores/:id" element={<StoreDetails />} />
					<Route path="profile" element={<Profile />} />
					<Route path="settings" element={<Settings />} />
					<Route path="stores/create" element={<CreateStore />} />
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
