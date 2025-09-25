import { useImageUpload } from '@/shared/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import {
	AddProductFormValues,
	ProductValidationErrors,
	StoreValidationErrors,
} from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { addProductSchema } from '@/shared/utils/validation/schemas';
import { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';

export const useAddProduct = () => {
	const preview = useImageUpload();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const [validationErrors, setValidationErrors] =
		useState<ProductValidationErrors>({});
	const [isSubmitting] = useState(false);

	const getFormValues = useCallback(
		(): AddProductFormValues => ({
			name: nameRef.current?.value.trim() || '',
			price: parseFloat(priceRef.current?.value ?? '0'),
			description: descRef.current?.value.trim() || '',
		}),
		[]
	);

	const validate = useCallback((): boolean => {
		const formInputValues = getFormValues();
		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			addProductSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [getFormValues]);

	const validateField = useCallback(
		(name: keyof AddProductFormValues) => {
			const values = getFormValues();
			const errors = validateSchema(values, addProductSchema);
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
		if (priceRef.current) priceRef.current.value = '';
		preview.handleRemove();
		setValidationErrors({});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});
		const values = getFormValues();
		const file = preview.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', values.name);
		formData.append('description', values.description);
		if (file) formData.append('preview', file);
		formData.append('price', values.price.toString());

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
		validateField,
		validationErrors,
		handleSubmit,
		resetForm,
		isSubmitting,
	};
};
