import { Icons } from './icons';
import { Button, ButtonProps } from './ui/button';

type ButtonLoadingProps = ButtonProps & {
  isWorking?: boolean;
};

export function ButtonLoading({
  disabled,
  children,
  isWorking = false,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button disabled={disabled || isWorking} {...props}>
      {isWorking ? <Icons.spinner className="h-6 w-6" /> : children}
    </Button>
  );
}
