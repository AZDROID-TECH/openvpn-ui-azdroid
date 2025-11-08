import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Düymə stilləri üçün variantları təyin edirik (class-variance-authority istifadə edərək)
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-bold transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
        secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

// Düymənin qəbul edəcəyi propların tiplərini təyin edirik
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Gələcəkdə lazım olarsa, əlavə proplar üçün yer
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
