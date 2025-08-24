import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { APP_NAME, APP_ROUTES } from '@/constants/app';
import { DatePicker } from '@/components/date-picker';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { registerSchema, validateSchema } from '@/utils/validations';
import { useAuthService } from '@/hooks/useAuthService';
import { AxiosError } from 'axios';
import { RegisterRequestPayload } from '@/types/api';

interface ValidationErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	birthDate?: string;
	conditions?: string;
}

interface ErrorResponse {
	status?: number;
	message?: string;
}

const Register = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const conditionsRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const isMounted = useRef<boolean>(false);
	const [date, setDate] = useState<Date | undefined>();
	const [error, setError] = useState<ErrorResponse>({});
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const navigate = useNavigate();
	const authService = useAuthService();
	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();

	const validate = useCallback((): boolean => {
		const formInputValues: RegisterRequestPayload = {
			email: emailRef.current?.value?.toLowerCase().trim() as string,
			password: passwordRef.current?.value?.trim() as string,
			password_confirm: confirmPasswordRef.current?.value?.trim() as string,
			birthDate: date,
			conditions: conditionsRef.current?.checked as boolean,
		};
		if (!isMounted.current) isMounted.current = true;

		const errors: ValidationErrors = validateSchema(
			formInputValues,
			registerSchema
		);

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [date]);

	useEffect(() => {
		if (isMounted.current) validate();
	}, [date, validate]);

	const resetForm = () => {
		if (emailRef.current) emailRef.current.value = '';
		if (passwordRef.current) passwordRef.current.value = '';
		if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
		setValidationErrors({});
		setError({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		const data: RegisterRequestPayload = {
			name: emailRef.current?.value.trim().split('@')[0] as string,
			email: emailRef.current?.value.toLowerCase().trim() as string,
			password: passwordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
			birthDate: date as Date,
			conditions: conditionsRef.current?.checked as boolean,
		};
		e.preventDefault();
		if (!validate()) return;
		try {
			await authService.register(data);
			resetForm();
			navigate(APP_ROUTES.LOGIN, {
				replace: true,
				state: { just_registered: true },
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				if (!error.response)
					setError({ status: 0, message: error.message || 'Network Error' });
				else
					setError({
						status: error.response.status,
						message:
							error.message || 'An error occurred. Please try again later',
					});
			}
		}
	};

	document.title = `Register | ${APP_NAME}`;

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				{error.status !== undefined && error.status != 200 && (
					<Alert className="border border-red-200 bg-red-50 text-red-500 dark:border-red-500 dark:bg-red-900 dark:text-red-200">
						<AlertCircleIcon />
						<AlertTitle>{error.message}</AlertTitle>
						<AlertDescription>
							{error.status === 401
								? 'Invalid email or password'
								: 'An error occurred. Please try again later'}
						</AlertDescription>
					</Alert>
				)}
				<div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-5 text-2xl/9 font-bold tracking-tight text-gray-800">
						Create Your Account
					</h2>
					<p className="mb-8 text-gray-500">
						Create your account—your brand journey starts here.
					</p>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="border-slate-800 bg-white px-6 py-12 shadow shadow-gray-300 sm:rounded-lg sm:px-12 dark:border dark:bg-gray-900 dark:shadow-gray-800/50">
						<div className="sm:mx-auto sm:w-full sm:max-w-sm">
							<form
								onSubmit={handleSubmit}
								onChange={validate}
								className="space-y-6"
							>
								{/* <div>
									<label htmlFor='name' className='block text-sm/6 font-medium'>
										Username
									</label>
									<div className='relative flex-1 mx-1 mt-2'>
										<Input
											ref={nameRef}
											id='name'
											name='name'
											type='text'
											autoComplete='user-name'
											aria-invalid={validationErrors?.name != null}
										/>
									</div>
									{validationErrors?.name && (
										<p aria-live='assertive' className='text-red-500 text-xs mt-1'>
											{validationErrors.name}
										</p>
									)}
								</div> */}
								<div>
									<label
										htmlFor="email"
										className="block text-sm/6 font-medium"
									>
										Email address
									</label>
									<div className="relative mx-1 mt-2 flex-1">
										<Input
											ref={emailRef}
											id="email"
											name="email"
											type="email"
											placeholder="john@doe.com"
											autoComplete="email"
											aria-invalid={validationErrors?.email != null}
										/>
									</div>
									{validationErrors?.email && (
										<p
											aria-live="assertive"
											className="mt-1 text-xs text-red-500"
										>
											{validationErrors.email}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="password"
										className="block text-sm/6 font-medium"
									>
										Password
									</label>
									<div className="input-field relative mt-2">
										<Input
											ref={passwordRef}
											id="password"
											name="password"
											type={passwordVisibility ? 'text' : 'password'}
											placeholder="secret1234@"
											autoComplete="new-password"
											aria-invalid={validationErrors?.password != null}
										/>
										<button
											type="button"
											aria-label={
												passwordVisibility ? 'Hide password' : 'Show password'
											}
											className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-around rounded-md p-1 transition-colors hover:bg-gray-200/50"
										>
											<UseAnimations
												className="ua-icon"
												animation={visibility}
												onClick={() =>
													setPasswordVisibility(!passwordVisibility)
												}
											/>
										</button>
									</div>

									{validationErrors?.password && (
										<p
											aria-live="assertive"
											className="mt-1 text-xs text-red-500"
										>
											{validationErrors.password}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="confirm-password"
										className="block text-sm/6 font-medium"
									>
										Confirm Password
									</label>
									<div className="input-field mt-2">
										<Input
											ref={confirmPasswordRef}
											id="confirm-password"
											name="confirm-password"
											type="password"
											placeholder="secret1234@"
											autoComplete="new-password"
											aria-invalid={validationErrors?.confirmPassword != null}
										/>
									</div>
									{validationErrors?.confirmPassword && (
										<p
											aria-live="assertive"
											className="mt-1 text-xs text-red-500"
										>
											{validationErrors.confirmPassword}
										</p>
									)}
								</div>

								<div>
									<label
										htmlFor="birthDate"
										className="mb-2 block text-sm font-medium"
									>
										Birth Date
									</label>
									<DatePicker
										id="birthDate"
										date={date}
										setDate={setDate}
										startDate={startDate}
										endDate={endDate}
									/>
									{validationErrors.birthDate && (
										<p className="mt-1 text-sm text-red-500">
											{validationErrors.birthDate}
										</p>
									)}
								</div>

								<div>
									<div className="my-2 flex items-center">
										<label className="relative flex items-center">
											<input
												ref={conditionsRef}
												type="checkbox"
												aria-invalid={validationErrors?.conditions != null}
												className="peer h-5 w-5 appearance-none rounded border border-gray-200 shadow transition-all outline-none checked:border-blue-600 checked:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
												id="remember-me"
											/>
											<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-3.5 w-3.5"
													viewBox="0 0 20 20"
													fill="currentColor"
													stroke="currentColor"
													strokeWidth="1"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													></path>
												</svg>
											</span>
										</label>
										<label htmlFor="remember-me" className="ml-3 block text-sm">
											Accept conditions
										</label>
									</div>
									{validationErrors.conditions && (
										<p className="mt-1 text-sm text-red-500">
											{validationErrors.conditions}
										</p>
									)}
								</div>

								<Button
									type="submit"
									disabled={
										validationErrors && Object.keys(validationErrors).length > 0
									}
									className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
								>
									Register
								</Button>
							</form>
						</div>
					</div>
				</div>
				<p className="mt-10 text-center text-sm/6 text-gray-500">
					Already have an account?
					<Link
						to={APP_ROUTES.LOGIN}
						className="ms-1 font-semibold text-blue-600 hover:text-blue-500"
					>
						Sign in
					</Link>
				</p>
			</div>
		</>
	);
};

export default Register;
