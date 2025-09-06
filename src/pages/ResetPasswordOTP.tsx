import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/components/ui/button';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { APP_NAME, APP_ROUTES } from '@/constants/app';
import { userResetManager as userReset } from '@/lib/auth';
import { useAuthActions } from '@/contexts/authContexts';
import { isApiError } from '@/types';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function OTPReset() {
	const email = userReset.get()?.email || '';
	const otpRef = useRef<HTMLInputElement>(null);
	const authAction = useAuthActions();
	const navigate = useNavigate();
	const [isResending, setIsResending] = useState(false);
	const [isResent, setIsResent] = useState<boolean | null>(null);
	const [resendCount, setResendCount] = useState<number>(0);
	const [cooldown, setCooldown] = useState<number>(0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otp = otpRef.current?.value || '';
		const response = await authAction.verifyOTP({ email, otp });
		if (!isApiError(response)) {
			navigate(APP_ROUTES.PASS_CHANGE, { replace: true });
		}
	};

	const handleResend = async () => {
		if (!email || cooldown > 0) return;
		setIsResending(true);
		setIsResent(null);

		const response = await authAction.resetPassword({ email });
		if (isApiError(response)) setIsResent(false);
		else {
			setIsResent(true);
			setResendCount((prevCount) => prevCount + 1);

			if (resendCount >= 2) {
				setCooldown(60);
				const interval = setInterval(() => {
					setCooldown((prevCooldown) => {
						if (prevCooldown <= 1) {
							clearInterval(interval);
							return 0;
						}
						return prevCooldown - 1;
					});
				}, 1000);
			}
		}

		setIsResending(false);
	};

	const title = `Verify OTP | ${APP_NAME}`;
	useDocumentTitle(title);

	if (!email) return <Navigate to={APP_ROUTES.HOME} />;

	return (
		<>
			<div className="col-span-full flex h-full w-full items-center justify-center py-38">
				<div className="w-full max-w-sm">
					<Card className="border-0">
						<CardHeader>
							<CardTitle className="text-2xl">Reset your password</CardTitle>
							<CardDescription>
								Enter the 4-digit verification code that was sent to your email.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form id="otp-form" onSubmit={handleSubmit}>
								<div className="flex items-center justify-center gap-3">
									<div className="space-y-2">
										<InputOTP
											ref={otpRef}
											maxLength={4}
											pattern={REGEXP_ONLY_DIGITS}
										>
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
									<Button type="submit" className="w-full">
										Next
									</Button>
								</div>
							</form>
						</CardContent>
						<CardFooter>
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
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
