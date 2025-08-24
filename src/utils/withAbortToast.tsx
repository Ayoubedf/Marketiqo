import { CanceledError, isCancel } from 'axios';
import { CircleAlertIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

type WithAbortToast = ({
	label,
	description,
	actionLabel,
	duration,
	onConfirm,
}: {
	label: string;
	description: string;
	actionLabel?: string;
	duration?: number;
	onConfirm: (controller: AbortController) => Promise<void>;
}) => Promise<void>;

export const withAbortToast: WithAbortToast = async ({
	label,
	description,
	actionLabel = 'Cancel',
	duration = 1000,
	onConfirm,
}): Promise<void> => {
	const controller = new AbortController();

	const toastId = toast.info(label, {
		description,
		duration: duration,
		action: {
			label: actionLabel,
			onClick: () => controller.abort(),
		},
		icon: <CircleAlertIcon className="size-5 text-blue-500" />,
	});

	try {
		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(resolve, duration);
			const abortHandler = () => {
				clearTimeout(timeout);
				controller.signal.removeEventListener('abort', abortHandler);
				reject(new CanceledError());
			};

			controller.signal.addEventListener('abort', abortHandler);
		});
		toast.dismiss(toastId);

		await onConfirm(controller);
	} catch (err) {
		if (isCancel(err)) {
			toast.info(`${label} Canceled`, {
				description: `The ${label.toLowerCase()} has been aborted.`,
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
		} else {
			toast.error(`${label} Failed`, {
				description: `There was a problem with ${label.toLowerCase()}.`,
				icon: <XCircleIcon className="size-5 text-red-500" />,
			});
			console.error(`${label} failed`, err);
		}
	}
};
