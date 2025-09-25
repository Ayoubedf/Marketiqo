import { Input } from '@/shared/components/ui/input';
import { useSettings } from '../../hooks/use-settings';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { renderFieldError } from '@/shared/utils/renderFieldError';
import { Button } from '@/shared/components/ui/button';

export function PasswordChange() {
	const {
		refs: { currentPasswordRef, newPasswordRef, confirmPasswordRef },
		currentPasswordVisibility,
		handlePasswordUpdate,
		newPasswordVisibility,
		setCurrentPasswordVisibility,
		setNewPasswordVisibility,
		validateField,
		validationErrors,
		isSubmitting,
	} = useSettings();

	return (
		<form onSubmit={handlePasswordUpdate} noValidate className="space-y-4">
			<div>
				<label
					htmlFor="currentPassword"
					className="mb-2 block text-sm font-medium"
				>
					Current Password
				</label>
				<div className="relative">
					<Input
						ref={currentPasswordRef}
						id="currentPassword"
						name="currentPassword"
						autoComplete="current-password"
						type={currentPasswordVisibility ? 'text' : 'password'}
						placeholder="Enter your current password"
						aria-invalid={!!validationErrors.current_password}
						aria-required="true"
						aria-describedby={
							validationErrors.current_password
								? 'current-password-error'
								: undefined
						}
						onBlur={() => validateField('current_password')}
					/>
					<button
						type="button"
						onClick={() =>
							setCurrentPasswordVisibility(!currentPasswordVisibility)
						}
						aria-label={
							currentPasswordVisibility ? 'Hide password' : 'Show password'
						}
						className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
					>
						<UseAnimations
							animation={visibility}
							reverse={currentPasswordVisibility}
						/>
					</button>
				</div>
				{renderFieldError(
					validationErrors.current_password,
					'current-password'
				)}
			</div>

			<div>
				<label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
					New Password
				</label>
				<div className="relative">
					<Input
						ref={newPasswordRef}
						id="newPassword"
						name="newPassword"
						autoComplete="new-password"
						type={newPasswordVisibility ? 'text' : 'password'}
						placeholder="Enter your new password"
						aria-invalid={!!validationErrors.password}
						aria-required="true"
						aria-describedby={
							validationErrors.password ? 'password-error' : undefined
						}
						onBlur={() => validateField('password')}
					/>
					<button
						type="button"
						onClick={() => setNewPasswordVisibility(!newPasswordVisibility)}
						aria-label={
							newPasswordVisibility ? 'Hide password' : 'Show password'
						}
						className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
					>
						<UseAnimations
							animation={visibility}
							reverse={newPasswordVisibility}
						/>
					</button>
				</div>
				{renderFieldError(validationErrors.password, 'new-password')}
			</div>

			<div>
				<label
					htmlFor="confirm_password"
					className="mb-2 block text-sm font-medium"
				>
					Confirm Password
				</label>
				<Input
					ref={confirmPasswordRef}
					id="confirm_password"
					name="confirm_password"
					autoComplete="new-password"
					type="password"
					placeholder="Confirm your new password"
					aria-invalid={!!validationErrors.password_confirm}
					aria-required="true"
					aria-describedby={
						validationErrors.password_confirm
							? 'password-confirm-error'
							: undefined
					}
					onBlur={() => validateField('password_confirm')}
				/>
				{renderFieldError(
					validationErrors.password_confirm,
					'password-confirm'
				)}
			</div>

			<Button disabled={isSubmitting} type="submit">
				{isSubmitting ? 'Updating...' : 'Update Password'}
			</Button>
		</form>
	);
}
