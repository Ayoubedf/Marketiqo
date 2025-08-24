import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import { TrashIcon, XCircleIcon } from 'lucide-react';
import { APP_NAME } from '@/constants/app';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { PasswordChangePayload } from '@/types/api';
import { changePasswordSchema, validateSchema } from '@/utils/validations';

interface ValidationErrors {
	current_password?: string;
	password?: string;
	password_confirm?: string;
}

const Settings = () => {
	const { updatePassword } = useAuth();
	const currentPasswordRef = useRef<HTMLInputElement>(null);
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [currentPasswordVisibility, setCurrentPasswordVisibility] =
		useState<boolean>(false);
	const [newPasswordVisibility, setNewPasswordVisibility] =
		useState<boolean>(false);

	const validate = (): boolean => {
		const formInputValues = {
			current_password: currentPasswordRef.current?.value.trim() as string,
			password: newPasswordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			changePasswordSchema
		);

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const data: PasswordChangePayload = {
			currentPassword: currentPasswordRef.current?.value.trim() as string,
			newPassword: newPasswordRef.current?.value.trim() as string,
			confirmPassword: confirmPasswordRef.current?.value.trim() as string,
		};

		if (!validate()) {
			toast.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
			return;
		}

		await updatePassword?.(data);
	};

	document.title = `Settings | ${APP_NAME}`;

	return (
		<div className="container mx-auto max-w-3xl space-y-8 px-6 py-16">
			<h1 className="mb-8 text-3xl font-bold">Settings</h1>

			<section className="mb-12">
				<h2 className="mb-4 text-xl font-semibold">Password Management</h2>
				<form
					onSubmit={handlePasswordUpdate}
					onChange={validate}
					className="space-y-4"
				>
					<div className="hidden">
						<label htmlFor="username">Email or Username</label>
						<input
							type="text"
							id="username"
							name="username"
							autoComplete="username"
						/>
					</div>
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
								aria-label={
									currentPasswordVisibility ? 'Hide password' : 'Show password'
								}
								className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
							>
								<UseAnimations
									className="ua-icon"
									animation={visibility}
									onClick={() =>
										setCurrentPasswordVisibility(!currentPasswordVisibility)
									}
								/>
							</button>
						</div>
						{validationErrors.current_password && (
							<p className="mt-1 text-sm text-red-500">
								{validationErrors.current_password}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="newPassword"
							className="mb-2 block text-sm font-medium"
						>
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
								aria-label={
									newPasswordVisibility ? 'Hide password' : 'Show password'
								}
								className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
							>
								<UseAnimations
									className="ua-icon"
									animation={visibility}
									onClick={() =>
										setNewPasswordVisibility(!newPasswordVisibility)
									}
								/>
							</button>
						</div>
						{validationErrors.password && (
							<p className="mt-1 text-sm text-red-500">
								{validationErrors.password}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="confirmPassword"
							className="mb-2 block text-sm font-medium"
						>
							Confirm Password
						</label>
						<Input
							ref={confirmPasswordRef}
							id="confirmPassword"
							name="confirmPassword"
							autoComplete="new-password"
							type="password"
							placeholder="Confirm your new password"
						/>
						{validationErrors.password_confirm && (
							<p className="mt-1 text-sm text-red-500">
								{validationErrors.password_confirm}
							</p>
						)}
					</div>
					<Button type="submit">Change Password</Button>
				</form>
			</section>

			<section>
				<h2 className="mb-4 text-xl font-semibold text-red-600">
					Delete Account
				</h2>
				<Button
					variant="destructive"
					onClick={() => toast.info('Feature coming soon!')}
				>
					<TrashIcon
						className="-ms-1 opacity-60"
						size={16}
						aria-hidden="true"
					/>
					Delete Account
				</Button>
			</section>
		</div>
	);
};

export default Settings;
