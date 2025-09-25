import { CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const ResetPasswordHeader = () => {
	return (
		<CardHeader>
			<CardTitle className="text-2xl">Password Change</CardTitle>
			<CardDescription>
				Enter your new password and confirm it to change your password.
			</CardDescription>
		</CardHeader>
	);
};

