import { useEffect, useLayoutEffect, useRef } from 'react';

type UseDocumentTitleOptions = {
	preserveTitleOnUnmount?: boolean;
};

export function useDocumentTitle(
	title: string,
	options: UseDocumentTitleOptions = {}
): void {
	const { preserveTitleOnUnmount = true } = options;
	const defaultTitle = useRef<string | null>(null);

	useLayoutEffect(() => {
		defaultTitle.current = window.document.title;
	}, []);

	useLayoutEffect(() => {
		window.document.title = title;
	}, [title]);

	useEffect(() => {
		return () => {
			if (!preserveTitleOnUnmount && defaultTitle.current) {
				window.document.title = defaultTitle.current;
			}
		};
	}, [preserveTitleOnUnmount]);
}
