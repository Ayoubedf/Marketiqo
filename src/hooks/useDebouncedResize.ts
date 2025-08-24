import { useEffect, useState } from 'react';

export function useDebouncedResize(delay = 200) {
	const [isNavShown, setIsNavShown] = useState(false);

	useEffect(() => {
		let isMounted = true;
		let timeout: ReturnType<typeof setTimeout>;
		let rafId: number;

		const checkNavVisibility = () => {
			clearTimeout(timeout);
			rafId = requestAnimationFrame(() => {
				timeout = setTimeout(() => {
					if (isMounted) {
						setIsNavShown(window.innerWidth >= 768);
					}
				}, delay);
			});
		};

		checkNavVisibility();
		window.addEventListener('resize', checkNavVisibility);

		return () => {
			isMounted = false;
			clearTimeout(timeout);
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', checkNavVisibility);
		};
	}, [delay]);

	return isNavShown;
}
