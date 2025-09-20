import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { tokenManager, useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import {
	ApiError,
	isApiError,
	ResetConfPasswordPayload,
	ValidationErrors,
} from '@/types';
import { validateSchema } from '@/utils/validation';
import { resetPasswordSchema } from '@/utils/validation/schemas';
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
	const [, setError] = useState<ApiError | null>(null);
	const navigate = useNavigate();

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

	const title = useMemo(() => `Change Password | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { newPasswordRef, confirmPasswordRef },
		resetToken,
		passwordVisibility,
		setPasswordVisibility,
		validate,
		validationErrors,
		handleSubmit,
	};
};
