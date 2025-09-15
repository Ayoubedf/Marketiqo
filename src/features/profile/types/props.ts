import { User, ValidationErrors } from '@/types';
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	RefObject,
	SetStateAction,
} from 'react';

export interface ProfileProps {
	refs: {
		emailRef: RefObject<HTMLInputElement | null>;
		fileInputRef: RefObject<HTMLInputElement | null>;
		nameRef: RefObject<HTMLInputElement | null>;
	};
	handleSubmit: (e: FormEvent) => Promise<void>;
	validate: () => void;
	validationErrors: ValidationErrors;
	previewUrl: string | null;
	user: User | null;
	handleThumbnailClick: () => void;
	fileName: string | null;
	handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handleRemove: () => void;
	date: Date | undefined;
	setDate: Dispatch<SetStateAction<Date | undefined>>;
	startDate: Date;
	endDate: Date;
}
