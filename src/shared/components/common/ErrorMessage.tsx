import { itemVariants } from '@/shared/animations';
import { motion } from 'framer-motion';

type Props = { title: string; reason?: string };

const ErrorMessage = ({ title, reason }: Props) => (
	<motion.div
		initial="hidden"
		animate="show"
		transition={{ duration: 0.4 }}
		className="col-span-full mx-auto w-full px-4 py-2"
		variants={itemVariants}
	>
		<h1 className="mt-8 text-center text-lg text-gray-700 italic">{title}</h1>
		{reason && (
			<p className="mt-4 text-center text-gray-400">Reason: {reason}</p>
		)}
		<img
			className="mx-auto w-full max-w-96"
			src="/assets/images/errors/NotFound2.svg"
			alt="data not found"
		/>
	</motion.div>
);

export default ErrorMessage;
