import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from '@/contexts/authContexts';
import Spinner from '../ui/spinner';

const RequireAuth = () => {
	const { state, loading } = useAuthState();
	const location = useLocation();

	if (loading)
		return (
			<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
				<Spinner size="medium">
					<span className="mt-5 text-xs">Loading your account…</span>
				</Spinner>
			</div>
		);
	if (!state.user)
		return <Navigate to="/login" state={{ from: location }} replace />;

	return <Outlet />;
};

export default RequireAuth;
