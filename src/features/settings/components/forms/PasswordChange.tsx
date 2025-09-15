import { Input } from '@/components/ui/input';
import { useSettings } from '../../hooks/use-settings';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { renderFieldError } from '@/utils/renderFieldError';
import { Button } from '@/components/ui/button';

export function PasswordChange() {
	const {
		refs: { currentPasswordRef, newPasswordRef, confirmPasswordRef },
		currentPasswordVisibility,
		handlePasswordUpdate,
		newPasswordVisibility,
		setCurrentPasswordVisibility,
		setNewPasswordVisibility,
		validate,
		validationErrors,
	} = useSettings();

	return (
		<form
			onSubmit={handlePasswordUpdate}
			onChange={validate}
			className="space-y-4"
		>
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
					/>
					<button
						type="button"
						className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-200/50"
					>
						<UseAnimations
							animation={visibility}
							onClick={() =>
								setCurrentPasswordVisibility(!currentPasswordVisibility)
							}
						/>
					</button>
				</div>
				{renderFieldError(validationErrors.current_password)}
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
					/>
					<button
						type="button"
						className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-200/50"
					>
						<UseAnimations
							animation={visibility}
							onClick={() => setNewPasswordVisibility(!newPasswordVisibility)}
						/>
					</button>
				</div>
				{renderFieldError(validationErrors.password)}
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
				/>
				{renderFieldError(validationErrors.password_confirm)}
			</div>

			<Button
				disabled={validationErrors && Object.keys(validationErrors).length > 0}
				type="submit"
			>
				Change Password
			</Button>
		</form>
	);
}
