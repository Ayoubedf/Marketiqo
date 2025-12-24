import { useImageUpload } from '@/shared/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { Category, StoreValidationErrors } from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { manageStoreSchema } from '@/shared/utils/validation/schemas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState, useAxiosPrivate } from '@/features/auth';
import { updateStore } from '@/services/storeService';

export const useStoreManager = (id: string, defaultCategories: Category[]) => {
	const logo = useImageUpload();
	useAuthState();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const [categories, setCategories] = useState<Category[]>(
		() => defaultCategories
	);
	const categoriesUpdated = useRef(false);
	const [validationErrors, setValidationErrors] =
		useState<StoreValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const axiosPrivate = useAxiosPrivate();
	const handleUpdateStore = useCallback(
		(data: FormData) => updateStore(axiosPrivate, id, data),
		[axiosPrivate, id]
	);
	// const navigate = useNavigate();
	const MAX_FILE_SIZE_MB = 5;

	interface StoreDetailsFormValues {
		name: string;
		description: string;
		categories: Category[];
	}

	const getFormValues = useCallback(
		(): StoreDetailsFormValues => ({
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
			manageStoreSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof StoreDetailsFormValues) => {
			const values = getFormValues();
			const errors = validateSchema(values, manageStoreSchema);
			setValidationErrors((prev) => ({
				...prev,
				[name]: errors[name],
			}));
		},
		[getFormValues]
	);

	const handleChange = (category: Category) => {
		if (!categoriesUpdated.current) categoriesUpdated.current = true;
		setCategories((prev) =>
			prev.includes(category)
				? prev.filter((cat) => cat !== category)
				: [...prev, category]
		);
	};

	// const resetForm = () => {
	// 	if (nameRef.current) nameRef.current.value = '';
	// 	if (descRef.current) descRef.current.value = '';
	// 	if (categories.length) setCategories([]);
	// 	logo.handleRemove();
	// 	setValidationErrors({});
	// };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		const file = logo.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('description', descRef.current?.value as string);
		if (file) {
			formData.append('logo', file);
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				notify.error("Can't upload file", {
					description: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
				});
				logo.handleRemove();
				return;
			}
		}
		categories.forEach((category) => {
			formData.append('categories[]', category);
		});

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		setIsSubmitting(true);
		await handleUpdateStore(formData);
		setIsSubmitting(false);
	};

	useEffect(() => {
		if (categoriesUpdated.current) validateField('categories');
	}, [categories.length, validateField]);

	return {
		refs: { nameRef, descRef },
		categories,
		validateField,
		validationErrors,
		handleChange,
		handleSubmit,
		logo,
		isSubmitting,
	};
};
