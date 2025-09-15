import { useImageUpload } from '@/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import { ProductValidationErrors, StoreValidationErrors } from '@/types';
import { validateSchema } from '@/utils/validation';
import { addProductSchema } from '@/utils/validation/schemas';
import { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';

export const useAddProduct = () => {
	const preview = useImageUpload();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] =
		useState<ProductValidationErrors>({});

	const validate = useCallback((): boolean => {
		const formInputValues = {
			name: nameRef.current?.value.trim() || '',
			price: parseFloat(priceRef.current?.value ?? '0'),
		};
		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			addProductSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const resetForm = () => {
		if (nameRef.current) nameRef.current.value = '';
		if (descRef.current) descRef.current.value = '';
		if (priceRef.current) priceRef.current.value = '';
		preview.handleRemove();
		setValidationErrors({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		const file = preview.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('description', descRef.current?.value as string);
		if (file) formData.append('preview', file);
		formData.append('price', priceRef.current?.value as string);

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		try {
			notify.success('Product Added', {
				description: 'Your product has been added successfully.',
			});
			resetForm();
		} catch (error) {
			console.error('Error: ', error);

			notify.error('failed to Add Product', {
				description:
					error instanceof AxiosError
						? error.response?.data.message
						: 'Something went wrong while adding the product.',
			});
		}
	};

	return {
		refs: { nameRef, descRef, priceRef },
		preview,
		validate,
		validationErrors,
		handleSubmit,
		resetForm,
	};
};
