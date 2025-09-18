import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_ROUTES } from '@/config/constants';
import { renderFieldError } from '@/utils/renderFieldError';
import { Link } from 'react-router-dom';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { useLogin } from '../../hooks/use-login';

export const Login = () => {
	const {
		refs: { emailRef, passwordRef, rememberRef },
		validationErrors,
		validateField,
		handleSubmit,
		handleForgotPassword,
		passwordVisibility,
		setPasswordVisibility,
		isSubmitting,
	} = useLogin();

	return (
		<form onSubmit={handleSubmit} noValidate className="space-y-6">
			<div>
				<label htmlFor="email" className="block text-sm/6 font-medium">
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
						aria-invalid={!!validationErrors.email}
						aria-required="true"
						aria-describedby={
							validationErrors.email ? 'email-error' : undefined
						}
						onBlur={() => validateField('email')}
					/>
				</div>
				{renderFieldError(validationErrors.email, 'email')}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm/6 font-medium">
					Password
				</label>
				<div className="relative mt-2">
					<Input
						ref={passwordRef}
						id="password"
						name="password"
						type={passwordVisibility ? 'text' : 'password'}
						placeholder="secret1234@"
						autoComplete="current-password"
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
						aria-label={passwordVisibility ? 'Hide password' : 'Show password'}
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

			<div className="flex justify-between">
				<div className="inline-flex items-center">
					<label className="relative flex items-center">
						<input
							ref={rememberRef}
							id="remember-me"
							type="checkbox"
							className="peer h-5 w-5 appearance-none rounded border border-gray-200 shadow transition-all outline-none checked:border-blue-600 checked:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
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
								/>
							</svg>
						</span>
					</label>
					<label htmlFor="remember-me" className="ml-3 block text-sm">
						Remember me
					</label>
				</div>
				<Link
					to={APP_ROUTES.PASS_RESET}
					onClick={handleForgotPassword}
					className="text-sm font-semibold text-blue-600 hover:text-blue-500"
				>
					Forgot password?
				</Link>
			</div>
			<Button
				type="submit"
				disabled={isSubmitting}
				className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				{isSubmitting ? 'Signing in…' : 'Sign in'}
			</Button>
		</form>
	);
};
