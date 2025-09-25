import { useCallback, useMemo, useRef, useState } from 'react';
import { useAuthActions } from '@/features/auth';
import { PasswordChangePayload } from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { notify } from '@/lib/notify';
import { changePasswordSchema } from '@/shared/utils/validation/schemas';
import { APP_NAME } from '@/core/config/constants';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';

interface ValidationErrors {
	current_password?: string;
	password?: string;
	password_confirm?: string;
}

export function useSettings() {
	const { updatePassword } = useAuthActions();
	const currentPasswordRef = useRef<HTMLInputElement>(null);
	const newPasswordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [currentPasswordVisibility, setCurrentPasswordVisibility] =
		useState(false);
	const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getFormValues = useCallback(
		(): PasswordChangePayload => ({
			current_password: currentPasswordRef.current?.value.trim() || '',
			password: newPasswordRef.current?.value.trim() || '',
			password_confirm: confirmPasswordRef.current?.value.trim() || '',
		}),
		[]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			changePasswordSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof PasswordChangePayload) => {
			const values = getFormValues();
			const errors = validateSchema(values, changePasswordSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = getFormValues();

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		setIsSubmitting(true);
		await updatePassword(data);
		setIsSubmitting(false);
	};

	const title = useMemo(() => `Settings | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: {
			currentPasswordRef,
			newPasswordRef,
			confirmPasswordRef,
		},
		validationErrors,
		currentPasswordVisibility,
		newPasswordVisibility,
		setCurrentPasswordVisibility,
		setNewPasswordVisibility,
		validateField,
		handlePasswordUpdate,
		isSubmitting,
	};
}
