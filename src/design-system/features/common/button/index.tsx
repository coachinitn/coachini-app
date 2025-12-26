import React, { forwardRef } from 'react';
import { cn } from '@/core/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
      outline: 'bg-transparent border border-blue-700 text-blue-700 hover:bg-blue-50',
      text: 'bg-transparent text-blue-700 hover:bg-blue-50',
    };

    const sizeStyles = {
      sm: 'py-1.5 px-3 text-sm',
      md: 'py-2.5 px-5 text-base',
      lg: 'py-3 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-md font-medium transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 