import { useElementWidth } from '@/hooks/use-element-width';
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
  const { ref, width } = useElementWidth();
  return (
    <Button
      ref={ref}
      disabled={disabled || isWorking}
      style={{
        width: isWorking && width ? `${width}px` : 'auto',
        transition: 'width 0.2s ease-in-out'
      }}
      {...props}
    >
      {isWorking ? <Icons.spinner className="h-6 w-6" /> : children}
    </Button>
  );
}
