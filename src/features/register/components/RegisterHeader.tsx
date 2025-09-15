import { motion } from 'framer-motion';

export const RegisterHeader = () => {
	return (
		<div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mt-5 text-2xl/9 font-bold tracking-tight text-gray-800"
			>
				Create Your Account
			</motion.h1>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mb-8 text-gray-500"
			>
				Create your account—your brand journey starts here.
			</motion.p>
		</div>
	);
};
