import { useAuthState } from '@/features/auth';
import { PasswordChange } from './forms/PasswordChange';

export const PasswordSection = () => {
	const { isOAuthUser } = useAuthState();

	if (isOAuthUser) return;

	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">Password Management</h2>
			<PasswordChange />
		</div>
	);
};
