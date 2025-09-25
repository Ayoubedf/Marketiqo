import { Button } from '@/shared/components/ui/button';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/shared/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { FormEvent, RefObject } from 'react';

interface OTPResetProps {
	otpRef: RefObject<HTMLInputElement | null>;
	handleSubmit: (e: FormEvent) => Promise<void>;
	isSubmitting: boolean;
}

export const OTPReset = ({
	otpRef,
	handleSubmit,
	isSubmitting,
}: OTPResetProps) => {
	return (
		<form id="otp-form" onSubmit={handleSubmit}>
			<div className="flex items-center justify-center gap-3">
				<div className="space-y-2">
					<InputOTP ref={otpRef} maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
						</InputOTPGroup>
					</InputOTP>
				</div>
			</div>
			<div className="mx-auto mt-4 max-w-[260px]">
				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Verifying...' : 'Next'}
				</Button>
			</div>
		</form>
	);
};
