import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileHeaderProps {
	title: string;
	desc: string;
}

export const ProfileHeader = ({ title, desc }: ProfileHeaderProps) => {
	return (
		<CardHeader>
			<CardTitle className="mb-2 text-2xl">{title}</CardTitle>
			<CardDescription className="mb-4">{desc}</CardDescription>
		</CardHeader>
	);
};
