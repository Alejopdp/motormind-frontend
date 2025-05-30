import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs md:text-sm sm:font-medium font-small transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-gray-300 shadow-xs bg-white hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-transparent hover:text-primary',
        link: '!h-auto text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 sm:px-4 px-2 sm:py-2 py-1',
        sm: 'sm:h-8 h-7 rounded-md sm:px-3 px-2 text-xs',
        lg: 'h-9 lg:h-10 rounded-md px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
