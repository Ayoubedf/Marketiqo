import { Button } from '@/shared/components/ui/button';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { Input } from '@/shared/components/ui/input';
import { renderFieldError } from '@/shared/utils/renderFieldError';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { ProfileProps } from '../../types';

export const Profile = (props: ProfileProps) => {
	const {
		refs: { emailRef, fileInputRef, nameRef },
		handleSubmit,
		validateField,
		validationErrors,
		previewUrl,
		user,
		handleThumbnailClick,
		fileName,
		handleFileChange,
		date,
		setDate,
		startDate,
		endDate,
		isSubmitting,
	} = props;

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="space-y-5"
			encType="multipart/form-data"
		>
			<div>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="mb-6 flex flex-col items-center gap-4"
				>
					<Avatar className="relative flex size-25 shrink-0 overflow-hidden rounded-full border-2 border-gray-50 shadow-md">
						<AvatarImage
							src={previewUrl || (user?.avatar as string)}
							alt={`${user?.name}'s avatar`}
						/>
						<AvatarFallback className="flex size-full items-center justify-center text-xs">
							{user?.name}
						</AvatarFallback>
					</Avatar>

					<div className="relative inline-block">
						<Button
							variant="outline"
							type="button"
							onClick={handleThumbnailClick}
							aria-haspopup="dialog"
						>
							{fileName ? 'Change image' : 'Upload image'}
						</Button>
						<input
							name="avatar"
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
							accept="image/*"
							aria-label="Upload image file"
						/>
					</div>
				</motion.div>
				<label htmlFor="name" className="mb-1 block text-sm font-medium">
					Name
				</label>
				<Input
					ref={nameRef}
					id="name"
					name="name"
					autoComplete="name"
					defaultValue={user?.name}
					placeholder="John Doe"
					aria-invalid={!!validationErrors.name}
					aria-required="true"
					aria-describedby={validationErrors.name ? 'name-error' : undefined}
					onBlur={() => validateField('name')}
				/>
				{renderFieldError(validationErrors.name, 'name')}
			</div>

			<div>
				<label htmlFor="email" className="mb-1 block text-sm font-medium">
					Email
				</label>
				<Input
					ref={emailRef}
					autoComplete="email"
					defaultValue={user?.email}
					id="email"
					name="email"
					placeholder="john@doe.com"
					aria-invalid={!!validationErrors.email}
					aria-required="true"
					aria-describedby={validationErrors.email ? 'email-error' : undefined}
					onBlur={() => validateField('email')}
				/>
				{renderFieldError(validationErrors.email, 'email')}
			</div>

			<div>
				<label htmlFor="birthDate" className="mb-1 block text-sm font-medium">
					Birth Date
				</label>
				<DatePicker
					id="birthDate"
					date={date}
					setDate={setDate}
					startDate={startDate}
					endDate={endDate}
					aria-invalid={!!validationErrors.birthDate}
					aria-required="true"
					aria-describedby={
						validationErrors.birthDate ? 'birthdate-error' : undefined
					}
				/>
				{renderFieldError(validationErrors.birthDate, 'birthdate')}
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-blue-700 hover:bg-blue-600"
			>
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</Button>
		</form>
	);
};
