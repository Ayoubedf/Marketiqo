// import { motion } from 'framer-motion';
// const errorVariants = {
// 	hidden: { opacity: 0 },
// 	visible: {
// 		opacity: 1,
// 		x: [0, -4, 4, -2, 2, 0],
// 		transition: { duration: 0.4 },
// 	},
// };

// export const renderFieldError = (error?: string) =>
// 	error && (
// 		<motion.p
// 			variants={errorVariants}
// 			initial="hidden"
// 			animate="visible"
// 			aria-live="assertive"
// 			className="mt-1 text-xs text-red-500"
// 		>
// 			{error}
// 		</motion.p>
// 	);
import { motion } from 'framer-motion';

const errorVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		x: [0, -4, 4, -2, 2, 0],
		transition: { duration: 0.4 },
	},
};

/**
 * Renders an accessible animated field error.
 * @param error - error message string
 * @param fieldId - id of the input field (used to generate error id)
 */
export const renderFieldError = (error?: string, fieldId?: string) =>
	error ? (
		<motion.p
			id={fieldId ? `${fieldId}-error` : undefined}
			role="alert"
			aria-live="assertive"
			variants={errorVariants}
			initial="hidden"
			animate="visible"
			className="mt-1 text-xs text-red-500"
		>
			{error}
		</motion.p>
	) : null;
