import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { notify } from '@/lib/notify';
import {
	ApiError,
	isApiError,
	LoginFormValues,
	ValidationErrors,
} from '@/types';
import { validateSchema } from '@/utils/validation';
import { emailRegex } from '@/utils/validation/constants';
import { loginSchema } from '@/utils/validation/schemas';
import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLogin = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const rememberRef = useRef<HTMLInputElement>(null);

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [, setError] = useState<ApiError | null>(null);
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const authAction = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || APP_ROUTES.HOME;

	const validate = useCallback((): boolean => {
		const formInputValues = {
			email: emailRef.current?.value.toLowerCase().trim() || '',
			password: passwordRef.current?.value.trim() || '',
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			loginSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const resetForm = () => {
		if (emailRef.current) emailRef.current.value = '';
		if (passwordRef.current) passwordRef.current.value = '';
		if (rememberRef.current) rememberRef.current.value = '';
		setValidationErrors({});
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		const data: LoginFormValues = {
			email: emailRef.current?.value || '',
			password: passwordRef.current?.value || '',
		};
		e.preventDefault();
		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		const response = await authAction.login(data);
		if (isApiError(response)) {
			if (response.code === 'REQUEST_CANCELLED') return;
			setError(response);
		} else {
			resetForm();
			navigate(from, { replace: true });
		}
	};

	const handleForgotPassword = async (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!emailRegex.test(emailRef.current?.value.trim() || '')) {
			setValidationErrors({
				email:
					'Password must contain at least 8 characters, one letter, one number, and one special character',
			});
			return;
		}
		const response = await authAction.resetPassword({
			email: emailRef.current?.value || '',
		});
		if (!isApiError(response)) {
			navigate(APP_ROUTES.PASS_RESET, {
				state: { email: emailRef.current?.value },
			});
		}
	};

	const title = `Login | ${APP_NAME}`;
	useDocumentTitle(title);

	return {
		refs: { emailRef, passwordRef, rememberRef },
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		validate,
		resetForm,
		handleSubmit,
		handleForgotPassword,
	};
};
