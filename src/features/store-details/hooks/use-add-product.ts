import { useImageUpload } from '@/shared/hooks/use-image-upload';
import { notify } from '@/lib/notify';
import {
	AddProductFormValues,
	ProductValidationErrors,
	StoreValidationErrors,
} from '@/types';
import { validateSchema } from '@/shared/utils/validation';
import { addProductSchema } from '@/shared/utils/validation/schemas';
import { useCallback, useRef, useState } from 'react';
import { useAxiosPrivate } from '@/features/auth';
import { addStoreProducts } from '@/services/productService';

export const useAddProduct = (id: string) => {
	const preview = useImageUpload();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const priceRef = useRef<HTMLInputElement>(null);
	const [category, setCategory] = useState<string>('');
	const [validationErrors, setValidationErrors] =
		useState<ProductValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const axiosPrivate = useAxiosPrivate();
	const handleAddProduct = useCallback(
		(data: FormData) => addStoreProducts(axiosPrivate, id, data),
		[axiosPrivate, id]
	);
	const MAX_FILE_SIZE_MB = 5;

	const getFormValues = useCallback(
		(): AddProductFormValues => ({
			name: nameRef.current?.value.trim() || '',
			price: parseFloat(priceRef.current?.value ?? '0'),
			description: descRef.current?.value.trim() || '',
			category,
		}),
		[category]
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
		setCategory('');
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
		if (file) {
			formData.append('preview', file);
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				notify.error("Can't upload file", {
					description: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
				});
				preview.handleRemove();
				return;
			}
		}
		formData.append('price', values.price.toString());
		formData.append('category', values.category);

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		setIsSubmitting(true);
		await handleAddProduct(formData);
		resetForm();
		setIsSubmitting(false);
	};

	return {
		refs: { nameRef, descRef, priceRef, category, setCategory },
		preview,
		validateField,
		validationErrors,
		handleSubmit,
		resetForm,
		isSubmitting,
	};
};
