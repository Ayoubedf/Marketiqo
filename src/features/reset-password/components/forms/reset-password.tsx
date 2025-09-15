import { Navigate } from 'react-router-dom';
import { useResetPassword } from '../../hooks/use-reset-password';
import { APP_ROUTES } from '@/config/constants';
import { Input } from '@/components/ui/input';
import visibility from 'react-useanimations/lib/visibility2';
import UseAnimations from 'react-useanimations';
import { renderFieldError } from '@/utils/renderFieldError';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const ResetPassword = () => {
	const {
		refs: { newPasswordRef, confirmPasswordRef },
		resetToken,
		handleSubmit,
		validate,
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
	} = useResetPassword();

	if (!resetToken) return <Navigate to={APP_ROUTES.HOME} replace />;

	return (
		<form onSubmit={handleSubmit} onChange={validate}>
			<div className="flex flex-col gap-6">
				<div className="grid gap-2">
					<Label htmlFor="new-password">New Password</Label>
					<div className="relative">
						<Input
							ref={newPasswordRef}
							id="new-password"
							type={passwordVisibility ? 'text' : 'password'}
							placeholder="secret1234@"
							autoComplete="new-password"
							aria-describedby={
								validationErrors.password ? 'new-password-error' : ''
							}
							required
						/>
						<button
							type="button"
							aria-label={
								passwordVisibility ? 'Hide password' : 'Show password'
							}
							className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
						>
							<UseAnimations
								animation={visibility}
								onClick={() => setPasswordVisibility(!passwordVisibility)}
							/>
						</button>
					</div>
					{renderFieldError(validationErrors.password)}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="confirm-password">Confirm Password</Label>
					<Input
						ref={confirmPasswordRef}
						id="confirm-password"
						type="password"
						placeholder="secret1234@"
						autoComplete="confirm-password"
						aria-describedby={
							validationErrors.password_confirm ? 'confirm-password-error' : ''
						}
						required
					/>
					{renderFieldError(validationErrors.password_confirm)}
				</div>
				<Button type="submit" className="w-full">
					Change Password
				</Button>
			</div>
		</form>
	);
};
