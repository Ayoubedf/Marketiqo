import { motion } from 'framer-motion';
import useCreateStore from '../../hooks/use-create-store';
import { Input } from '@/shared/components/ui/input';
import { renderFieldError } from '@/shared/utils/renderFieldError';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { CategoryCheckboxes } from '@/shared/components/common/CategoryCheckboxes';

export const CreateStore = () => {
	const {
		fileName,
		handleChange,
		handleFileChange,
		handleSubmit,
		handleThumbnailClick,
		previewUrl,
		refs: { descRef, fileInputRef, nameRef },
		validateField,
		validationErrors,
		categories,
		isSubmitting,
	} = useCreateStore();

	return (
		<motion.form
			onSubmit={handleSubmit}
			noValidate
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
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
					aria-invalid={!!validationErrors.name}
					aria-required="true"
					aria-describedby={validationErrors.name ? 'name-error' : undefined}
					onBlur={() => validateField('name')}
				/>
				{renderFieldError(validationErrors.name, 'name')}
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
			<fieldset
				aria-invalid={!!validationErrors.categories}
				aria-required="true"
				aria-describedby={
					validationErrors.categories ? 'categories-error' : undefined
				}
			>
				<legend className="block text-sm font-medium text-gray-700">
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

			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-blue-700 hover:bg-blue-600"
			>
				{isSubmitting ? 'Creating...' : 'Create Store'}
			</Button>
		</motion.form>
	);
};
