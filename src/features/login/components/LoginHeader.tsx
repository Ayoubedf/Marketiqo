import { motion } from 'framer-motion';

export const LoginHeader = () => {
	return (
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-800"
			>
				Sign In To Your Account
			</motion.h1>
		</div>
	);
};
