import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border-2 border-border bg-input px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          // 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ',
          'focus:border-primary/70 focus:outline-none',
          'transition-colors duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
