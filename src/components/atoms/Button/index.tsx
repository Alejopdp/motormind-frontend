import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { buttonVariants } from './buttonVariants';
import { useIsMobile } from '@/hooks/useIsMobile';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const isMobile = useIsMobile();

    const mobileSpecificClasses = isMobile && size === 'lg' ? 'text-[18px] font-medium h-12' : '';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), mobileSpecificClasses)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
