import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { notify } from '@/lib/notify';
import { isApiError, RegisterRequestPayload, ValidationErrors } from '@/types';
import { validateSchema } from '@/utils/validation';
import { registerSchema } from '@/utils/validation/schemas';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const conditionsRef = useRef<HTMLInputElement>(null);

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [date, setDate] = useState<Date | undefined>();
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();
	const authAction = useAuthActions();

	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();

	const getFormValues = useCallback(
		(): RegisterRequestPayload => ({
			email: emailRef.current?.value.toLowerCase().trim() as string,
			password: passwordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
			birthDate: date,
			conditions: conditionsRef.current?.checked as boolean,
		}),
		[date]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			registerSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof RegisterRequestPayload) => {
			const values = getFormValues();
			const errors: Partial<Record<keyof RegisterRequestPayload, string>> =
				validateSchema(values, registerSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

	useEffect(() => {
		if (date) validateField('birthDate');
	}, [date, validateField]);

	const resetForm = () => {
		if (emailRef.current) emailRef.current.value = '';
		if (passwordRef.current) passwordRef.current.value = '';
		if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
		if (conditionsRef.current) conditionsRef.current.checked = false;
		setDate(undefined);
		setValidationErrors({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		const data: RegisterRequestPayload = {
			name: emailRef.current?.value.trim().split('@')[0] as string,
			email: emailRef.current?.value.toLowerCase().trim() as string,
			password: passwordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
			birthDate: date as Date,
			conditions: conditionsRef.current?.checked as boolean,
		};

		setIsSubmitting(true);
		const response = await authAction.register(data);
		setIsSubmitting(false);

		if (!isApiError(response)) {
			resetForm();
			navigate(APP_ROUTES.LOGIN);
		}
	};

	const title = useMemo(() => `Register | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: {
			emailRef,
			passwordRef,
			confirmPasswordRef,
			conditionsRef,
		},
		date,
		setDate,
		startDate,
		endDate,
		validateField,
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		resetForm,
		handleSubmit,
		isSubmitting,
	};
};
