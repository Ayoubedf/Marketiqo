import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { APP_NAME } from '@/constants/app';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useStoreService } from '@/hooks/useStoreService';
import { Store } from '@/types/api';
import { Category, category, ErrorResponse } from '@/types/auth';
import { ProductValidationErrors, StoreValidationErrors } from '@/types/form';
import { renderFieldError } from '@/utils/renderFieldError';
import {
	addProductSchema,
	manageStoreSchema,
	validateSchema,
} from '@/utils/validations';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AxiosError, isCancel } from 'axios';
import {
	CheckCircle2Icon,
	PlusCircleIcon,
	SettingsIcon,
	XCircleIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const StoreDetails = () => {
	const [store, setStore] = useState<Store | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ErrorResponse | null>(null);
	const storeService = useStoreService();
	const { id = '' } = useParams();
	const logo = useImageUpload();
	const preview = useImageUpload();
	const storeNameRef = useRef<HTMLInputElement>(null);
	const storeDescRef = useRef<HTMLTextAreaElement>(null);
	const productNameRef = useRef<HTMLInputElement>(null);
	const productDescRef = useRef<HTMLTextAreaElement>(null);
	const productPriceRef = useRef<HTMLInputElement>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const isStoreDetailsMounted = useRef(false);
	const [storeValidationErrors, setStoreValidationErrors] =
		useState<StoreValidationErrors>({});
	const [productValidationErrors, setProductValidationErrors] =
		useState<ProductValidationErrors>({});

	const validateStoreDetails = useCallback((): boolean => {
		const formInputValues = {
			name: storeNameRef.current?.value?.trim() || '',
		};
		if (!isStoreDetailsMounted.current) isStoreDetailsMounted.current = true;

		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			manageStoreSchema
		);

		if (categories.length === 0)
			errors.categories = 'You must select at least 1 category';

		setStoreValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [categories.length]);

	const validateProductDetails = useCallback((): boolean => {
		const formInputValues = {
			name: productNameRef.current?.value?.trim() || '',
			price: parseFloat(productPriceRef.current?.value ?? '0'),
		};

		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			addProductSchema
		);

		setProductValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, []);

	const resetProductForm = () => {
		if (productNameRef.current) productNameRef.current.value = '';
		if (productDescRef.current) productDescRef.current.value = '';
		if (productPriceRef.current) productPriceRef.current.value = '';
		preview.handleRemove();
		setProductValidationErrors({});
	};

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStore = async () => {
			try {
				const res = await storeService.getStore(controller, id);
				setStore(res.data);
				setCategories(res.data.categories);
			} catch (err) {
				if (isCancel(err)) return;
				if (err instanceof AxiosError)
					setError(
						err.response?.data ?? { status: 0, statusText: err.message }
					);
			} finally {
				setLoading(false);
			}
		};

		fetchStore();

		return () => {
			controller.abort();
		};
	}, [id, storeService]);

	useEffect(() => {
		if (isStoreDetailsMounted.current) validateStoreDetails();
	}, [categories.length, validateStoreDetails]);

	const handleChangeCategory = (category: Category) => {
		setCategories((prev) =>
			prev.includes(category)
				? prev.filter((cat) => cat !== category)
				: [...prev, category]
		);
	};

	const handleManageStore = async (e: React.FormEvent) => {
		e.preventDefault();
		setStoreValidationErrors({});
		const file = logo.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', storeNameRef.current?.value as string);
		formData.append('description', storeDescRef.current?.value as string);
		if (file) formData.append('logo', file);
		categories.forEach((category) => {
			formData.append('categories', category);
		});

		if (!validateStoreDetails()) {
			toast.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
			return;
		}

		try {
			toast.success('Store Updated.', {
				description: 'Your store has been updated successfully.',
				icon: <CheckCircle2Icon className="size-5 text-green-500" />,
			});
		} catch (error) {
			console.error('Error', error);

			toast.error('failed to Update Store', {
				description:
					error instanceof AxiosError
						? error.response?.data.error
						: 'Something went wrong while updating the store.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
		}
	};

	const handleAddProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		setProductValidationErrors({});
		const file = preview.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', productNameRef.current?.value as string);
		formData.append('description', productDescRef.current?.value as string);
		if (file) formData.append('preview', file);
		formData.append('price', productPriceRef.current?.value as string);

		if (!validateProductDetails()) {
			toast.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
			return;
		}

		try {
			toast.success('Product Added', {
				description: 'Your product has been added successfully.',
				icon: <CheckCircle2Icon className="size-5 text-green-500" />,
			});
			resetProductForm();
		} catch (error) {
			console.error('Error', error);

			toast.error('failed to Add Product', {
				description:
					error instanceof AxiosError
						? error.response?.data.error
						: 'Something went wrong while adding the product.',
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
		}
	};

	const Error = () => (
		<div className="col-span-full mx-auto w-full px-4 py-2">
			<h1 className="mt-8 text-center text-lg text-gray-700 italic">
				There was an error while retrieving the products.
			</h1>
			<p className="mt-4 text-center text-gray-400">
				Reason: {error?.statusText}
			</p>
			<img
				className="mx-auto w-full max-w-96"
				src="/assets/images/errors/NotFound2.svg"
				alt="data not found"
			/>
		</div>
	);

	document.title = `My Store | ${APP_NAME}`;

	return (
		<div className="container mx-auto max-w-6xl space-y-8 px-6 py-16">
			{/* Store Info */}

			<div className="mb-8 flex flex-wrap items-center justify-between gap-8 rounded-xl p-6">
				<div className="flex items-center gap-4">
					<Avatar className="flex size-15 items-center justify-center overflow-hidden rounded-2xl shadow ring-2 ring-gray-100">
						<AvatarImage
							src={store?.logo}
							alt={`${store?.name}'s logo`}
							className="size-4/5 rounded-2xl object-cover"
						/>
						<AvatarFallback className="text-xs">{store?.name}</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-2xl font-bold">{store?.name}</h2>
						<p className="text-sm text-gray-500">Store ID: {store?._id}</p>
					</div>
				</div>
				<div className="flex gap-3">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">
								<PlusCircleIcon /> Add Product
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-full overflow-y-auto sm:max-w-xl">
							<form
								onChange={validateProductDetails}
								method="POST"
								onSubmit={handleAddProduct}
							>
								<DialogHeader>
									<DialogTitle>Add Product</DialogTitle>
									<DialogDescription>
										Add a new product by completing the form below. Don’t forget
										to click 'Save' to publish it to your store.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="name-1">Name</Label>
										<Input ref={productNameRef} id="name-1" name="name" />
										{renderFieldError(productValidationErrors.name)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="description-1">Description</Label>
										<Textarea
											ref={productDescRef}
											id="description-1"
											name="description"
											className="resize-none"
										/>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="preview-upload">Upload Preview</Label>
										{preview.previewUrl && (
											<div className="mb-2 flex justify-center">
												<img
													src={preview.previewUrl}
													alt="Logo preview"
													className="max-h-40 w-full max-w-xs rounded border object-contain shadow-2xs"
												/>
											</div>
										)}
										<Button
											variant="outline"
											type="button"
											className="w-fit"
											onClick={preview.handleThumbnailClick}
											aria-haspopup="dialog"
										>
											{preview.fileName ? 'Change image' : 'Upload image'}
										</Button>
										<input
											id="preview-upload"
											name="logo"
											type="file"
											ref={preview.fileInputRef}
											onChange={preview.handleFileChange}
											className="hidden"
											accept="image/*"
											aria-label="Upload image file"
										/>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="price-1">Price ($)</Label>
										<Input
											ref={productPriceRef}
											id="price-1"
											name="description"
											type="number"
											step={0.01}
											min={0}
										/>
										{renderFieldError(productValidationErrors.price)}
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" className="flex items-center gap-2">
								<SettingsIcon className="h-4 w-4" />
								Manage Store
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-full overflow-y-auto sm:max-w-xl">
							<form
								onChange={validateStoreDetails}
								method="POST"
								onSubmit={handleManageStore}
							>
								<DialogHeader>
									<DialogTitle>Manage Store</DialogTitle>
									<DialogDescription>
										Modify store details, branding, and configurations. Changes
										will be visible to customers once saved.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4">
									<div className="grid gap-3">
										<Label htmlFor="name-2">Name</Label>
										<Input
											id="name-2"
											name="name"
											defaultValue={store?.name}
											ref={storeNameRef}
										/>
										{renderFieldError(storeValidationErrors.name)}
									</div>
									<div className="grid gap-3">
										<Label htmlFor="description-2">Description</Label>
										<Textarea
											ref={storeDescRef}
											id="description-2"
											name="description"
											className="resize-none"
											defaultValue={store?.description}
										/>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="logo-upload">Upload Logo</Label>
										{(logo.previewUrl || store?.logo) && (
											<div className="mb-2 flex justify-center">
												<img
													src={logo.previewUrl || store?.logo}
													alt="Logo preview"
													className="max-h-40 w-full max-w-xs rounded border object-contain shadow-2xs"
												/>
											</div>
										)}
										<Button
											variant="outline"
											type="button"
											className="w-fit"
											onClick={logo.handleThumbnailClick}
											aria-haspopup="dialog"
										>
											{logo.fileName || store?.logo
												? 'Change image'
												: 'Upload image'}
										</Button>
										<input
											id="logo-upload"
											name="logo"
											type="file"
											ref={logo.fileInputRef}
											onChange={logo.handleFileChange}
											className="hidden"
											accept="image/*"
											aria-label="Upload image file"
										/>
									</div>
									<div className="grid gap-3">
										<Label htmlFor="name-1">Categories</Label>
										<div className="mb-4 grid grid-cols-2 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
											{category.map((cat) => {
												const checkboxId = `checkbox-${cat.replace(/\s+/g, '-')}`;
												const isChecked = categories.includes(cat);

												return (
													<div
														className="inline-flex items-center space-x-2"
														key={cat}
													>
														<label className="relative flex items-center">
															<input
																id={checkboxId}
																type="checkbox"
																checked={isChecked}
																onChange={() => handleChangeCategory(cat)}
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
										{renderFieldError(storeValidationErrors.categories)}
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button type="submit">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Product Management */}
			<section>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-xl font-semibold">Products</h3>
				</div>
				{/* Products Grid */}
				<div className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
					{error ? (
						<Error />
					) : loading ? (
						[...Array(3)].map((_, id) => <ProductSkeleton key={id} />)
					) : (
						store?.products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					)}
				</div>
			</section>
		</div>
	);
};

export default StoreDetails;
