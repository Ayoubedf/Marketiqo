import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useRefreshToken from '@/hooks/useRefreshToken';
import Spinner from '@/components/ui/spinner';
import { APP_ROUTES } from '@/constants/app';
import { tokenManager } from '@/lib/auth';

const RequireAuth = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const refresh = useRefreshToken();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyAuth = async () => {
			try {
				if (!tokenManager.getAccessToken())
					if (!(await refresh())) throw new Error('Token refresh failed');
			} catch {
				navigate(APP_ROUTES.LOGIN, {
					replace: true,
					state: { from: location },
				});
			} finally {
				setLoading(false);
			}
		};
		verifyAuth();
	}, [location, navigate, refresh]);

	if (loading) return <Spinner />;
	if (!tokenManager.getAccessToken())
		return (
			<Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
		);

	return <Outlet />;
};

export default RequireAuth;
