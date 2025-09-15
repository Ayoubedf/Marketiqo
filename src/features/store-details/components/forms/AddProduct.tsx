import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderFieldError } from '@/utils/renderFieldError';
import {
	DialogClose,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { useAddProduct } from '../../hooks/use-add-product';

export const AddProduct = () => {
	const {
		refs: { nameRef, descRef, priceRef },
		preview,
		validate,
		validationErrors,
		handleSubmit,
	} = useAddProduct();

	return (
		<form
			onChange={validate}
			onSubmit={handleSubmit}
			className="py-6 pr-10 pl-6"
		>
			<DialogHeader>
				<DialogTitle>Add Product</DialogTitle>
				<DialogDescription>
					Add a new product by completing the form below. Don’t forget to click
					'Save' to publish it to your store.
				</DialogDescription>
			</DialogHeader>

			<div className="my-4 grid gap-4">
				<div className="grid">
					<Label htmlFor="name-1" className="mb-1">
						Name
					</Label>
					<Input ref={nameRef} id="name-1" name="name" />
					{renderFieldError(validationErrors.name)}
				</div>

				<div className="grid">
					<Label htmlFor="description-1" className="mb-1">
						Description
					</Label>
					<Textarea
						ref={descRef}
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

				<div className="grid">
					<Label htmlFor="price-1" className="mb-1">
						Price ($)
					</Label>
					<Input
						ref={priceRef}
						id="price-1"
						name="price"
						type="number"
						step={0.01}
						min={0}
					/>
					{renderFieldError(validationErrors.price)}
				</div>
			</div>

			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<Button
					disabled={
						validationErrors && Object.keys(validationErrors).length > 0
					}
					type="submit"
				>
					Save
				</Button>
			</DialogFooter>
		</form>
	);
};
