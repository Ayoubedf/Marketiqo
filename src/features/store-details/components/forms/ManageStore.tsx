import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { renderFieldError } from '@/shared/utils/renderFieldError';
import {
	DialogFooter,
	DialogHeader,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import { useStoreManager } from '../../hooks/use-store-manager';
import { Store } from '@/types';
import { CategoryCheckboxes } from '@/shared/components/common/CategoryCheckboxes';

interface ManageStoreProps {
	store: Store;
}

export const ManageStore = ({ store }: ManageStoreProps) => {
	const {
		refs: { nameRef, descRef },
		validateField,
		validationErrors,
		handleSubmit,
		isSubmitting,
		logo,
		handleChange,
		categories,
	} = useStoreManager(store.categories);

	const storeLogo = logo.previewUrl || store.logo;
	return (
		<form onSubmit={handleSubmit} noValidate className="py-6 pr-10 pl-6">
			<DialogHeader>
				<DialogTitle>Manage Store</DialogTitle>
				<DialogDescription>
					Modify store details, branding, and configurations. Changes will be
					visible to customers once saved.
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
						defaultValue={store.name}
						ref={nameRef}
						aria-invalid={!!validationErrors.name}
						aria-required="true"
						aria-describedby={validationErrors.name ? 'name-error' : undefined}
						onBlur={() => validateField('name')}
					/>
					{renderFieldError(validationErrors.name, 'name')}
				</div>
				<div className="grid">
					<Label htmlFor="description-2" className="mb-1">
						Description
					</Label>
					<Textarea
						ref={descRef}
						id="description-2"
						name="description"
						className="resize-none"
						defaultValue={store.description}
					/>
				</div>
				<div className="grid gap-3">
					<Label htmlFor="logo-upload">Upload Logo</Label>
					{storeLogo && (
						<div className="mb-2 flex justify-center">
							<img
								src={storeLogo}
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
						{logo.fileName || store.logo ? 'Change image' : 'Upload image'}
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
				<fieldset
					aria-invalid={!!validationErrors.categories}
					aria-required="true"
					aria-describedby={
						validationErrors.categories ? 'categories-error' : undefined
					}
				>
					<legend className="mb-1 block items-center gap-2 text-sm leading-none font-medium">
						Categories
					</legend>
					<div className="mt-4">
						<div className="mb-4 grid grid-cols-2 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
							<CategoryCheckboxes
								categories={categories}
								handleChange={handleChange}
							/>
						</div>
						{renderFieldError(validationErrors.categories, 'categories')}
					</div>
				</fieldset>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">Cancel</Button>
				</DialogClose>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</Button>
			</DialogFooter>
		</form>
	);
};
