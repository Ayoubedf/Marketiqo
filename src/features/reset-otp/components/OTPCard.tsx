import { APP_ROUTES } from '@/config/constants';
import { Navigate } from 'react-router-dom';
import { OTPReset } from './forms/OTPReset';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { OTPResend } from './OTPResend';
import { useResetOtp } from '../hooks/use-reset-otp';

export const OTPCard = () => {
	const {
		refs: { otpRef },
		email,
		handleSubmit,
		handleResend,
		isResending,
		isResent,
		cooldown,
	} = useResetOtp();

	if (!email) return <Navigate to={APP_ROUTES.HOME} replace />;

	return (
		<Card className="border-0">
			<CardHeader>
				<CardTitle className="text-2xl">Reset your password</CardTitle>
				<CardDescription>
					Enter the 4-digit verification code that was sent to your email.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<OTPReset otpRef={otpRef} handleSubmit={handleSubmit} />
			</CardContent>
			<CardFooter>
				<OTPResend
					handleResend={handleResend}
					isResending={isResending}
					isResent={isResent}
					cooldown={cooldown}
				/>
			</CardFooter>
		</Card>
	);
};
