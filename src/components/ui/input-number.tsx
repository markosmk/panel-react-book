import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

import { cn } from '@/lib/utils';

export interface InputNumberProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  type?: 'number' | 'text';
  height?: 'sm' | 'md' | 'lg';
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      defaultValue,
      min = -Infinity,
      max = Infinity,
      value: controlledValue,
      onChange,
      className,
      type = 'number',
      height = 'md',
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState<number | undefined>(
      controlledValue ?? defaultValue
    );

    const handleIncrement = React.useCallback(() => {
      setValue((prev) => (prev === undefined ? 1 : Math.min(prev + 1, max)));
    }, [max]);

    const handleDecrement = React.useCallback(() => {
      setValue((prev) => (prev === undefined ? -1 : Math.max(prev - 1, min)));
    }, [min]);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement ===
          (ref as React.RefObject<HTMLInputElement>)?.current
        ) {
          if (e.key === 'ArrowUp') {
            handleIncrement();
          } else if (e.key === 'ArrowDown') {
            handleDecrement();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleIncrement, handleDecrement, ref]);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    React.useEffect(() => {
      if (onChange) {
        onChange({
          target: {
            value: value
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (values: {
      value: string;
      floatValue: number | undefined;
    }) => {
      const newValue =
        values.floatValue === undefined ? undefined : values.floatValue;
      setValue(newValue);
      // here onChange
    };

    const handleBlur = () => {
      if (value !== undefined) {
        if (value < min) {
          setValue(min);
          //   ref && ref.current?.value = String(min);
          //   (ref as React.RefObject<HTMLInputElement>)?.current.value =
          //     String(min);
        } else if (value > max) {
          setValue(max);
          //   (ref as React.RefObject<HTMLInputElement>)?.current.value =
          //     String(max);
        }
      }
    };

    return (
      <div className="flex items-center">
        <Input
          type={type}
          className={cn(
            'relative rounded-r-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            className,
            height === 'sm' && 'h-10',
            height === 'md' && 'h-12',
            height === 'lg' && 'h-16'
          )}
          ref={ref}
          value={value}
          onChange={(e) => {
            handleChange({
              value: e.target.value,
              floatValue: Number(e.target.value)
            });
          }}
          onBlur={handleBlur}
          onFocus={(e) => e.target.select()}
          max={max}
          {...props}
        />

        <div className="flex flex-col">
          <Button
            type="button"
            aria-label="Increase value"
            className={cn(
              'rounded-l-none rounded-br-none border-2 border-b-[0.5px] border-l-0 border-border px-2 focus-visible:relative',
              height === 'sm' && 'h-5',
              height === 'md' && 'h-6',
              height === 'lg' && 'h-8'
            )}
            variant="outline"
            onClick={handleIncrement}
            disabled={value === max}
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            type="button"
            aria-label="Decrease value"
            className={cn(
              'rounded-l-none rounded-tr-none border-2 border-l-0 border-t-[0.5px] border-border px-2 focus-visible:relative',
              height === 'sm' && 'h-5',
              height === 'md' && 'h-6',
              height === 'lg' && 'h-8'
            )}
            variant="outline"
            onClick={handleDecrement}
            disabled={value === min}
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      </div>
    );
  }
);

InputNumber.displayName = 'InputNumber';

export { InputNumber };
