import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'disable:pointer-events-none flex h-12 w-full rounded-md border-2 border-border bg-input px-4 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50',
          'focus:border-primary/70 focus:outline-none',
          'transition-colors duration-150',
          className
        )}
        ref={ref}
        data-lpignore="true"
        data-form-type="other"
        autoComplete="off"
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
