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
import { useAuthService } from '@/hooks/useAuthService';

export default function OTPReset() {
	const email = userReset.get()?.email || '';
	const otpRef = useRef<HTMLInputElement>(null);
	const authService = useAuthService();
	const navigate = useNavigate();
	const [isResending, setIsResending] = useState<boolean>(false);
	const [resendMessage, setResendMessage] = useState<string>('');
	const [resendCount, setResendCount] = useState<number>(0);
	const [cooldown, setCooldown] = useState<number>(0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otp = otpRef.current?.value || '';
		await authService.verifyOTP({ email, otp });
		navigate(APP_ROUTES.PASS_CHANGE, { replace: true });
	};

	const handleResend = async () => {
		if (!email || cooldown > 0) return;
		setIsResending(true);
		setResendMessage('');

		try {
			await authService.resetPassword({ email });
			setResendMessage('A new OTP has been sent to your email.');
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
		} catch (error) {
			console.error('Failed to resend OTP:', error);
			setResendMessage('Failed to resend OTP. Please try again.');
		} finally {
			setIsResending(false);
		}
	};

	if (!email) return <Navigate to={APP_ROUTES.HOME} />;
	document.title = `Verify OTP | ${APP_NAME}`;
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
								{resendMessage && (
									<p className="mt-2 text-sm text-green-600">{resendMessage}</p>
								)}
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
