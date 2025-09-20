import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useImageUpload } from '@/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { isApiError } from '@/types';
import { validateSchema } from '@/utils/validation';
import { editProfileSchema } from '@/utils/validation/schemas';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ValidationErrors {
	name?: string;
	email?: string;
	birthDate?: string;
}

interface TempUser {
	oauth_id: string;
	oauth_provider: string;
	avatar: string;
	email: string;
	isVerified: boolean;
	name: string;
	birthDate: Date;
}

const useProfile = () => {
	const token = new URLSearchParams(useLocation().search).get('token') || '';

	let tempUser: TempUser | null = null;

	try {
		const decoded = jwtDecode<{ tempUser: TempUser; exp: number; iat: number }>(
			token
		);

		if (decoded.exp * 1000 < Date.now()) {
			notify.error('There was an error', { description: 'temp token expired' });
		} else tempUser = decoded.tempUser;
	} catch (err) {
		console.error('Invalid reset token:', err);
	}

	const authAction = useAuthActions();
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const DefaultDate = tempUser?.birthDate
		? new Date(tempUser.birthDate)
		: new Date();
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
	const navigate = useNavigate();
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
		const formData: FormData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('email', emailRef.current?.value as string);
		formData.append('birthDate', (date || new Date()).toISOString());
		formData.append('token', token);
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

		const response = await authAction.completeProfile(formData);

		if (!isApiError(response)) {
			navigate(APP_ROUTES.LOGIN, {
				replace: true,
			});
		}
	};

	const title = useMemo(() => `Complete Profile | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { nameRef, emailRef, fileInputRef },
		user: tempUser,
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
