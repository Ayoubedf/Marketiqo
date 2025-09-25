import { Navigate } from 'react-router-dom';
import { useResetPassword } from '../../hooks/use-reset-password';
import { APP_ROUTES } from '@/core/config/constants';
import { Input } from '@/shared/components/ui/input';
import visibility from 'react-useanimations/lib/visibility2';
import UseAnimations from 'react-useanimations';
import { renderFieldError } from '@/shared/utils/renderFieldError';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

export const ResetPassword = () => {
	const {
		refs: { newPasswordRef, confirmPasswordRef },
		resetToken,
		handleSubmit,
		validateField,
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		isSubmitting,
	} = useResetPassword();

	if (!resetToken) return <Navigate to={APP_ROUTES.HOME} replace />;

	return (
		<form onSubmit={handleSubmit} noValidate>
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
							aria-invalid={!!validationErrors.password}
							aria-required="true"
							aria-describedby={
								validationErrors.password ? 'password-error' : undefined
							}
							onBlur={() => validateField('password')}
						/>
						<button
							type="button"
							onClick={() => setPasswordVisibility(!passwordVisibility)}
							aria-label={
								passwordVisibility ? 'Hide password' : 'Show password'
							}
							className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
						>
							<UseAnimations
								animation={visibility}
								reverse={passwordVisibility}
							/>
						</button>
					</div>
					{renderFieldError(validationErrors.password, 'password')}
				</div>
				<div className="grid gap-2">
					<Label htmlFor="confirm-password">Confirm Password</Label>
					<Input
						ref={confirmPasswordRef}
						id="confirm-password"
						type="password"
						placeholder="secret1234@"
						autoComplete="confirm-password"
						aria-invalid={!!validationErrors.password_confirm}
						aria-required="true"
						aria-describedby={
							validationErrors.password_confirm
								? 'confirm-password-error'
								: undefined
						}
						onBlur={() => validateField('password_confirm')}
						required
					/>
					{renderFieldError(
						validationErrors.password_confirm,
						'password-confirm'
					)}
				</div>
				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Updating...' : 'Update Password'}
				</Button>
			</div>
		</form>
	);
};
