import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Profile, ProfileHeader } from '@/features/profile';
import useProfile from '../hooks/use-complete-profile';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/constants';

const CompleteProfileCard = () => {
	const props = useProfile();

	if (!props.user) return <Navigate to={APP_ROUTES.HOME} replace />;

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="w-full max-w-md py-8"
		>
			<Card className="rounded-sm border-0 px-2 py-8">
				<ProfileHeader
					title="Complete Profile"
					desc="We need a little more info to finish setting up your account."
				/>
				<CardContent>
					<Profile {...props} />
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default CompleteProfileCard;
