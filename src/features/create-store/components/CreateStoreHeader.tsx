import { APP_NAME } from '@/core/config/constants';
import { motion } from 'framer-motion';

export const CreateStoreHeader = () => {
	return (
		<>
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-4 text-4xl font-extrabold"
			>
				Create Your Store with {APP_NAME}
			</motion.h1>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mb-8 text-gray-500"
			>
				Launch your own store, showcase your products, and grow your brand with
				ease.
			</motion.p>
		</>
	);
};
