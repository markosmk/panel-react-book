import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showSecure?: boolean;
  className?: string;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className: classParent,
      type = 'password',
      className,
      showSecure = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleMouseDown = () => {
      setShowPassword(true);
    };

    const handleMouseUp = () => {
      setShowPassword(false);
    };

    const handleMouseLeave = () => {
      setShowPassword(false);
    };

    return (
      <div className={cn('relative w-full', classParent)}>
        <Input
          type={showPassword && type === 'password' ? 'text' : type}
          className={cn('block', type !== 'password' && className)}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onMouseDown={showSecure ? handleMouseDown : undefined}
            onMouseUp={showSecure ? handleMouseUp : undefined}
            onMouseLeave={showSecure ? handleMouseLeave : undefined}
            onClick={!showSecure ? toggleShowPassword : undefined}
            className="absolute inset-y-0 right-0 my-1.5 mr-1.5 flex items-center rounded-md px-2.5 text-muted-foreground/50 hover:bg-background hover:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  }
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
