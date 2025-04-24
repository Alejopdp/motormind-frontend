import * as React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'placeholder:text-muted flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-base',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
