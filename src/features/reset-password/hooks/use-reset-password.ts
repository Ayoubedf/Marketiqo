import { APP_NAME, APP_ROUTES } from '@/core/config/constants';
import { tokenManager, useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import {
	ApiError,
	isApiError,
	ResetConfPasswordPayload,
	ValidationErrors,
} from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { resetPasswordSchema } from '@/shared/utils/validation/schemas';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useResetPassword = () => {
	const authAction = useAuthActions();
	const resetToken = tokenManager.getResetToken();
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [, setError] = useState<ApiError | null>(null);
	const navigate = useNavigate();

	const getFormValues = useCallback(
		(): ResetConfPasswordPayload => ({
			password: newPasswordRef.current?.value.trim() || '',
			password_confirm: confirmPasswordRef.current?.value.trim() || '',
			resetToken,
		}),
		[resetToken]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			resetPasswordSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof ResetConfPasswordPayload) => {
			const values = getFormValues();
			const errors = validateSchema(values, resetPasswordSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = getFormValues();
		if (!validate()) return;

		setIsSubmitting(true);
		const response = await authAction.resetConfPassword(data);
		setIsSubmitting(false);

		if (isApiError(response)) {
			setError(response);
		} else {
			navigate(APP_ROUTES.LOGIN, { replace: true });
		}
	};

	const title = useMemo(() => `Change Password | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { newPasswordRef, confirmPasswordRef },
		resetToken,
		passwordVisibility,
		setPasswordVisibility,
		validateField,
		validationErrors,
		handleSubmit,
		isSubmitting,
	};
};
