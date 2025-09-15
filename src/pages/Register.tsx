import { motion } from 'framer-motion';
import {
	RegisterHeader,
	Register as RegisterForm,
	Login,
} from '@/features/register';
import { Separator, ThirdParties } from '@/features/login';

const Register = () => {
	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<RegisterHeader />
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]"
				>
					<div className="border-slate-800 bg-white px-6 py-12 shadow shadow-gray-300 sm:rounded-lg sm:px-12 dark:border dark:bg-gray-900 dark:shadow-gray-800/50">
						<div className="sm:mx-auto sm:w-full sm:max-w-sm">
							<RegisterForm />
							<Separator />
							<ThirdParties />
						</div>
					</div>
				</motion.div>
				<Login />
			</div>
		</>
	);
};

export default Register;
