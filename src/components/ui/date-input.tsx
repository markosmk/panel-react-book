import React, { useEffect, useRef } from 'react';
import { Input } from './input';

interface DateInputProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

interface DateParts {
  day: number | string;
  month: number | string;
  year: number | string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, disabled }) => {
  const [date, setDate] = React.useState<DateParts>(() => {
    const d = value ? new Date(value) : undefined;
    if (!d) {
      return { day: '', month: '', year: '' };
    }
    return {
      day: d.getDate(),
      month: d.getMonth() + 1, // JavaScript months are 0-indexed
      year: d.getFullYear()
    };
  });

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const d = value ? new Date(value) : undefined; //new Date();
    setDate({
      day: d ? d.getDate() : '',
      month: d ? d.getMonth() + 1 : '',
      year: d ? d.getFullYear() : ''
    });
  }, [value]);

  const validateDate = (field: keyof DateParts, value: number): boolean => {
    if (
      (field === 'day' && (value < 1 || value > 31)) ||
      (field === 'month' && (value < 1 || value > 12)) ||
      (field === 'year' && (value < 1000 || value > 9999))
    ) {
      return false;
    }

    let newDate: Partial<DateParts> = { ...date, [field]: value };

    if (field === 'day') {
      if (!date.month || !date.year) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        newDate = { ...newDate, month: currentMonth, year: currentYear };
      }
    }

    // Validate the day of the month
    // const newDate = { ...date, [field]: value };
    const d = new Date(
      Number(newDate.year),
      Number(newDate.month) - 1,
      Number(newDate.day)
    );
    return (
      d.getFullYear() === newDate.year &&
      d.getMonth() + 1 === newDate.month &&
      d.getDate() === newDate.day
    );
  };

  const handleInputChange =
    (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value ? Number(e.target.value) : '';
      const isValid =
        typeof newValue === 'number' && validateDate(field, newValue);

      let newDate: Partial<DateParts> = { ...date, [field]: newValue };

      if (field === 'day') {
        if (!date.month || !date.year) {
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          newDate = { ...newDate, month: currentMonth, year: currentYear };
        }
      }

      // If the new value is valid, update the date
      // const newDate = { ...date, [field]: newValue };
      setDate(newDate as DateParts);

      // only call onChange when the entry is valid
      if (isValid) {
        onChange(
          new Date(
            Number(newDate.year),
            Number(newDate.month) - 1,
            Number(newDate.day)
          )
        );
      }
    };

  const initialDate = useRef<DateParts>(date);

  const handleBlur =
    (field: keyof DateParts) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      if (!e.target.value) {
        setDate(initialDate.current);
        return;
      }

      const newValue = Number(e.target.value);
      const isValid = validateDate(field, newValue);

      if (!isValid) {
        setDate(initialDate.current);
      } else {
        // If the new value is valid, update the initial value
        initialDate.current = { ...date, [field]: newValue };
      }
    };

  const handleKeyDown =
    (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow command (or control) combinations
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      // Prevent non-numeric characters, excluding allowed keys
      if (
        !/^[0-9]$/.test(e.key) &&
        ![
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Delete',
          'Tab',
          'Backspace',
          'Enter'
        ].includes(e.key)
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        let newDate = { ...date };

        if (field === 'day') {
          if (!newDate.month || !newDate.year) {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            newDate = { ...newDate, month: currentMonth, year: currentYear };
          }

          if (
            date.year &&
            date.month &&
            date[field] ===
              new Date(Number(date.year), Number(date.month), 0).getDate()
          ) {
            newDate = {
              ...newDate,
              day: 1,
              month: (Number(date.month) % 12) + 1
            };
            if (Number(newDate.month) === 1)
              newDate.year = Number(newDate.year) + 1;
          } else {
            newDate.day = Number(newDate.day) + 1;
          }
        }

        if (field === 'month') {
          if (date[field] === 12) {
            newDate = { ...newDate, month: 1, year: Number(date.year) + 1 };
          } else {
            newDate.month = Number(newDate.month) + 1;
          }
        }

        if (field === 'year') {
          newDate.year = Number(newDate.year) + 1;
        }

        setDate(newDate);
        onChange(
          new Date(
            Number(newDate.year),
            Number(newDate.month) - 1,
            Number(newDate.day)
          )
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        let newDate = { ...date };

        if (field === 'day') {
          if (!newDate.month || !newDate.year) {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            newDate = { ...newDate, month: currentMonth, year: currentYear };
          }

          if (date[field] === 1) {
            newDate.month = Number(newDate.month) - 1;
            if (newDate.month === 0) {
              newDate.month = 12;
              newDate.year = Number(newDate.year) - 1;
            }
            newDate.day = new Date(
              Number(newDate.year),
              Number(newDate.month),
              0
            ).getDate();
          } else {
            newDate.day = Number(newDate.day) - 1;
          }
        }

        if (field === 'month') {
          if (date[field] === 1) {
            newDate = { ...newDate, month: 12, year: Number(date.year) - 1 };
          } else {
            newDate.month = Number(newDate.month) - 1;
          }
        }

        if (field === 'year') {
          newDate.year = Number(newDate.year) - 1;
        }

        setDate(newDate);
        onChange(
          new Date(
            Number(newDate.year),
            Number(newDate.month) - 1,
            Number(newDate.day)
          )
        );
      }

      if (e.key === 'ArrowRight') {
        if (
          e.currentTarget.selectionStart === e.currentTarget.value.length ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault();
          if (field === 'month') dayRef.current?.focus();
          if (field === 'day') yearRef.current?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        if (
          e.currentTarget.selectionStart === 0 ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          e.preventDefault();
          if (field === 'day') monthRef.current?.focus();
          if (field === 'year') dayRef.current?.focus();
        }
      }
    };

  return (
    <div className="flex max-w-[224px] items-center space-x-2 rounded-lg border p-1 text-sm">
      <Input
        type="text"
        ref={dayRef}
        max={31}
        maxLength={2}
        value={date.day?.toString()}
        onChange={handleInputChange('day')}
        onKeyDown={handleKeyDown('day')}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur('day')}
        className="w-12 p-0 text-center outline-none"
        placeholder="D"
        disabled={disabled}
      />
      <span className="-mx-px opacity-20">/</span>
      <Input
        type="text"
        ref={monthRef}
        max={12}
        maxLength={2}
        value={date.month?.toString()}
        onChange={handleInputChange('month')}
        onKeyDown={handleKeyDown('month')}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur('month')}
        className="w-12 p-0 text-center outline-none"
        placeholder="M"
        disabled={disabled}
      />
      <span className="-mx-px opacity-20">/</span>

      <Input
        type="text"
        ref={yearRef}
        max={9999}
        maxLength={4}
        value={date.year?.toString()}
        onChange={handleInputChange('year')}
        onKeyDown={handleKeyDown('year')}
        onFocus={(e) => {
          if (window.innerWidth > 1024) {
            e.target.select();
          }
        }}
        onBlur={handleBlur('year')}
        className="w-full min-w-16 p-0 text-center outline-none"
        placeholder="YYYY"
        disabled={disabled}
      />
    </div>
  );
};

DateInput.displayName = 'DateInput';

export { DateInput };
