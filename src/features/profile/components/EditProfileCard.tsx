import { Card, CardContent } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { ProfileHeader } from './profileHeader';
import { Profile } from './forms/profile';
import useProfile from '../hooks/use-profile';

const EditProfileCard = () => {
	const props = useProfile();

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="w-full max-w-md py-8"
		>
			<Card className="rounded-sm border-0 px-2 py-8">
				<ProfileHeader
					title="Edit Profile"
					desc="Edit your profile details to keep your information current and
				personalize your account."
				/>
				<CardContent>
					<Profile {...props} />
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default EditProfileCard;
