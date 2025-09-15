import { motion } from 'framer-motion';

export const StoresListHeader = () => {
	return (
		<div className="mb-12 text-center">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-2 text-4xl font-extrabold"
			>
				Discover Stores
			</motion.h1>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mx-auto max-w-xl text-gray-500"
			>
				Explore unique brands and businesses built on Marketiqo. Click any store
				to browse their products and learn more.
			</motion.p>
		</div>
	);
};
