import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { APP_ROUTES } from '@/constants/app';
import { useImageUpload } from '@/hooks/use-image-upload';
import { Category, category } from '@/types/auth';
import { StoreValidationErrors } from '@/types/form';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStoreService } from '@/hooks/useStoreService';
import { renderFieldError } from '@/utils/renderFieldError';
import { createStoreSchema, validateSchema } from '@/utils/validations';

export default function CreateStore() {
	const {
		previewUrl,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		handleRemove,
	} = useImageUpload();
	const nameRef = useRef<HTMLInputElement>(null);
	const descRef = useRef<HTMLTextAreaElement>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const isMounted = useRef<boolean>(false);
	const [validationErrors, setValidationErrors] =
		useState<StoreValidationErrors>({});
	const storeService = useStoreService();
	const navigate = useNavigate();

	const validate = useCallback((): boolean => {
		const formInputValues = {
			name: nameRef.current?.value?.trim() || '',
		};
		if (!isMounted.current) isMounted.current = true;

		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			createStoreSchema
		);

		if (categories.length === 0)
			errors.categories = 'You must select at least 1 category';

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [categories.length]);

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
		if (file) formData.append('logo', file);
		categories.forEach((category) => {
			formData.append('categories', category);
		});

		if (!validate()) {
			toast.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
			return;
		}

		try {
			await storeService.createStore(formData);
			toast.success('Store Created', {
				description: 'Your store has been created successfully.',
				icon: <CheckCircle2Icon className="size-5 text-green-500" />,
			});
			resetForm();

			navigate(APP_ROUTES.STORES);
		} catch (error) {
			console.error('Error', error);

			toast.error('failed to Create Store', {
				description:
					error instanceof AxiosError
						? error.response?.data.error
						: 'Something went wrong while creating the store.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
		}
	};

	const handleChange = (category: Category) => {
		setCategories((prev) =>
			prev.includes(category)
				? prev.filter((cat) => cat !== category)
				: [...prev, category]
		);
	};

	useEffect(() => {
		if (isMounted.current) validate();
	}, [categories, validate]);

	return (
		<main className="mx-auto max-w-2xl px-4 py-20 text-center">
			<h1 className="mb-4 text-4xl font-extrabold">
				Create Your Store with Marketiqo
			</h1>
			<p className="mb-8 text-gray-500">
				Launch your own store, showcase your products, and grow your brand with
				ease.
			</p>

			<form
				action="/api/store/create"
				onChange={validate}
				method="POST"
				onSubmit={handleSubmit}
				className="space-y-6 rounded-xl border bg-white p-8 text-left shadow-sm"
			>
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Store Name
					</label>
					<Input
						ref={nameRef}
						id="name"
						name="name"
						type="name"
						autoComplete="name"
					/>
					{renderFieldError(validationErrors.name)}
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700"
					>
						Description
					</label>
					<Textarea
						ref={descRef}
						id="description"
						name="description"
						className="resize-none"
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="logo-upload"
						className="block text-sm font-medium text-gray-700"
					>
						Upload Logo
					</label>
					{previewUrl && (
						<div className="mb-2 flex justify-center">
							<img
								src={previewUrl}
								alt="Logo preview"
								className="max-h-40 w-full max-w-xs rounded border object-contain shadow-2xs"
							/>
						</div>
					)}
					<Button
						variant="outline"
						type="button"
						onClick={handleThumbnailClick}
						aria-haspopup="dialog"
					>
						{fileName ? 'Change image' : 'Upload image'}
					</Button>
					<input
						id="logo-upload"
						name="logo"
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
						accept="image/*"
						aria-label="Upload image file"
					/>
				</div>
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Categories
					</label>
					<div className="mt-4 mb-8">
						<div className="mb-4 grid grid-cols-2 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
							{category.map((cat) => {
								const checkboxId = `checkbox-${cat.replace(/\s+/g, '-')}`;
								const isChecked = categories.includes(cat);

								return (
									<div className="inline-flex items-center space-x-2" key={cat}>
										<label className="relative flex items-center">
											<input
												id={checkboxId}
												type="checkbox"
												checked={isChecked}
												onChange={() => handleChange(cat)}
												className="peer h-5 w-5 appearance-none rounded border border-gray-200 shadow transition-all outline-none checked:border-blue-600 checked:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
											/>
											<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-3.5 w-3.5"
													viewBox="0 0 20 20"
													fill="currentColor"
													stroke="currentColor"
													strokeWidth="1"
												>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													></path>
												</svg>
											</span>
										</label>
										<label
											htmlFor={checkboxId}
											className="cursor-pointer text-sm capitalize"
										>
											{cat}
										</label>
									</div>
								);
							})}
						</div>
						{renderFieldError(validationErrors.categories)}
					</div>
					{/* <div className="col-span-full mt-4">
						<p className="text-sm font-semibold">Selected Categories:</p>
						<pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
							{JSON.stringify(categories, null, 2)}
						</pre>
					</div> */}
				</div>

				<Button type="submit" className="w-full bg-blue-700 hover:bg-blue-600">
					Create Store
				</Button>
			</form>
		</main>
	);
}
