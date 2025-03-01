import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  TimePickerType,
  getArrowByType,
  getTimeByType,
  setTimeByType
} from './time-picker-utils';
import { Label } from './label';

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  time: string;
  setTime: (time: string) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className,
      type = 'tel',
      value,
      id,
      name,
      time = '00:00',
      setTime,
      onChange,
      onKeyDown,
      picker,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false);
    const [prevIntKey, setPrevIntKey] = React.useState<string>('0');

    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    const calculatedValue = React.useMemo(() => {
      return getTimeByType(time, picker);
    }, [time, picker]);

    const calculateNewValue = (key: string) => {
      if (picker === '12hours') {
        if (flag && calculatedValue.slice(1, 2) === '1' && prevIntKey === '0')
          return '0' + key;
      }

      return !flag ? '0' + key : calculatedValue.slice(1, 2) + key;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') return;
      e.preventDefault();
      if (e.key === 'ArrowRight') onRightFocus?.();
      if (e.key === 'ArrowLeft') onLeftFocus?.();
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        const step = e.key === 'ArrowUp' ? 1 : -1;
        const newValue = getArrowByType(calculatedValue, step, picker);
        if (flag) setFlag(false);
        setTime(setTimeByType(time, newValue, picker));
      }
      if (e.key >= '0' && e.key <= '9') {
        if (picker === '12hours') setPrevIntKey(e.key);

        const newValue = calculateNewValue(e.key);
        if (flag) onRightFocus?.();
        setFlag((prev) => !prev);
        setTime(setTimeByType(time, newValue, picker));
      }
    };

    return (
      <Input
        ref={ref}
        id={id || picker}
        name={name || picker}
        className={cn(
          'w-[62px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        value={value || calculatedValue}
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  }
);

TimePickerInput.displayName = 'TimePickerInput';

interface TimePickerDemoProps {
  time: string;
  setTime: (time: string) => void;
  name: string;
  disabled?: boolean;
}

const TimePicker = ({
  time,
  setTime,
  disabled = false,
  name
}: TimePickerDemoProps) => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor={name + 'hours'} className="text-xs">
          Horas
        </Label>
        <TimePickerInput
          id={name + 'hours'}
          picker="hours"
          time={time}
          setTime={setTime}
          ref={hourRef}
          disabled={disabled}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor={name + 'minutes'} className="text-xs">
          Minutos
        </Label>
        <TimePickerInput
          id={name + 'minutes'}
          picker="minutes"
          time={time}
          setTime={setTime}
          ref={minuteRef}
          disabled={disabled}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </div>
  );
};

TimePicker.DisplayName = 'TimePicker';

export { TimePickerInput, TimePicker };
