import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-md border border-white/10 bg-black/20 px-4 py-2 text-base text-gray-100 ring-offset-gray-900
                    file:border-0 file:bg-transparent file:text-sm file:font-medium 
                    placeholder:text-gray-500 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
