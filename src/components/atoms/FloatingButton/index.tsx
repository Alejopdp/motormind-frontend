import React from 'react';
import clsx from 'clsx';

// Tipos de tamaño
const sizeMap = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-16 h-16 text-xl',
  lg: 'w-20 h-20 text-2xl',
};

type Size = keyof typeof sizeMap;

interface FloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  size = 'md',
  className = '',
  children,
  onClick,
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'bg-primary hover:bg-primary-dark fixed right-6 bottom-6 z-50 flex items-center justify-center rounded-full text-white shadow-lg transition focus:outline-none active:scale-95',
      sizeMap[size],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default FloatingButton;
