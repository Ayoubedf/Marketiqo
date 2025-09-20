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
	const navigate = useNavigate();
	const authAction = useAuthActions();
	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();

	const validate = useCallback((): boolean => {
		const formInputValues: RegisterRequestPayload = {
			email: emailRef.current?.value.toLowerCase().trim() as string,
			password: passwordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
			birthDate: date,
			conditions: conditionsRef.current?.checked as boolean,
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			registerSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [date]);

	useEffect(() => {
		if (date) validate();
	}, [date, validate]);

	const resetForm = () => {
		if (emailRef.current) emailRef.current.value = '';
		if (passwordRef.current) passwordRef.current.value = '';
		if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
		setValidationErrors({});
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
		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		const response = await authAction.register(data);
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
		validate,
		validationErrors,
		passwordVisibility,
		setPasswordVisibility,
		resetForm,
		handleSubmit,
	};
};
