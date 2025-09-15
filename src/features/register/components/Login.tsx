import { APP_ROUTES } from '@/config/constants';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Login = () => {
	return (
		<motion.p
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.6 }}
			className="mt-10 text-center text-sm/6 text-gray-500"
		>
			Already have an account?
			<Link
				to={APP_ROUTES.LOGIN}
				className="ms-1 font-semibold text-blue-600 hover:text-blue-500"
			>
				Sign in
			</Link>
		</motion.p>
	);
};
