import { APP_NAME, APP_ROUTES } from '@/core/config/constants';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="border-t border-gray-200/20 bg-gray-50 dark:border-gray-600/20 dark:bg-gray-900">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0">
						<Link
							to={APP_ROUTES.HOME}
							className="flex items-center justify-center text-gray-700"
						>
							<span className="mr-3">
								<svg
									aria-label="Company Logo"
									role="img"
									viewBox="0 0 44 41"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									style={{ width: '100%', maxWidth: 32, height: 'auto' }}
								>
									<path
										d="M31.3516 9.55222C31.6379 9.55222 31.8574 9.61063 32.0095 9.72748C32.1616 9.83532 32.2692 9.97462 32.3319 10.1454C32.4034 10.3072 32.4437 10.4914 32.4527 10.6981C32.4706 10.9048 32.4797 11.1025 32.4797 11.2913V20.1887C32.4797 20.3145 32.4482 20.4269 32.3855 20.5257C32.3228 20.6156 32.2243 20.6605 32.0901 20.6605H30.9351C30.8008 20.6605 30.7024 20.6156 30.6397 20.5257C30.586 20.4269 30.5591 20.3145 30.5591 20.1887V12.0732H30.4919L28.1551 17.8161C28.0745 18.0228 27.9895 18.225 27.9 18.4227C27.8104 18.6114 27.6985 18.7822 27.5642 18.935C27.4299 19.0788 27.2643 19.1956 27.0673 19.2855C26.8703 19.3754 26.6197 19.4203 26.3152 19.4203C26.1004 19.4203 25.9079 19.4023 25.7377 19.3664C25.5676 19.3214 25.411 19.245 25.2677 19.1372C25.1245 19.0203 24.9857 18.8586 24.8514 18.6519C24.726 18.4362 24.5962 18.1576 24.4619 17.8161L22.1251 12.0732H22.0579V20.1887C22.0579 20.3145 22.0266 20.4269 21.9639 20.5257C21.9102 20.6156 21.8162 20.6605 21.6819 20.6605H20.5269C20.3926 20.6605 20.2942 20.6156 20.2315 20.5257C20.1688 20.4269 20.1375 20.3145 20.1375 20.1887V11.2913C20.1375 11.0756 20.1464 10.8644 20.1643 10.6577C20.1822 10.442 20.227 10.2532 20.2986 10.0915C20.3703 9.9297 20.4822 9.79937 20.6344 9.70051C20.7866 9.60166 21.0014 9.55222 21.279 9.55222H22.5146C22.7563 9.55222 22.9488 9.58369 23.0921 9.6466C23.2353 9.70051 23.3517 9.7859 23.4412 9.90273C23.5308 10.0106 23.6024 10.1454 23.6561 10.3072C23.7098 10.4599 23.777 10.6307 23.8576 10.8194L26.2481 16.8319H26.3958L28.8133 10.8194C28.8939 10.6307 28.9609 10.4599 29.0147 10.3072C29.0684 10.1454 29.1399 10.0106 29.2295 9.90273C29.3192 9.79487 29.431 9.70951 29.5652 9.6466C29.7085 9.58369 29.9011 9.55222 30.1429 9.55222H31.3516Z"
										fill="currentColor"
									/>
									<path
										d="M38.5879 14.9116C35.2803 20.1095 29.8707 23.6209 24.3222 25.0627C22.3708 25.5696 20.3466 25.8965 18.3408 25.7132C16.793 25.572 14.8796 25.1979 13.6423 24.0689C13.6423 24.0689 18.9901 31.5601 31.4085 28.0201C45.8874 23.8926 40.7285 9.93508 40.7071 9.87643C40.8114 10.1595 40.2763 12.2585 38.5879 14.9116Z"
										fill="url(#paint0)"
									/>
									<path
										d="M18.6111 31.844C18.6111 33.2158 19.7184 34.3272 21.0846 34.3272C22.4507 34.3272 23.5581 33.2158 23.5581 31.844C23.5581 30.473 22.4507 29.3615 21.0846 29.3615C19.7184 29.3615 18.6111 30.473 18.6111 31.844Z"
										fill="url(#paint1)"
									/>
									<path
										d="M29.9185 31.844C29.9185 33.2158 31.0254 34.3272 32.3915 34.3272C33.7576 34.3272 34.8653 33.2158 34.8653 31.844C34.8653 30.473 33.7576 29.3615 32.3915 29.3615C31.0254 29.3615 29.9185 30.473 29.9185 31.844Z"
										fill="url(#paint2)"
									/>
									<path
										d="M8.36364 11.9438C9.55856 16.5391 9.81138 21.7299 16.5442 24.4261C23.2766 27.1223 27.8599 22.6406 27.8599 22.6406C27.8599 22.6406 22.8733 25.0274 18.6218 19.6515C14.1207 13.9602 15.8596 6.51127 2.88623 6C2.88623 6 7.09584 7.07208 8.36364 11.9438Z"
										fill="url(#paint3)"
									/>
									<path
										d="M34.3339 15.3315C34.2659 15.9233 34.1453 16.5023 33.9446 17.0638C33.8048 17.4541 33.508 18.4005 33.1247 18.6145C34.8864 17.632 36.2295 16.0659 37.0172 14.2112C37.6895 12.6296 38.6338 9.97418 36.8074 8.84244C36.1479 8.43364 35.3623 8.29783 34.5983 8.17008C34.0949 8.08583 33.5916 8.00158 33.0887 7.91766C34.0136 10.2741 34.6288 12.786 34.3339 15.3315Z"
										fill="url(#paint4)"
									/>
									<defs>
										<linearGradient
											id="paint0"
											x1="100%"
											y1="0%"
											x2="0%"
											y2="100%"
											gradientUnits="objectBoundingBox"
										>
											<stop stopColor="#4AE090" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint1"
											x1="100%"
											y1="0%"
											x2="0%"
											y2="100%"
											gradientUnits="objectBoundingBox"
										>
											<stop stopColor="#4AE090" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint2"
											x1="100%"
											y1="0%"
											x2="0%"
											y2="100%"
											gradientUnits="objectBoundingBox"
										>
											<stop stopColor="#4AE090" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint3"
											x1="100%"
											y1="100%"
											x2="0%"
											y2="0%"
											gradientUnits="objectBoundingBox"
										>
											<stop stopColor="#4AE090" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
										<linearGradient
											id="paint4"
											x1="100%"
											y1="100%"
											x2="0%"
											y2="0%"
											gradientUnits="objectBoundingBox"
										>
											<stop stopColor="#4AE090" />
											<stop offset="1" stopColor="#4A9DE0" />
										</linearGradient>
									</defs>
								</svg>
							</span>
							<span className="text-base font-semibold whitespace-nowrap">
								{APP_NAME}
							</span>
						</Link>
					</div>
					<div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 sm:gap-6">
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Resources
							</h2>
							<ul className="font-medium text-gray-500 dark:text-gray-400">
								<li className="mb-4">
									<Link to={APP_ROUTES.HOME} className="hover:underline">
										{APP_NAME}
									</Link>
								</li>
								<li className="mb-4">
									<Link to={APP_ROUTES.CONTACT} className="hover:underline">
										Contact
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Follow us
							</h2>
							<ul className="font-medium text-gray-500 dark:text-gray-400">
								<li className="mb-4">
									<a href="https://github.com" className="hover:underline">
										Github
									</a>
								</li>
								<li>
									<a href="https://discord.gg" className="hover:underline">
										Discord
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
								Legal
							</h2>
							<ul className="font-medium text-gray-500 dark:text-gray-400">
								<li className="mb-4">
									<Link
										to={APP_ROUTES.PRIVACY_POLICY}
										className="hover:underline"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.TERMS_CONDITIONS}
										className="hover:underline"
									>
										Terms &amp; Conditions
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
						© 2025
						<Link to={APP_ROUTES.HOME} className="hover:underline">
							{APP_NAME}™
						</Link>
						. All Rights Not Reserved.
					</span>
					<div className="mt-4 flex sm:mt-0 sm:justify-center">
						<a
							href="https://web.facebook.com"
							className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 8 19"
							>
								<path
									fillRule="evenodd"
									d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="sr-only">Facebook page</span>
						</a>
						<a
							href="https://discord.com/"
							className="ms-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 21 16"
							>
								<path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
							</svg>
							<span className="sr-only">Discord community</span>
						</a>
						<a
							href="https://twitter.com"
							className="ms-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 17"
							>
								<path
									fillRule="evenodd"
									d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="sr-only">Twitter page</span>
						</a>
						<a
							href="https://github.com/"
							className="ms-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
						>
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="sr-only">GitHub account</span>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
