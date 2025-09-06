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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { APP_NAME } from '@/constants/app';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useStoreService } from '@/hooks/use-store-service';
import {
	ApiError,
	isApiError,
	Store,
	Category,
	category,
	ProductValidationErrors,
	StoreValidationErrors,
} from '@/types';
import { renderFieldError } from '@/utils/renderFieldError';
import {
	addProductSchema,
	manageStoreSchema,
	validateSchema,
} from '@/utils/validations';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notify } from '@/lib/notify';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { containerVariants, itemVariants } from '@/constants/motion';

const StoreDetails = () => {
	const [store, setStore] = useState<Store | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const storeService = useStoreService();
	const { id = '' } = useParams();
	const storeLogo = useImageUpload();
	const productPreview = useImageUpload();
	const storeNameRef = useRef<HTMLInputElement>(null);
	const storeDescRef = useRef<HTMLTextAreaElement>(null);
	const productNameRef = useRef<HTMLInputElement>(null);
	const productDescRef = useRef<HTMLTextAreaElement>(null);
	const productPriceRef = useRef<HTMLInputElement>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const isStoreDetailsMounted = useRef(false);
	const [storeValidationErrors, setStoreValidationErrors] =
		useState<StoreValidationErrors>({});
	const [productValidationErrors, setProductValidationErrors] =
		useState<ProductValidationErrors>({});

	const validateStoreDetails = useCallback((): boolean => {
		const formInputValues = {
			name: storeNameRef.current?.value.trim() || '',
			categories,
		};
		if (!isStoreDetailsMounted.current) isStoreDetailsMounted.current = true;
		const errors: StoreValidationErrors = validateSchema(
			formInputValues,
			manageStoreSchema
		);
		setStoreValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [categories]);

	const validateProductDetails = useCallback((): boolean => {
		const formInputValues = {
			name: productNameRef.current?.value.trim() || '',
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
		productPreview.handleRemove();
		setProductValidationErrors({});
	};

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);

		const fetchStore = async () => {
			const response = await storeService.getStore(controller, id);
			if (isApiError(response)) {
				if (response.code === 'REQUEST_CANCELLED') return;
				setError(response);
			} else {
				setStore(response);
				setCategories(response.categories);
			}
			setLoading(false);
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
		const file = storeLogo.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', storeNameRef.current?.value as string);
		formData.append('description', storeDescRef.current?.value as string);
		if (file) formData.append('logo', file);
		categories.forEach((category) => {
			formData.append('categories', category);
		});

		if (!validateStoreDetails()) {
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

	const handleAddProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		setProductValidationErrors({});
		const file = productPreview.fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', productNameRef.current?.value as string);
		formData.append('description', productDescRef.current?.value as string);
		if (file) formData.append('preview', file);
		formData.append('price', productPriceRef.current?.value as string);

		if (!validateProductDetails()) {
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
			resetProductForm();
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

	const title = `${store?.name ?? 'Store'} | ${APP_NAME}`;
	useDocumentTitle(title);

	const logoPreview = storeLogo.previewUrl || store?.logo;

	return (
		<div className="container mx-auto max-w-6xl space-y-8 px-6 py-16">
			{/* Store Info */}

			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-8 flex flex-wrap items-center justify-between gap-8 rounded-xl p-6"
			>
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
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className="flex gap-3"
				>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">
								<PlusCircleIcon /> Add Product
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-full p-0 sm:max-w-xl">
							<ScrollArea className="max-h-screen">
								<form
									onChange={validateProductDetails}
									onSubmit={handleAddProduct}
									className="py-6 pr-10 pl-6"
								>
									<DialogHeader>
										<DialogTitle>Add Product</DialogTitle>
										<DialogDescription>
											Add a new product by completing the form below. Don’t
											forget to click 'Save' to publish it to your store.
										</DialogDescription>
									</DialogHeader>

									<div className="my-4 grid gap-4">
										<div className="grid">
											<Label htmlFor="name-1" className="mb-1">
												Name
											</Label>
											<Input ref={productNameRef} id="name-1" name="name" />
											{renderFieldError(productValidationErrors.name)}
										</div>

										<div className="grid">
											<Label htmlFor="description-1" className="mb-1">
												Description
											</Label>
											<Textarea
												ref={productDescRef}
												id="description-1"
												name="description"
												className="resize-none"
											/>
										</div>

										<div className="grid gap-3">
											<Label htmlFor="preview-upload">Upload Preview</Label>
											{productPreview.previewUrl && (
												<div className="mb-2 flex justify-center">
													<img
														src={productPreview.previewUrl}
														alt="Logo preview"
														className="max-h-40 w-full max-w-xs rounded border object-contain shadow-2xs"
													/>
												</div>
											)}
											<Button
												variant="outline"
												type="button"
												className="w-fit"
												onClick={productPreview.handleThumbnailClick}
												aria-haspopup="dialog"
											>
												{productPreview.fileName
													? 'Change image'
													: 'Upload image'}
											</Button>
											<input
												id="preview-upload"
												name="logo"
												type="file"
												ref={productPreview.fileInputRef}
												onChange={productPreview.handleFileChange}
												className="hidden"
												accept="image/*"
												aria-label="Upload image file"
											/>
										</div>

										<div className="grid">
											<Label htmlFor="price-1" className="mb-1">
												Price ($)
											</Label>
											<Input
												ref={productPriceRef}
												id="price-1"
												name="price"
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
										<Button
											disabled={
												productValidationErrors &&
												Object.keys(productValidationErrors).length > 0
											}
											type="submit"
										>
											Save
										</Button>
									</DialogFooter>
								</form>
							</ScrollArea>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" className="flex items-center gap-2">
								<SettingsIcon className="h-4 w-4" />
								Manage Store
							</Button>
						</DialogTrigger>
						<DialogContent className="max-h-full p-0 sm:max-w-xl">
							<ScrollArea className="max-h-screen">
								<form
									onChange={validateStoreDetails}
									onSubmit={handleManageStore}
									className="py-6 pr-10 pl-6"
								>
									<DialogHeader>
										<DialogTitle>Manage Store</DialogTitle>
										<DialogDescription>
											Modify store details, branding, and configurations.
											Changes will be visible to customers once saved.
										</DialogDescription>
									</DialogHeader>
									<div className="my-4 grid gap-4">
										<div className="grid">
											<Label htmlFor="name-2" className="mb-1">
												Name
											</Label>
											<Input
												id="name-2"
												autoComplete="name"
												name="name"
												defaultValue={store?.name}
												ref={storeNameRef}
											/>
											{renderFieldError(storeValidationErrors.name)}
										</div>
										<div className="grid">
											<Label htmlFor="description-2" className="mb-1">
												Description
											</Label>
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
											{logoPreview && (
												<div className="mb-2 flex justify-center">
													<img
														src={logoPreview}
														alt="Logo preview"
														className="max-h-40 w-full max-w-xs rounded border object-contain shadow-2xs"
													/>
												</div>
											)}
											<Button
												variant="outline"
												type="button"
												className="w-fit"
												onClick={storeLogo.handleThumbnailClick}
												aria-haspopup="dialog"
											>
												{storeLogo.fileName || store?.logo
													? 'Change image'
													: 'Upload image'}
											</Button>
											<input
												id="logo-upload"
												name="logo"
												type="file"
												ref={storeLogo.fileInputRef}
												onChange={storeLogo.handleFileChange}
												className="hidden"
												accept="image/*"
												aria-label="Upload image file"
											/>
										</div>
										<div className="grid">
											<Label className="mb-2">Categories</Label>
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
																	autoComplete="name"
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
										<Button
											disabled={
												storeValidationErrors &&
												Object.keys(storeValidationErrors).length > 0
											}
											type="submit"
										>
											Save
										</Button>
									</DialogFooter>
								</form>
							</ScrollArea>
						</DialogContent>
					</Dialog>
				</motion.div>
			</motion.div>

			{/* Product Management */}
			<section>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-4 flex items-center justify-between"
				>
					<h3 className="text-xl font-semibold">Products</h3>
				</motion.div>
				{/* Products Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="container mx-auto mt-6 grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
				>
					{error ? (
						<ErrorMessage
							title="There was an error while retrieving the products."
							reason={error.message}
						/>
					) : loading ? (
						[...Array(3)].map((_, id) => (
							<ProductSkeleton key={`skeleton-${id}`} />
						))
					) : store?.products.length ? (
						store.products.map((product) => (
							<motion.div key={product._id} variants={itemVariants}>
								<ProductCard product={product} />
							</motion.div>
						))
					) : (
						<motion.p
							className="col-span-full text-center text-gray-500 italic"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							No products found.
						</motion.p>
					)}
				</motion.div>
			</section>
		</div>
	);
};

export default StoreDetails;
