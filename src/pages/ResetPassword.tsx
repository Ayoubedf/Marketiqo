import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import { APP_NAME, APP_ROUTES } from '@/constants/app';
import { userResetManager as userReset } from '@/lib/auth';
import { ApiError, isApiError, ResetConfPasswordPayload } from '@/types';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { resetPasswordSchema, validateSchema } from '@/utils/validations';
import { useAuthActions } from '@/contexts/authContexts';
import { renderFieldError } from '@/utils/renderFieldError';
import { useDocumentTitle } from '@/hooks/use-document-title';

interface ValidationErrors {
	password?: string;
	password_confirm?: string;
}

export default function ResetPassword({
	className,
	...props
}: {
	className?: string;
}) {
	const authAction = useAuthActions();
	const email = userReset.get()?.email;
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [, setError] = useState<ApiError | null>(null);
	const navigate = useNavigate();
	const resetToken = userReset.get()?.resetToken || '';

	const validate = useCallback((): boolean => {
		const formInputValues = {
			password: newPasswordRef.current?.value.trim(),
			password_confirm: confirmPasswordRef.current?.value.trim(),
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			resetPasswordSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data: ResetConfPasswordPayload = {
			password: newPasswordRef.current?.value.trim() || '',
			password_confirm: confirmPasswordRef.current?.value.trim() || '',
			resetToken,
		};
		if (!validate()) return;
		const response = await authAction.resetConfPassword(data);
		if (isApiError(response)) {
			setError(response);
		} else {
			navigate(APP_ROUTES.LOGIN, { replace: true });
		}
	};

	const title = `Change Password | ${APP_NAME}`;
	useDocumentTitle(title);

	if (!email) return <Navigate to={APP_ROUTES.HOME} />;

	return (
		<>
			<div className="col-span-full flex h-full w-full items-center justify-center py-38">
				<div className="w-full max-w-sm">
					<div className={cn('flex flex-col gap-6', className)} {...props}>
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl">Password Change</CardTitle>
								<CardDescription>
									Enter your new password and confirm it to change your
									password.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} onChange={validate}>
									<div className="flex flex-col gap-6">
										<div className="hidden">
											<label htmlFor="username">Email or Username</label>
											<input
												type="text"
												id="username"
												name="username"
												autoComplete="username"
											/>
										</div>
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
														validationErrors.password
															? 'new-password-error'
															: ''
													}
													required
												/>
												<button
													type="button"
													aria-label={
														passwordVisibility
															? 'Hide password'
															: 'Show password'
													}
													className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
												>
													<UseAnimations
														animation={visibility}
														onClick={() =>
															setPasswordVisibility(!passwordVisibility)
														}
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
													validationErrors.password_confirm
														? 'confirm-password-error'
														: ''
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
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
