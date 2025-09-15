import { useImageUpload } from '@/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { Category, StoreValidationErrors } from '@/types';
import { validateSchema } from '@/utils/validation';
import { manageStoreSchema } from '@/utils/validation/schemas';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useStoreManager = (defaultCategories: Category[]) => {
	const logo = useImageUpload();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const [categories, setCategories] = useState<Category[]>(
		() => defaultCategories
	);
	const isMounted = useRef(false);
	const [validationErrors, setValidationErrors] =
		useState<StoreValidationErrors>({});

	const validate = useCallback((): boolean => {
		const formInputValues = {
			name: nameRef.current?.value.trim() || '',
			categories,
		};
		if (!isMounted.current) isMounted.current = true;
		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			manageStoreSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [categories]);

	useEffect(() => {
		if (isMounted.current) validate();
	}, [categories.length, validate]);

	const handleChange = (category: Category) => {
		setCategories((prev) =>
			prev.includes(category)
				? prev.filter((cat) => cat !== category)
				: [...prev, category]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		const file = logo.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('description', descRef.current?.value as string);
		if (file) formData.append('logo', file);
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

		try {
			notify.success('Store Updated.', {
				description: 'Your store has been updated successfully.',
			});
		} catch (error) {
			console.error('Error', error);

			notify.error('failed to Update Store', {
				description:
					error instanceof AxiosError
						? error.response?.data.message
						: 'Something went wrong while updating the store.',
			});
		}
	};

	return {
		refs: { nameRef, descRef },
		categories,
		validate,
		validationErrors,
		handleChange,
		handleSubmit,
		logo,
	};
};
