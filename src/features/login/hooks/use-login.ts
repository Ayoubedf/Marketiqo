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
import { useCallback, useMemo, useRef, useState } from 'react';
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const authAction = useAuthActions();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || APP_ROUTES.HOME;

	const getFormValues = useCallback(
		(): LoginFormValues => ({
			email: emailRef.current?.value.toLowerCase().trim() || '',
			password: passwordRef.current?.value.trim() || '',
		}),
		[]
	);

	const validate = useCallback((values: LoginFormValues): boolean => {
		const errors = validateSchema(values, loginSchema);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const validateField = useCallback(
		(name: keyof LoginFormValues) => {
			const values = getFormValues();
			const errors = validateSchema(values, loginSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

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
		const values = getFormValues();
		if (!validate(values)) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		setIsSubmitting(true);
		const response = await authAction.login(data);
		if (isApiError(response)) {
			if (response.code === 'REQUEST_CANCELLED') return;
			setError(response);
		} else {
			resetForm();
			navigate(from, { replace: true });
		}
		setIsSubmitting(false);
	};

	const handleForgotPassword = async (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		e.preventDefault();
		const email = emailRef.current?.value.trim() || '';
		if (!emailRegex.test(email)) {
			setValidationErrors({ email: 'Invalid email address.' });
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

	const title = useMemo(() => `Login | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { emailRef, passwordRef, rememberRef },
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		validateField,
		resetForm,
		handleSubmit,
		handleForgotPassword,
		isSubmitting,
	};
};
