import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/config/constants';
import { motion } from 'framer-motion';

export const HeroBanner = () => {
	return (
		<section className="relative pt-24 pb-24 sm:pt-36 sm:pb-48 lg:pt-40 lg:pb-52">
			<div className="mx-auto max-w-screen-xl px-6 py-16 text-center lg:px-12 lg:py-20">
				{/* New badge */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Link
						to={APP_ROUTES.NEW}
						aria-label="See what's new in Marketiqo"
						className="mb-7 inline-flex items-center justify-between rounded-full bg-gradient-to-l from-gray-100 to-gray-200 px-1 py-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 hover:to-gray-100 dark:from-gray-700 dark:to-gray-800 dark:text-white dark:hover:to-gray-700"
					>
						<span className="mr-3 rounded-full bg-blue-600 px-4 py-1.5 text-xs text-white">
							New
						</span>
						<span className="text-sm font-medium">
							Marketiqo is out! See what&apos;s new
						</span>
						<ArrowRightIcon className="ml-2 h-5 w-5 opacity-70" />
					</Link>
				</motion.div>

				{/* Title */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
				>
					Unlock Your Business Potential with Marketiqo
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="mb-8 text-lg font-normal text-gray-500 italic sm:px-16 lg:text-xl xl:px-48 dark:text-gray-400"
				>
					Whether you&apos;re a startup owner or a savvy shopper, our platform
					brings high-quality products and seamless shopping experiences that
					drive growth and revenue. Join us to start building your brand today!
				</motion.p>

				{/* CTA Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:mb-16"
				>
					<Button className="h-auto bg-blue-700 hover:bg-blue-600" asChild>
						<Link className="group" to={APP_ROUTES.CREATE_STORE}>
							Get Started
							<ArrowRightIcon
								className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
								size={16}
								aria-hidden="true"
							/>
						</Link>
					</Button>
					<Button variant="outline" className="h-auto text-gray-700" asChild>
						<Link to={APP_ROUTES.COLLECTIONS}>
							<ShoppingCartIcon height={20} className="mr-3" />
							Shop Now
						</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
};
