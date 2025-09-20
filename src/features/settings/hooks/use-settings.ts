import { useCallback, useMemo, useRef, useState } from 'react';
import { useAuthActions } from '@/features/auth';
import { PasswordChangePayload } from '@/types';
import { validateSchema } from '@/utils/validation';
import { notify } from '@/lib/notify';
import { changePasswordSchema } from '@/utils/validation/schemas';
import { APP_NAME } from '@/config/constants';
import { useDocumentTitle } from '@/hooks/use-document-title';

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

	const validate = useCallback((): boolean => {
		const formInputValues = {
			current_password: currentPasswordRef.current?.value.trim() as string,
			password: newPasswordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			changePasswordSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const handlePasswordUpdate = async (e: React.FormEvent) => {
		e.preventDefault();

		const data: PasswordChangePayload = {
			current_password: currentPasswordRef.current?.value.trim() as string,
			password: newPasswordRef.current?.value.trim() as string,
			password_confirm: confirmPasswordRef.current?.value.trim() as string,
		};

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		await updatePassword(data);
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
		validate,
		handlePasswordUpdate,
	};
}
