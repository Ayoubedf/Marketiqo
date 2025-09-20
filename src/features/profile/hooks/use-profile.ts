import { APP_NAME } from '@/config/constants';
import { useAuthActions, useAuthState } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useImageUpload } from '@/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { validateSchema } from '@/utils/validation';
import { editProfileSchema } from '@/utils/validation/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ValidationErrors {
	name?: string;
	email?: string;
	birthDate?: string;
}

const useProfile = () => {
	const { state } = useAuthState();
	const user = state?.user;
	const { updateProfile } = useAuthActions();
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const DefaultDate = user?.birthDate ? new Date(user.birthDate) : new Date();
	const [date, setDate] = useState<Date | undefined>(DefaultDate);
	const {
		previewUrl,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		handleRemove,
	} = useImageUpload();
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();
	const MAX_FILE_SIZE_MB = 5;

	const validate = useCallback((): boolean => {
		const formInputValues = {
			name: nameRef.current?.value.trim() || '',
			email: emailRef.current?.value.trim() || '',
			birthDate: date,
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			editProfileSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [date]);

	useEffect(() => {
		if (date) validate();
	}, [date, validate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		const file = fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('email', emailRef.current?.value as string);
		formData.append('birthDate', (date || new Date()).toISOString());
		if (file) {
			formData.append('avatar', file);
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				notify.error("Can't upload file", {
					description: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
				});
				handleRemove();
				return;
			}
		}

		await updateProfile(formData);
	};

	const title = useMemo(() => `Edit Profile | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { nameRef, emailRef, fileInputRef },
		user,
		date,
		setDate,
		startDate,
		endDate,
		previewUrl,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		handleRemove,
		validate,
		validationErrors,
		handleSubmit,
	};
};

export default useProfile;
