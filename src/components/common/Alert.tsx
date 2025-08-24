import { CircleAlert, CircleCheckIcon } from 'lucide-react';

export const ErrorAlert = () => {
	return (
		<div className="absolute top-5 left-1/2 m-5 w-md min-w-fit -translate-x-1/2 rounded-md border bg-white px-4 py-3 shadow shadow-gray-200">
			<p className="text-sm">
				<CircleAlert
					className="me-3 -mt-0.5 inline-flex text-red-500"
					size={16}
					aria-hidden="true"
				/>
				An error occurred!
			</p>
		</div>
	);
};

export const SuccessAlert = () => {
	return (
		<div className="absolute top-5 left-1/2 m-5 w-md min-w-fit -translate-x-1/2 rounded-md border bg-white px-4 py-3 shadow shadow-gray-200">
			<p className="text-sm">
				<CircleCheckIcon
					className="me-3 -mt-0.5 inline-flex text-emerald-500"
					size={16}
					aria-hidden="true"
				/>
				Completed successfully!
			</p>
		</div>
	);
};
