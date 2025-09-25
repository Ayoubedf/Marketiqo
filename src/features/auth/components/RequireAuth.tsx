import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from '@/features/auth/contexts/authContexts';
import Spinner from '@/shared/components/ui/spinner';

export const RequireAuth = () => {
	const { isAuthenticated, loading } = useAuthState();
	const location = useLocation();

	if (loading)
		return (
			<div
				className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80"
				role="status"
				aria-live="polite"
			>
				<Spinner size="medium">
					<span className="mt-5 text-xs">Loading your account…</span>
				</Spinner>
			</div>
		);
	if (!isAuthenticated)
		return <Navigate to="/login" state={{ from: location }} replace />;

	return <Outlet />;
};
