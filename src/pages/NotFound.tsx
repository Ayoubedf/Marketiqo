import { APP_NAME, APP_ROUTES } from '@/constants/app';
import { Button } from '@shadcn/button';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function NotFound() {
	const navigate = useNavigate();
	const title = `404 Error - Page Missing | ${APP_NAME}`;
	useDocumentTitle(title);

	return (
		<main className="grid h-svh min-h-full w-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
			<div className="text-center">
				{/* Animated 404 */}
				<motion.p
					className="text-7xl font-semibold text-blue-500"
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 120, damping: 15 }}
				>
					404
				</motion.p>

				{/* Animated heading */}
				<motion.h1
					className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					Page not found
				</motion.h1>

				{/* Animated description */}
				<motion.p
					className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					Sorry, we couldn’t find the page you’re looking for.
				</motion.p>

				{/* Animated buttons with stagger */}
				<motion.div
					className="mt-10 flex items-center justify-center gap-x-6"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: { staggerChildren: 0.15 },
						},
					}}
				>
					<motion.div
						variants={{
							hidden: { y: 20, opacity: 0 },
							visible: { y: 0, opacity: 1 },
						}}
					>
						<Button asChild>
							<Link to={APP_ROUTES.HOME}>
								<HomeIcon
									className="-ms-1 opacity-60"
									size={16}
									aria-hidden="true"
								/>
								Go back home
							</Link>
						</Button>
					</motion.div>
					<motion.div
						variants={{
							hidden: { y: 20, opacity: 0 },
							visible: { y: 0, opacity: 1 },
						}}
					>
						<Button
							variant="outline"
							className="group"
							onClick={() => navigate(-1)}
						>
							<ArrowLeftIcon
								className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
								size={16}
								aria-hidden="true"
							/>
							Go back
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</main>
	);
}
