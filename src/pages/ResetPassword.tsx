import { Card, CardContent } from '@/components/ui/card';
import {
	ResetPasswordHeader,
	ResetPassword as ResetPasswordForm,
} from '@/features/reset-password';

export default function ResetPassword() {
	return (
		<>
			<div className="col-span-full flex h-full w-full items-center justify-center py-38">
				<div className="w-full max-w-sm">
					<div className="flex flex-col gap-6">
						<Card>
							<ResetPasswordHeader />
							<CardContent>
								<ResetPasswordForm />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
