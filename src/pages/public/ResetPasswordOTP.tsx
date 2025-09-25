import { OTPCard } from '@/features/reset-otp';

export default function OTPReset() {
	return (
		<div className="col-span-full flex h-full w-full items-center justify-center py-38">
			<div className="w-full max-w-sm">
				<OTPCard />
			</div>
		</div>
	);
}
