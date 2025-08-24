import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }: React.ComponentProps<'textarea'>, ref) => {
	return (
		<textarea
			ref={ref}
			data-slot="textarea"
			className={cn(
				'border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 file:text-foreground$ my-2 flex field-sizing-content min-h-16 w-full min-w-0 rounded-sm border bg-gray-50 bg-gradient-to-tl from-neutral-100 to-neutral-50 px-3 py-2 text-base text-gray-900 shadow-2xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm/6',
				'aria-invalid:ring-destructive/60 dark:aria-invalid:ring-destructive/40',
				className
			)}
			{...props}
		/>
	);
});

Textarea.displayName = 'Textarea';

export { Textarea };
