import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthActions, useAuthState } from '@/contexts/authContexts';
import { notify } from '@/lib/notify';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/constants/app';
import { DatePicker } from '@/components/ui/date-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useImageUpload } from '@/hooks/use-image-upload';
import { editProfileSchema, validateSchema } from '@/utils/validations';
import { motion } from 'framer-motion';
import { renderFieldError } from '@/utils/renderFieldError';
import { useDocumentTitle } from '@/hooks/use-document-title';

interface ValidationErrors {
	name?: string;
	email?: string;
	birthDate?: string;
}

const Profile = () => {
	const { state } = useAuthState();
	const { updateProfile } = useAuthActions();
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const DefaultDate = state.user?.birthDate
		? new Date(state.user.birthDate)
		: new Date();
	const [date, setDate] = useState<Date | undefined>(DefaultDate);
	const {
		previewUrl,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		fileName,
		handleRemove,
	} = useImageUpload();
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const startDate = new Date(new Date().getFullYear() - 50, 0);
	const endDate = new Date();
	const MAX_FILE_SIZE_MB = 5;

	const validate = useCallback((): boolean => {
		const formInputValues = {
			name: nameRef.current?.value.trim() || '',
			email: emailRef.current?.value.trim() || '',
			birthDate: date,
		};
		const errors: ValidationErrors = validateSchema(
			formInputValues,
			editProfileSchema
		);
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [date]);

	const title = `Edit Profile | ${APP_NAME}`;
	useDocumentTitle(title);

	useEffect(() => {
		if (date) validate();
	}, [date, validate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});

		if (!validate()) {
			notify.error('Validation Error', {
				description: 'Please fix the errors in the form.',
				requiresInternet: false,
			});
			return;
		}

		const file = fileInputRef.current?.files?.[0];
		const formData = new FormData();
		formData.append('name', nameRef.current?.value as string);
		formData.append('email', emailRef.current?.value as string);
		formData.append('birthDate', (date || new Date()).toISOString());
		if (file) {
			formData.append('avatar', file);
			if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
				notify.error("Can't upload file", {
					description: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
				});
				handleRemove();
				return;
			}
		}

		await updateProfile(formData);
	};

	return (
		<div className="col-span-full flex h-full w-full items-center justify-center px-4 py-12">
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="w-full max-w-md py-8"
			>
				<Card className="rounded-sm border-0 px-2 py-8">
					<CardHeader>
						<CardTitle className="mb-2 text-2xl">Edit Profile</CardTitle>
						<CardDescription className="mb-4">
							Edit your profile details to keep your information current and
							personalize your account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit}
							onChange={validate}
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
									<Avatar className="size-25 border-2 border-gray-50 shadow-md">
										<AvatarImage
											src={previewUrl || (state.user?.avatar as string)}
											alt={`${state.user?.name}'s avatar`}
										/>
										<AvatarFallback className="text-xs">
											{state.user?.name}
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
								<label
									htmlFor="name"
									className="mb-1 block text-sm font-medium"
								>
									Name
								</label>
								<Input
									ref={nameRef}
									id="name"
									name="name"
									autoComplete="name"
									defaultValue={state.user?.name}
									placeholder="John Doe"
								/>
								{renderFieldError(validationErrors.name)}
							</div>

							<div>
								<label
									htmlFor="email"
									className="mb-1 block text-sm font-medium"
								>
									Email
								</label>
								<Input
									ref={emailRef}
									autoComplete="email"
									defaultValue={state.user?.email}
									id="email"
									name="email"
									placeholder="john@doe.com"
								/>
								{renderFieldError(validationErrors.email)}
							</div>

							<div>
								<label
									htmlFor="birthDate"
									className="mb-1 block text-sm font-medium"
								>
									Birth Date
								</label>
								<DatePicker
									id="birthDate"
									date={date}
									setDate={setDate}
									startDate={startDate}
									endDate={endDate}
								/>
								{renderFieldError(validationErrors.birthDate)}
							</div>

							<Button
								type="submit"
								disabled={
									validationErrors && Object.keys(validationErrors).length > 0
								}
								className="w-full bg-blue-700 hover:bg-blue-600"
							>
								Save Changes
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default Profile;
