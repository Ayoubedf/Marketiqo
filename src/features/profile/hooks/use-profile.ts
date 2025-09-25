import { APP_NAME } from '@/core/config/constants';
import { useAuthActions, useAuthState } from '@/features/auth';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useImageUpload } from '@/shared/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { ProfileFormValues } from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { profileSchema } from '@/shared/utils/validation/schemas';
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();
	const MAX_FILE_SIZE_MB = 5;

	const getFormValues = useCallback(
		(): ProfileFormValues => ({
			email: emailRef.current?.value.toLowerCase().trim() || '',
			name: nameRef.current?.value.trim() || '',
			birthDate: date,
		}),
		[date]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			profileSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof ProfileFormValues) => {
			const values = getFormValues();
			const errors = validateSchema(values, profileSchema);
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

		setIsSubmitting(true);
		await updateProfile(formData);
		setIsSubmitting(false);
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
		validateField,
		validationErrors,
		handleSubmit,
		isSubmitting,
	};
};

export default useProfile;
