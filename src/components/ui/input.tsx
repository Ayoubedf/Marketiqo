import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				// selection:bg-primary selection:text-primary-foreground
				'border-input file:text-foreground placeholder:text-muted-foreground flex w-full min-w-0 rounded-sm border bg-gray-50 bg-gradient-to-tl from-neutral-100 to-neutral-50 my-2 px-3 py-2 text-gray-900 text-base shadow-2xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm/6',
				// aria-invalid:border-destructive
				'focus-visible:ring-blue-500 focus-visible:border-transparent focus-visible:ring-2',
				'aria-invalid:ring-destructive/60 dark:aria-invalid:ring-destructive/40',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
