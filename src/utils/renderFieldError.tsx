import { motion } from 'framer-motion';
const errorVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		x: [0, -4, 4, -2, 2, 0],
		transition: { duration: 0.4 },
	},
};

export const renderFieldError = (error?: string) =>
	error && (
		<motion.p
			variants={errorVariants}
			initial="hidden"
			animate="visible"
			aria-live="assertive"
			className="mt-1 text-xs text-red-500"
		>
			{error}
		</motion.p>
	);
