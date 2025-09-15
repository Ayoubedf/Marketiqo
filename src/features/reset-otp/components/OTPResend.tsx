import { Button } from '@/components/ui/button';

interface OTPResendProps {
	handleResend: () => Promise<void>;
	isResending: boolean;
	isResent: boolean | null;
	cooldown: number;
}

export const OTPResend = ({
	handleResend,
	isResending,
	cooldown,
	isResent,
}: OTPResendProps) => {
	return (
		<div className="mt-4 text-sm text-slate-500" aria-live="polite">
			Didn&apos;t receive code?
			<Button
				variant="link"
				className="ml-1 !border-0 p-0 font-medium"
				onClick={handleResend}
				disabled={isResending || cooldown > 0}
			>
				{isResending
					? 'Resending...'
					: cooldown > 0
						? `Resend in ${cooldown}s`
						: 'Resend'}
			</Button>
			{isResent !== null && (
				<p
					className={`mt-2 text-sm ${isResent ? 'text-green-600' : 'text-red-600'}`}
				>
					{isResent
						? 'A new OTP has been sent to your email.'
						: 'Failed to resend OTP. Please try again.'}
				</p>
			)}
		</div>
	);
};
