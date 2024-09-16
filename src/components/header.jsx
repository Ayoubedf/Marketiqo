import PropTypes from 'prop-types';
import { useState, useEffect, useRef, memo } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Logo from './icons';

const DropDownMenuItem = ({ menuItem }) => (
	<a
		href='#'
		role='menuitem'
		tabIndex={0}
		className='block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-500 active:bg-slate-200y'>
		{menuItem}
	</a>
);
DropDownMenuItem.propTypes = {
	menuItem: PropTypes.string.isRequired,
};

const MenuButton = ({ title, isOpen, toggleMenu }) => (
	<button
		type='button'
		className='inline-flex justify-between py-2 md:px-0 px-3 text-slate-700 dark:text-slate-50 md:w-auto w-full'
		aria-expanded={isOpen}
		aria-haspopup='true'
		onClick={toggleMenu}>
		{title}
		<svg
			className='-mr-1 h-5 w-5 text-slate-400'
			viewBox='0 0 20 20'
			fill='currentColor'>
			<path d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' />
		</svg>
	</button>
);
MenuButton.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	toggleMenu: PropTypes.func.isRequired,
};

const DropDown = ({ menuItems = [], title }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleMenu = () => setIsOpen(!isOpen);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='relative inline-block text-left w-full' ref={dropdownRef}>
			<div className='text-white w-full'>
				<MenuButton title={title} isOpen={isOpen} toggleMenu={toggleMenu} />
			</div>

			<div
				className={clsx(
					'transform absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white text-slate-700 dark:bg-slate-800 dark:text-white shadow-lg dark:ring-1 ring-black ring-opacity-20',
					{
						'ease-in duration-150 opacity-100 scale-100': isOpen,
						'ease-out duration-300 opacity-0 scale-75 pointer-events-none': !isOpen,
					},
				)}
				role='menu'
				aria-orientation='vertical'>
				<div className='py-1'>
					{menuItems.map((menuItem, key) => (
						<DropDownMenuItem key={key} menuItem={menuItem} />
					))}
				</div>
			</div>
		</div>
	);
};
DropDown.propTypes = {
	menuItems: PropTypes.arrayOf(PropTypes.string),
	title: PropTypes.string.isRequired,
};

const NavItems = () => {
	return (
		<>
			<li>
				<a
					href='#'
					className='block px-3 py-2 md:px-0 text-blue-700 dark:text-blue-500'
					aria-current='true'>
					Home
				</a>
			</li>
			<li>
				<DropDown
					title='Categories'
					menuItems={[
						'Cosmetics',
						'Electronics',
						'Apparel',
						'Home Appliances',
						'Furniture',
						'Books',
					]}
				/>
			</li>
			<li>
				<a
					href='#'
					className='text-slate-700 hover:text-blue-700 dark:hover:text-blue-500 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-transparent block px-3 py-2 md:px-0'
					aria-current='false'>
					Collections
				</a>
			</li>
			<li>
				<a
					href='#'
					className='text-slate-700 hover:text-blue-700 dark:hover:text-blue-500 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-transparent block px-3 py-2 md:px-0'
					aria-current='false'>
					Cart
				</a>
			</li>
		</>
	);
};

const Drawer = ({ isOpen, setIsOpen }) => {
	const drawerRef = useRef(null);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (drawerRef.current && !drawerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [setIsOpen]);

	return (
		<>
			<div
				ref={drawerRef}
				id='navbar-drawer'
				className={clsx(
					'md:hidden fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform bg-white w-80 max-w-[100%] dark:bg-slate-800 shadow',
					{ '-translate-x-full': !isOpen },
				)}
				tabIndex='-1'
				aria-labelledby='drawer-label'>
				<div className='drawer-header flex items-center justify-between p-4 border-b dark:border-slate-700 border-slate-100'>
					<a href='#' id='drawer-label' className='flex'>
						<Logo width={32} height={32} className='mr-3 dark:text-slate-100' />
						<span className='self-center text-lg font-semibold whitespace-nowrap dark:text-slate-50'>
							Marketiqo
						</span>
					</a>
					<button
						type='button'
						aria-controls='navbar-drawer'
						className='md:hidden text-slate-400 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center p-2'
						onClick={() => setIsOpen(false)}>
						<XMarkIcon className='w-6 h-6' />
						<span className='sr-only'>Close menu</span>
					</button>
				</div>
				<div className='drawer-content p-4'>
					<ul className='flex flex-col'>
						<NavItems />
					</ul>
				</div>
			</div>
			{isOpen && (
				<div className='md:hidden absolute inset-0 backdrop-opacity-25 backdrop-brightness-0 backdrop-blur-md'></div>
			)}
		</>
	);
};
Drawer.propTypes = {
	isOpen: PropTypes.bool,
	setIsOpen: PropTypes.func,
};

const Header = () => {
	const [show, setShow] = useState(false);

	return (
		<>
			<header className='shadow-sm border-bottom border-1 dark:bg-slate-800'>
				<div className='container mx-auto'>
					<div className='flex flex-wrap pt-2'>
						<a href='.' className='d-flex align-items-center text-decoration-none'>
							<span
								role='button'
								aria-label='Account'
								className='material-symbols-rounded text-4xl p-2 text-slate-600 dark:text-slate-200'>
								account_circle
							</span>
						</a>
						<div className='relative flex-1 mx-1'>
							<div className='absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none'>
								<svg
									className='w-5 h-5 text-slate-500'
									fill='currentColor'
									viewBox='0 0 20 20'
									xmlns='http://www.w3.org/2000/svg'>
									<path d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'></path>
								</svg>
							</div>
							<input
								type='text'
								className='my-2 p-2 pl-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 dark:border-slate-700 bg-gradient-to-b border sm:text-sm focus:ring-blue-500 w-full shadow-sm rounded-3xl'
								placeholder='Search product'
								aria-label='Search products'
							/>
						</div>
					</div>
					<nav className='flex flex-wrap items-center justify-between border-slate-200 px-2 py-2'>
						<a href='#' className='flex'>
							<Logo width={40} height={40} className='mr-3 dark:text-slate-100' />
							<span className='self-center text-lg font-semibold whitespace-nowrap dark:text-slate-50'>
								Marketiqo
							</span>
						</a>
						<div className='flex -order-1 md:order-none'>
							<button
								onClick={() => setShow(true)}
								type='button'
								className='md:hidden text-slate-400 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center p-2'
								aria-controls='navbar-drawer'>
								<span className='sr-only'>Open main menu</span>
								<Bars3Icon className='w-6 h-6' />
							</button>
						</div>
						<div className='hidden md:flex justify-between items-center w-full md:w-auto md:order-1'>
							<ul className='flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium'>
								<NavItems />
							</ul>
						</div>
					</nav>
				</div>
			</header>
			<Drawer isOpen={show} setIsOpen={setShow} />
		</>
	);
};

export default memo(Header);
