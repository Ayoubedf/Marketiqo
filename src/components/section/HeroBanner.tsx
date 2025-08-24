import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { APP_ROUTES } from '@/constants/app';

const HeroBanner = () => {
	return (
		<section className="pt-24 pb-24 sm:pt-36 sm:pb-48 lg:pt-28 lg:pb-42">
			<div className="mx-auto max-w-screen-xl px-6 py-16 text-center lg:px-12 lg:py-16">
				<Link
					to={APP_ROUTES.NEW}
					className="mb-7 inline-flex items-center justify-between rounded-full bg-gradient-to-l from-gray-100 to-gray-200 px-1 py-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 hover:to-gray-100 dark:from-gray-700 dark:to-gray-800 dark:text-white dark:hover:to-gray-700"
					role="alert"
				>
					<span className="mr-3 rounded-full bg-blue-600 px-4 py-1.5 text-xs text-white">
						New
					</span>
					<span className="text-sm font-medium">
						Marketiqo is out! See what&apos;s new
					</span>
					<svg
						className="ml-2 h-5 w-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clipRule="evenodd"
						></path>
					</svg>
				</Link>
				<h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
					Unlock Your Business Potential with Marketiqo
				</h1>
				<p className="mb-8 text-lg font-normal text-gray-500 italic sm:px-16 lg:text-xl xl:px-48 dark:text-gray-400">
					Whether you&apos;re a startup owner or a savvy shopper, our platform
					brings high-quality products and seamless shopping experiences that
					drive growth and revenue. Join us to start building your brand today!
				</p>
				<div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:mb-16">
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
					<Button variant={'outline'} className="h-auto text-gray-700" asChild>
						<Link to={APP_ROUTES.COLLECTIONS}>
							<ShoppingCartIcon height={20} className="mr-3" />
							Shop Now
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HeroBanner;
