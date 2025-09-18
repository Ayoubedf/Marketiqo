import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { useAuthState, useAxiosPrivate } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useImageUpload } from '@/hooks/use-image-upload';
import * as storeService from '@/services/storeService';
import { notify } from '@/lib/notify';
import {
	Category,
	isApiError,
	ManageStoreFormValues,
	StoreValidationErrors,
} from '@/types';
import { validateSchema } from '@/utils/validation';
import {
	createStoreSchema,
	manageStoreSchema,
} from '@/utils/validation/schemas';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useCreateStore() {
	const {
		previewUrl,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		handleRemove,
	} = useImageUpload();
	const { dispatch } = useAuthState();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const categoriesUpdated = useRef(false);
	const [validationErrors, setValidationErrors] =
		useState<StoreValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const axiosPrivate = useAxiosPrivate();
	const createStore = useCallback(
		(data: FormData) => storeService.createStore(axiosPrivate, data),
		[axiosPrivate]
	);
	const navigate = useNavigate();
	const MAX_FILE_SIZE_MB = 5;

	const getFormValues = useCallback(
		(): ManageStoreFormValues => ({
			name: nameRef.current?.value.trim() || '',
			description: descRef.current?.value.trim() || '',
			categories,
		}),
		[categories]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			createStoreSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof ManageStoreFormValues) => {
			const values = getFormValues();
			const errors = validateSchema(values, manageStoreSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

	const resetForm = () => {
		if (nameRef.current) nameRef.current.value = '';
		if (descRef.current) descRef.current.value = '';
		if (categories.length) setCategories([]);
		handleRemove();
		setValidationErrors({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		const file = fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('description', descRef.current?.value as string);
		if (file) {
			formData.append('logo', file);
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				notify.error("Can't upload file", {
					description: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
				});
				handleRemove();
				return;
			}
		}
		categories.forEach((category) => {
			formData.append('categories', category);
		});

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		setIsSubmitting(true);
		const response = await createStore(formData);
		setIsSubmitting(false);

		if (!isApiError(response)) {
			dispatch({ type: 'UPDATE_USER', payload: { role: 'merchant' } });
			resetForm();
			navigate(APP_ROUTES.STORES);
		}
	};

	const handleChange = (category: Category) => {
		if (!categoriesUpdated.current) categoriesUpdated.current = true;
		setCategories((prev) =>
			prev.includes(category)
				? prev.filter((cat) => cat !== category)
				: [...prev, category]
		);
	};

	useEffect(() => {
		if (categoriesUpdated.current) validateField('categories');
	}, [categories.length, validateField]);

	const title = useMemo(() => `Create Store | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { fileInputRef, nameRef, descRef },
		validateField,
		validationErrors,
		resetForm,
		handleSubmit,
		handleChange,
		previewUrl,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		categories,
		isSubmitting,
	};
}
