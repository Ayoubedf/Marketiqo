import { toast } from 'sonner';
import { CheckCircle2Icon, XCircleIcon, InfoIcon } from 'lucide-react';
import { JSX } from 'react';

type ToastOptions = {
	description?: string;
	duration?: number;
	icon?: JSX.Element;
	requiresInternet?: boolean;
};

const defaultDuration = 3000;

const createToast = (type: 'success' | 'error' | 'info') => {
	return (title: string, options: ToastOptions = {}) => {
		const { requiresInternet = true, ...toastOptions } = options;
		let icon: JSX.Element;

		switch (type) {
			case 'success':
				icon = toastOptions.icon ?? (
					<CheckCircle2Icon className="size-5 text-green-500" />
				);
				break;
			case 'error':
				icon = toastOptions.icon ?? (
					<XCircleIcon className="size-5 text-red-500" />
				);
				if (requiresInternet && !navigator.onLine) {
					title = 'No internet connection';
					toastOptions.description =
						'Please check your connection and try again.';
				}
				break;
			case 'info':
			default:
				icon = toastOptions.icon ?? (
					<InfoIcon className="size-5 text-blue-500" />
				);
		}

		toast[type](title, {
			...toastOptions,
			duration: toastOptions.duration ?? defaultDuration,
			icon,
		});
	};
};

export const notify = {
	success: createToast('success'),
	error: createToast('error'),
	info: createToast('info'),
};
