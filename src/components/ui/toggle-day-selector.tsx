import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const daysOfWeek = [
  { value: 'Monday', label: 'L', name: 'Lunes' },
  { value: 'Tuesday', label: 'M', name: 'Martes' },
  { value: 'Wednesday', label: 'M', name: 'Miercoles' },
  { value: 'Thursday', label: 'J', name: 'Jueves' },
  { value: 'Friday', label: 'V', name: 'Viernes' },
  { value: 'Saturday', label: 'S', name: 'Sabado' },
  { value: 'Sunday', label: 'D', name: 'Domingo' }
];

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',

  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
        primary:
          'bg-transparent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90'
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11'
      }
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default'
    }
  }
);

interface ToogleDaySelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  selectedDays: string[];
  onChange: (days: string[]) => void;
}

const ToogleDaySelector = React.forwardRef<
  HTMLDivElement,
  ToogleDaySelectorProps
>(({ selectedDays, onChange, variant, size, className, ...props }, ref) => {
  const handleDayClick = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap items-center justify-start gap-y-1',
        className
      )}
      {...props}
    >
      {daysOfWeek.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleDayClick(value)}
          data-state={selectedDays.includes(value) ? 'on' : 'off'}
          className={cn(
            toggleVariants({ variant, size }),
            'flex-1 rounded-none first:rounded-l-md last:rounded-r-md'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
});

ToogleDaySelector.displayName = 'ToogleDaySelector';

export { ToogleDaySelector };
