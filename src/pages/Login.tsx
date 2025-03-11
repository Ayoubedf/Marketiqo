import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { API_ENDPOINTS, APP_NAME, APP_ROUTES } from '@/constants/app';
import useAuth from '@/hooks/useAuth';

interface LoginData {
	email: string;
	password: string;
}
interface ValidationErrors {
	email?: string;
	password?: string;
}

interface AuthResponse {
	user: object;
	token: string;
}

interface ErrorResponse {
	status?: number;
	message?: string;
}

const Login = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const rememberRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
	const [error, setError] = useState<ErrorResponse>({});
	const { setAuth } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || '/';

	const validate = (): boolean => {
		const errors: ValidationErrors = {};
		const formInputValues: LoginData = {
			email: emailRef.current?.value.toLowerCase().trim() || '',
			password: passwordRef.current?.value.trim() || '',
		};

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formInputValues.email) {
			errors.email = 'Email is required';
		} else if (!emailRegex.test(formInputValues.email)) {
			errors.email = 'Invalid email';
		}

		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;
		if (!formInputValues.password) {
			errors.password = 'Password is required';
		} else if (!passwordRegex.test(formInputValues.password)) {
			errors.password =
				'Password must contain at least 8 characters, one letter, one number, and one special character';
		}
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const resetForm = () => {
		if (emailRef.current) emailRef.current.value = '';
		if (passwordRef.current) passwordRef.current.value = '';
		if (rememberRef.current) rememberRef.current.value = '';
		setValidationErrors({});
		setError({});
	};

	const handleSubmit = (e: React.FormEvent) => {
		const data: LoginData = {
			email: emailRef.current?.value || '',
			password: passwordRef.current?.value || '',
		};
		e.preventDefault();
		if (!validate()) return;
		axios
			.post<AuthResponse>(API_ENDPOINTS.LOGIN, data)
			.then((res: { data: AuthResponse }) => {
				const { user, token } = res.data;
				setAuth({ user, token });
				if (rememberRef.current?.checked) localStorage.setItem('token', token);
				resetForm();
				navigate(from, { replace: true, state: { just_logged: true } });
			})
			.catch((err: { response: ErrorResponse; message?: string }) => {
				if (!err.response) {
					setError({ status: 0, message: err.message || 'Network Error' });
				} else {
					setError({
						status: err.response.status,
						message: err.message || 'An error occurred. Please try again later',
					});
					console.log(err.message);
				}
			});
	};

	document.title = `Login | ${APP_NAME}`;

	return (
		<>
			<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
				{error.status !== undefined && error.status != 200 && (
					<Alert className='text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-500 '>
						<AlertCircleIcon className='' />
						<AlertTitle>{error.message}</AlertTitle>
						<AlertDescription>
							{error.status === 401
								? 'Invalid email or password'
								: 'An error occurred. Please try again later'}
						</AlertDescription>
					</Alert>
				)}
				<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
					<h2 className='mt-5 text-center text-2xl/9 font-bold text-gray-800 tracking-tight'>
						Sign In To Your Account
					</h2>
				</div>
				<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
					<div className='bg-white dark:bg-gray-900 px-6 py-12 shadow shadow-gray-300 dark:shadow-gray-800/50 dark:border border-slate-800 sm:rounded-lg sm:px-12'>
						<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
							<form onSubmit={handleSubmit} onChange={validate} className='space-y-6'>
								<div>
									<label htmlFor='email' className='block text-sm/6 font-medium'>
										Email address
									</label>
									<div className='relative flex-1 mx-1 mt-2'>
										<Input
											ref={emailRef}
											id='email'
											name='email'
											type='email'
											autoComplete='email'
											aria-invalid={validationErrors?.email != null}
										/>
									</div>
									{validationErrors?.email && (
										<p aria-live='assertive' className='text-red-500 text-xs mt-1'>
											{validationErrors.email}
										</p>
									)}
								</div>

								<div>
									<label htmlFor='password' className='block text-sm/6 font-medium'>
										Password
									</label>
									<div className='input-field mt-2'>
										<Input
											ref={passwordRef}
											id='password'
											name='password'
											type='password'
											autoComplete='current-password'
											aria-invalid={validationErrors?.password != null}
										/>
									</div>
									{validationErrors?.password && (
										<p aria-live='assertive' className='text-red-500 text-xs mt-1'>
											{validationErrors.password}
										</p>
									)}
								</div>
								<div className='flex justify-between'>
									<div className='inline-flex items-center'>
										<label className='flex items-center relative'>
											<input
												ref={rememberRef}
												id='remember-me'
												type='checkbox'
												className='peer h-5 w-5 transition-all appearance-none rounded shadow hover:shadow-md outline-none border border-gray-200 dark:border-gray-700 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-2'
											/>
											<span className='absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-3.5 w-3.5'
													viewBox='0 0 20 20'
													fill='currentColor'
													stroke='currentColor'
													strokeWidth='1'>
													<path
														fillRule='evenodd'
														d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
														clipRule='evenodd'></path>
												</svg>
											</span>
										</label>
										<label htmlFor='remember-me' className='ml-3 block text-sm'>
											Remember me
										</label>
									</div>
									<Link
										to={APP_ROUTES.PASSWORD_RESET}
										className='text-sm font-semibold text-blue-600 hover:text-blue-500'>
										Forgot password?
									</Link>
								</div>
								<Button
									type='submit'
									disabled={validationErrors && Object.keys(validationErrors).length > 0}
									className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
									Sign in
								</Button>
							</form>

							<div className='relative mt-10'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-gray-200 dark:border-gray-700'></div>
								</div>
								<div className='relative flex justify-center text-sm font-medium'>
									<div className='bg-white dark:bg-gray-900 px-6 dark:text-white'>
										Or continue with
									</div>
								</div>
							</div>
							<div className='mt-6 grid grid-cols-2 gap-4'>
								<Button variant='outline' asChild>
									<a
										href='#'
										className='flex w-full text-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 dark:hover:bg-gray-800/50 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white'>
										<svg viewBox='0 0 24 24' aria-hidden='true' className='h-5 w-5'>
											<path
												d='M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z'
												fill='#EA4335'></path>
											<path
												d='M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z'
												fill='#4285F4'></path>
											<path
												d='M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z'
												fill='#FBBC05'></path>
											<path
												d='M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z'
												fill='#34A853'></path>
										</svg>
										<span className='text-sm font-semibold'>Google</span>
									</a>
								</Button>
								<Button variant='outline' asChild>
									<a
										href='#'
										className='flex w-full text-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 dark:hover:bg-gray-800/50 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white'>
										<svg
											fill='currentColor'
											viewBox='0 0 20 20'
											aria-hidden='true'
											className='h-5 w-5'>
											<path
												d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
												clipRule='evenodd'
												fillRule='evenodd'></path>
										</svg>
										<span className='text-sm font-semibold'>GitHub</span>
									</a>
								</Button>
							</div>
						</div>
					</div>
				</div>
				<p className='mt-10 text-center text-sm/6 text-gray-500'>
					Don&apos;t you have an account?
					<Link
						to={APP_ROUTES.REGISTER}
						className='ms-1 font-semibold text-blue-600 hover:text-blue-500'>
						Register
					</Link>
				</p>
			</div>
		</>
	);
};

export default Login;
