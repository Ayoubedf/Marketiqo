import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthActions } from '@/contexts/authContexts';
import { TrashIcon } from 'lucide-react';
import { APP_NAME } from '@/constants/app';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { PasswordChangePayload } from '@/types';
import { changePasswordSchema, validateSchema } from '@/utils/validations';
import { motion } from 'framer-motion';
import { renderFieldError } from '@/utils/renderFieldError';
import { notify } from '@/lib/notify';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { itemVariants } from '@/constants/motion';

interface ValidationErrors {
	current_password?: string;
	password?: string;
	password_confirm?: string;
}

const Settings = () => {
	const { updatePassword } = useAuthActions();
	const currentPasswordRef = useRef<HTMLInputElement>(null);
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [currentPasswordVisibility, setCurrentPasswordVisibility] =
		useState(false);
	const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);

	const validate = useCallback((): boolean => {
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
	}, []);

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const data: PasswordChangePayload = {
			current_password: currentPasswordRef.current?.value.trim() as string,
			password: newPasswordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
		};

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		await updatePassword(data);
	};

	const title = `Settings | ${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<motion.div
			initial="hidden"
			animate="show"
			transition={{ duration: 0.5, ease: 'easeOut' }}
			variants={itemVariants}
			className="container mx-auto max-w-3xl space-y-12 px-6 py-16"
		>
			<h1 className="mb-8 text-3xl font-bold">Settings</h1>

			{/* Password Section */}
			<div>
				<h2 className="mb-4 text-xl font-semibold">Password Management</h2>
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
								className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 hover:bg-gray-200/50"
							>
								<UseAnimations
									animation={visibility}
									onClick={() =>
										setNewPasswordVisibility(!newPasswordVisibility)
									}
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
						disabled={
							validationErrors && Object.keys(validationErrors).length > 0
						}
						type="submit"
					>
						Change Password
					</Button>
				</form>
			</div>

			{/* Delete Section */}
			<div>
				<h2 className="mb-4 text-xl font-semibold text-red-600">
					Delete Account
				</h2>
				<Button
					variant="destructive"
					onClick={() => notify.info('Feature coming soon!')}
				>
					<TrashIcon
						className="-ms-1 opacity-60"
						size={16}
						aria-hidden="true"
					/>
					Delete Account
				</Button>
			</div>
		</motion.div>
	);
};

export default Settings;
