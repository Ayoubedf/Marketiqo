import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type = 'text', ...props }, ref) => {
		return (
			<input
				ref={ref}
				type={type}
				data-slot="input"
				className={cn(
					'border-input file:text-foreground placeholder:text-muted-foreground my-2 flex w-full min-w-0 rounded-sm border bg-gray-50 bg-gradient-to-tl from-neutral-100 to-neutral-50 px-3 py-2 text-base text-gray-900 shadow-2xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm/6',
					'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-blue-500',
					'aria-invalid:ring-destructive/60 dark:aria-invalid:ring-destructive/40',
					className
				)}
				{...props}
			/>
		);
	}
);

Input.displayName = 'Input';

export { Input };
