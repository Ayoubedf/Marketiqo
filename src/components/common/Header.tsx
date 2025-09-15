import { useState, useEffect, JSX, FormEvent, useContext, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@shadcn/dropdown-menu';
import { Button } from '@shadcn/button';
import { Input } from '@shadcn/input';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerClose,
	DrawerTitle,
	DrawerDescription,
} from '@shadcn/drawer';
import {
	SparklesIcon,
	ShirtIcon,
	BookOpenIcon,
	ArmchairIcon,
	CpuIcon,
	HomeIcon,
	MenuIcon,
	SearchIcon,
	ChevronDownIcon,
} from 'lucide-react';
import { APP_NAME, APP_ROUTES } from '@/config/constants';
import { Category } from '@/types';
import UserProfileMenu from './ProfileMenu';
import AppContext from '@/contexts/AppProvider';
import { useDebouncedResize } from '@/hooks/use-debounced-resize';

interface CategoryElement {
	icon: JSX.Element;
	label: Category;
}
interface NavItemsProps {
	isOpen: boolean;
}

const categories: CategoryElement[] = [
	{ icon: <SparklesIcon className="size-4" />, label: 'cosmetics' },
	{ icon: <CpuIcon className="size-4" />, label: 'electronics' },
	{ icon: <ShirtIcon className="size-4" />, label: 'apparels' },
	{ icon: <HomeIcon className="size-4" />, label: 'home appliances' },
	{ icon: <ArmchairIcon className="size-4" />, label: 'furnitures' },
	{ icon: <BookOpenIcon className="size-4" />, label: 'books' },
];

const NavItems = ({ isOpen }: NavItemsProps) => {
	const navigate = useNavigate();

	return (
		<ul className="mx-2 flex items-center space-x-4">
			<li>
				<NavLink
					to={APP_ROUTES.HOME}
					className={({ isActive }) =>
						`${isActive ? 'text-primary' : 'text-gray-700'}`
					}
					tabIndex={isOpen ? 0 : -1}
				>
					Home
				</NavLink>
			</li>
			<li>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="group bg-neutral-50 text-gray-700"
						>
							Categories
							<ChevronDownIcon
								className="-me-1 opacity-60 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-[180deg]"
								size={16}
								aria-hidden="true"
							/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{categories.map((category, index) => (
							<DropdownMenuItem
								onClick={() =>
									navigate(`/category/${category.label.replace(/\s+/g, '-')}`)
								}
								key={index}
								className="flex cursor-pointer items-center space-x-2"
							>
								{category.icon}
								<span className="capitalize">{category.label}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</li>
			<li>
				<NavLink
					to={APP_ROUTES.STORES}
					className={({ isActive }) =>
						`nav-item ${isActive ? 'text-primary' : 'text-gray-700'}`
					}
					tabIndex={isOpen ? 0 : -1}
				>
					Stores
				</NavLink>
			</li>
			<li>
				<NavLink
					to={APP_ROUTES.CART}
					className={({ isActive }) =>
						`nav-item ${isActive ? 'text-primary' : 'text-gray-700'}`
					}
					tabIndex={isOpen ? 0 : -1}
				>
					Cart
				</NavLink>
			</li>
		</ul>
	);
};

const Header = () => {
	const [isDrawerShown, setIsDrawerShown] = useState(false);
	const isNavShown = useDebouncedResize();
	const navigate = useNavigate();
	const location = useLocation();
	const { query, setQuery } = useContext(AppContext);
	const queryRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const match = location.pathname.match(/^\/collections\/([^/]+)$/);
		if (match) {
			const decoded = decodeURIComponent(match[1]);
			if (decoded !== query) {
				setQuery(decoded);
				if (queryRef.current) queryRef.current.value = decoded;
			}
		} else {
			setQuery('');
			if (queryRef.current) queryRef.current.value = '';
		}
	}, [location.pathname, query, setQuery]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				if (queryRef.current) queryRef.current.focus();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const query = formData.get('q')?.toString().trim().slice(0, 100) || '';
		const safeQuery = encodeURIComponent(query);
		navigate(`/collections/${safeQuery}`);
	};

	return (
		<>
			<header className="shadow-sm">
				<div className="container mx-auto">
					<div className="flex items-center justify-between py-2">
						<UserProfileMenu />
						<div className="relative mx-1 flex-1">
							<div className="pointer-events-none absolute inset-0 left-auto flex items-center justify-center px-3 text-gray-500">
								<SearchIcon className="size-5" />
							</div>
							<form onSubmit={handleSubmit}>
								<Input
									ref={queryRef}
									name="q"
									type="text"
									defaultValue={query}
									placeholder="Search products"
									className="rounded-3xl py-1.5"
								/>
							</form>
						</div>

						<div className="flex items-center dark:text-white">
							<Button
								variant="ghost"
								aria-label="open menu"
								className="mx-2 h-10 w-12 bg-gray-50 shadow-sm md:hidden"
								onClick={() => setIsDrawerShown(true)}
							>
								<MenuIcon className="size-6" />
							</Button>
						</div>
					</div>

					<nav className="hidden justify-between p-2 text-sm md:flex">
						<Link
							className="flex items-center justify-center text-gray-700"
							to={APP_ROUTES.HOME}
						>
							<span className="mr-3">
								<svg
									aria-label="Company Logo"
									role="img"
									width="32"
									height="32"
									viewBox="0 0 44 41"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M31.3516 9.55222C31.6379 9.55222 31.8574 9.61063 32.0095 9.72748C32.1616 9.83532 32.2692 9.97462 32.3319 10.1454C32.4034 10.3072 32.4437 10.4914 32.4527 10.6981C32.4706 10.9048 32.4797 11.1025 32.4797 11.2913V20.1887C32.4797 20.3145 32.4482 20.4269 32.3855 20.5257C32.3228 20.6156 32.2243 20.6605 32.0901 20.6605H30.9351C30.8008 20.6605 30.7024 20.6156 30.6397 20.5257C30.586 20.4269 30.5591 20.3145 30.5591 20.1887V12.0732H30.4919L28.1551 17.8161C28.0745 18.0228 27.9895 18.225 27.9 18.4227C27.8104 18.6114 27.6985 18.7822 27.5642 18.935C27.4299 19.0788 27.2643 19.1956 27.0673 19.2855C26.8703 19.3754 26.6197 19.4203 26.3152 19.4203C26.1004 19.4203 25.9079 19.4023 25.7377 19.3664C25.5676 19.3214 25.411 19.245 25.2677 19.1372C25.1245 19.0203 24.9857 18.8586 24.8514 18.6519C24.726 18.4362 24.5962 18.1576 24.4619 17.8161L22.1251 12.0732H22.0579V20.1887C22.0579 20.3145 22.0266 20.4269 21.9639 20.5257C21.9102 20.6156 21.8162 20.6605 21.6819 20.6605H20.5269C20.3926 20.6605 20.2942 20.6156 20.2315 20.5257C20.1688 20.4269 20.1375 20.3145 20.1375 20.1887V11.2913C20.1375 11.0756 20.1464 10.8644 20.1643 10.6577C20.1822 10.442 20.227 10.2532 20.2986 10.0915C20.3703 9.9297 20.4822 9.79937 20.6344 9.70051C20.7866 9.60166 21.0014 9.55222 21.279 9.55222H22.5146C22.7563 9.55222 22.9488 9.58369 23.0921 9.6466C23.2353 9.70051 23.3517 9.7859 23.4412 9.90273C23.5308 10.0106 23.6024 10.1454 23.6561 10.3072C23.7098 10.4599 23.777 10.6307 23.8576 10.8194L26.2481 16.8319H26.3958L28.8133 10.8194C28.8939 10.6307 28.9609 10.4599 29.0147 10.3072C29.0684 10.1454 29.1399 10.0106 29.2295 9.90273C29.3192 9.79487 29.431 9.70951 29.5652 9.6466C29.7085 9.58369 29.9011 9.55222 30.1429 9.55222H31.3516Z"
										fill="currentColor"
									/>
									<path
										d="M38.5879 14.9116C35.2803 20.1095 29.8707 23.6209 24.3222 25.0627C22.3708 25.5696 20.3466 25.8965 18.3408 25.7132C16.793 25.572 14.8796 25.1979 13.6423 24.0689C13.6423 24.0689 18.9901 31.5601 31.4085 28.0201C45.8874 23.8926 40.7285 9.93508 40.7071 9.87643C40.8114 10.1595 40.2763 12.2585 38.5879 14.9116Z"
										fill="url(#paint0_linear_79_255)"
									/>
									<path
										d="M18.6111 31.844C18.6111 33.2158 19.7184 34.3272 21.0846 34.3272C22.4507 34.3272 23.5581 33.2158 23.5581 31.844C23.5581 30.473 22.4507 29.3615 21.0846 29.3615C19.7184 29.3615 18.6111 30.473 18.6111 31.844Z"
										fill="url(#paint1_linear_79_255)"
									/>
									<path
										d="M29.9185 31.844C29.9185 33.2158 31.0254 34.3272 32.3915 34.3272C33.7576 34.3272 34.8653 33.2158 34.8653 31.844C34.8653 30.473 33.7576 29.3615 32.3915 29.3615C31.0254 29.3615 29.9185 30.473 29.9185 31.844Z"
										fill="url(#paint2_linear_79_255)"
									/>
									<path
										d="M8.36364 11.9438C9.55856 16.5391 9.81138 21.7299 16.5442 24.4261C23.2766 27.1223 27.8599 22.6406 27.8599 22.6406C27.8599 22.6406 22.8733 25.0274 18.6218 19.6515C14.1207 13.9602 15.8596 6.51127 2.88623 6C2.88623 6 7.09584 7.07208 8.36364 11.9438Z"
										fill="url(#paint3_linear_79_255)"
									/>
									<path
										d="M34.3339 15.3315C34.2659 15.9233 34.1453 16.5023 33.9446 17.0638C33.8048 17.4541 33.508 18.4005 33.1247 18.6145C34.8864 17.632 36.2295 16.0659 37.0172 14.2112C37.6895 12.6296 38.6338 9.97418 36.8074 8.84244C36.1479 8.43364 35.3623 8.29783 34.5983 8.17008C34.0949 8.08583 33.5916 8.00158 33.0887 7.91766C34.0136 10.2741 34.6288 12.786 34.3339 15.3315Z"
										fill="url(#paint4_linear_79_255)"
									/>
									<defs>
										<linearGradient
											id="paint0_linear_79_255"
											x1="39.2398"
											y1="5.80028"
											x2="15.2513"
											y2="28.7578"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#4AE090" />
											<stop offset="0.99959" stopColor="#4A9DE0" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint1_linear_79_255"
											x1="22.8741"
											y1="-12.345"
											x2="22.3777"
											y2="36.1787"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#4AE090" />
											<stop offset="0.99959" stopColor="#4A9DE0" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint2_linear_79_255"
											x1="22.9153"
											y1="-16.0803"
											x2="22.4185"
											y2="34.4799"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#4AE090" />
											<stop offset="0.99959" stopColor="#4A9DE0" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint3_linear_79_255"
											x1="36.5936"
											y1="36.474"
											x2="16.954"
											y2="15.6979"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#4AE090" />
											<stop offset="0.99959" stopColor="#4A9DE0" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint4_linear_79_255"
											x1="33.2135"
											y1="20.0147"
											x2="35.2825"
											y2="10.66"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="#4AE090" />
											<stop offset="0.99959" stopColor="#4A9DE0" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
									</defs>
								</svg>
							</span>
							<span className="text-base font-semibold whitespace-nowrap">
								{APP_NAME}
							</span>
						</Link>
						<NavItems isOpen={isNavShown} />
					</nav>
				</div>
			</header>

			<Drawer open={isDrawerShown} onOpenChange={setIsDrawerShown}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Navigation Menu</DrawerTitle>
						<DrawerDescription className="mb-1">
							Your gateway to the app's features.
						</DrawerDescription>
						<NavItems isOpen={true} />
					</DrawerHeader>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button>Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Header;

