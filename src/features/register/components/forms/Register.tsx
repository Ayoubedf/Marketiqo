import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { renderFieldError } from '@/utils/renderFieldError';
import UseAnimations from 'react-useanimations';
import visibility from 'react-useanimations/lib/visibility2';
import { useRegister } from '../../hooks/use-register';

export const Register = () => {
	const {
		refs: { emailRef, passwordRef, confirmPasswordRef, conditionsRef },
		handleSubmit,
		validate,
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		date,
		setDate,
		startDate,
		endDate,
	} = useRegister();

	return (
		<form onSubmit={handleSubmit} onChange={validate} className="space-y-6">
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
						aria-invalid={validationErrors.email != null}
					/>
				</div>
				{renderFieldError(validationErrors.email)}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm/6 font-medium">
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
						aria-invalid={validationErrors.password != null}
					/>
					<button
						type="button"
						aria-label={passwordVisibility ? 'Hide password' : 'Show password'}
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
						aria-invalid={validationErrors.password_confirm != null}
					/>
				</div>
				{renderFieldError(validationErrors.password_confirm)}
			</div>

			<div>
				<label htmlFor="birthDate" className="mb-2 block text-sm font-medium">
					Birth Date
				</label>
				<DatePicker
					id="birthDate"
					date={date}
					setDate={setDate}
					startDate={startDate}
					endDate={endDate}
				/>
				{renderFieldError(validationErrors.birthDate)}
			</div>

			<div>
				<div className="my-2 flex items-center">
					<label className="relative flex items-center">
						<input
							ref={conditionsRef}
							type="checkbox"
							aria-invalid={validationErrors.conditions != null}
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
								/>
							</svg>
						</span>
					</label>
					<label htmlFor="remember-me" className="ml-3 block text-sm">
						Accept conditions
					</label>
				</div>
				{renderFieldError(validationErrors.conditions)}
			</div>

			<Button
				type="submit"
				disabled={validationErrors && Object.keys(validationErrors).length > 0}
				className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				Register
			</Button>
		</form>
	);
};
