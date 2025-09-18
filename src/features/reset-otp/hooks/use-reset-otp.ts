import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { useAuthActions } from '@/features/auth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { isApiError } from '@/types';
import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useResetOtp = () => {
	const location = useLocation();
	const email = location.state.email || '';
	const otpRef = useRef<HTMLInputElement>(null);
	const authAction = useAuthActions();
	const navigate = useNavigate();
	const [isResending, setIsResending] = useState(false);
	const [isResent, setIsResent] = useState<boolean | null>(null);
	const [resendCount, setResendCount] = useState(0);
	const [cooldown, setCooldown] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const otp = otpRef.current?.value || '';

		setIsSubmitting(true);
		const response = await authAction.verifyOTP({ email, otp });
		setIsSubmitting(false);

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

	const title = useMemo(() => `Verify OTP | ${APP_NAME}`, []);
	useDocumentTitle(title);

	return {
		refs: { otpRef },
		email,
		isResending,
		isResent,
		resendCount,
		cooldown,
		handleSubmit,
		handleResend,
		isSubmitting,
	};
};
