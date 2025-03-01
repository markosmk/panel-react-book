import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import {
  addDays,
  addMonths,
  Day,
  endOfMonth,
  endOfWeek,
  endOfYear,
  Locale,
  startOfMonth,
  startOfWeek,
  startOfYear
} from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { DateInput } from './date-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './select';

import { cn } from '@/lib/utils';

const PresetButton = ({
  onClick,
  label,
  isSelected
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}): JSX.Element => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn(
      'justify-start hover:bg-primary/90 hover:text-primary-foreground',
      isSelected &&
        'pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
    )}
  >
    {label}
  </Button>
);

function getDateAdjustedForTimezone(dateInput: Date | string): Date {
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-').map((part) => parseInt(part, 10));
    return new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    return dateInput;
  }
}

function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function formatWithTz(date: Date, fmt: string, locale: Locale) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatInTimeZone(date, timeZone, fmt, { locale });
}

const PAST_PRESETS: Preset[] = [
  { name: 'currentWeek', label: 'semana actual' },
  { name: 'oneWeekAgo', label: 'hace 1 Semana' },
  { name: 'twoWeeksAgo', label: 'hace 2 semanas' },
  { name: 'oneMonthAgo', label: 'hace 1 mes' },
  { name: 'threeMonthsAgo', label: 'hace 3 meses' },
  { name: 'thisYear', label: 'este año' },
  { name: 'oneYearAgo', label: 'hace 1 año' },
  { name: 'threeYearsAgo', label: 'hace 3 años' }
];

const FUTURE_PRESETS: Preset[] = [
  { name: 'today', label: 'Hoy' },
  { name: 'restOfWeek', label: 'Resto de Semana' },
  { name: 'nextWeek', label: 'Proxima Semana' },
  { name: 'restOfMonth', label: 'Resto del Mes' },
  { name: 'nextMonth', label: 'Proximo Mes' },
  { name: 'restOfYear', label: 'Resto del Año' },
  { name: 'tempWinter', label: 'Temp. Invierno' },
  { name: 'tempSummer', label: 'Temp. Verano' }
];

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate: (values: { range: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Alignment of popover */
  align?: 'start' | 'center' | 'end';
  /** Work only with date not time, times will set to 12:00:00 to avoid timezone issues  */
  useOnlyDate?: boolean;
  /** Option for locale */
  locale?: Locale;
  /** Option for force disabled button popover */
  disabled?: boolean;
  /** for display custom text in button */
  textButton?: string;
  /** Allow preset to past or future options */
  direction?: 'past' | 'future';
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  initialDateFrom, //= new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  align = 'end',
  useOnlyDate = true,
  disabled,
  textButton = 'Aplicar',
  locale = es,
  direction = 'past'
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  useEffect(() => {
    setRange({
      from: initialDateFrom
        ? getDateAdjustedForTimezone(initialDateFrom)
        : undefined,
      to: initialDateTo
        ? getDateAdjustedForTimezone(initialDateTo)
        : initialDateFrom
          ? getDateAdjustedForTimezone(initialDateFrom)
          : undefined
    });
  }, [initialDateFrom, initialDateTo]);

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined
  );
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 960 : false
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getPresetRange = useCallback(
    (presetName: string): DateRange => {
      const preset = (
        direction === 'past' ? PAST_PRESETS : FUTURE_PRESETS
      ).find(({ name }) => name === presetName);
      if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);

      const today = new Date();
      const numberDay = today.getDay() as Day;
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;

      const winterStart = new Date(currentYear, 5, 21); // June 21st
      const winterEnd = new Date(currentYear, 8, 21); // September 21st
      const isAfterWinter = today > winterEnd;

      const summerStart = new Date(currentYear, 11, 21); // December 21st
      const summerEnd = new Date(nextYear, 2, 21); // March 21st

      const dateRanges =
        direction === 'past'
          ? [
              {
                name: 'currentWeek',
                start: startOfWeek(today, { weekStartsOn: 1 }),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              },
              {
                name: 'oneWeekAgo',
                start: addDays(today, -7),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              },
              {
                name: 'twoWeeksAgo',
                start: addDays(today, -14),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              },
              {
                name: 'oneMonthAgo',
                start: addMonths(today, -1),
                end: startOfWeek(today, { weekStartsOn: numberDay as Day })
              },
              {
                name: 'threeMonthsAgo',
                start: addMonths(today, -3),
                end: startOfWeek(today, { weekStartsOn: numberDay as Day })
              },
              {
                name: 'thisYear',
                start: startOfYear(today),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              },
              {
                name: 'oneYearAgo',
                start: addMonths(today, -12),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              },
              {
                name: 'threeYearsAgo',
                start: addMonths(today, -36),
                end: startOfWeek(today, { weekStartsOn: numberDay })
              }
            ]
          : [
              {
                name: 'today',
                start: today,
                end: today
              },
              {
                name: 'restOfWeek',
                start: startOfWeek(today, { weekStartsOn: numberDay as Day }),
                end: endOfWeek(today, { weekStartsOn: 1 })
              },
              {
                name: 'nextWeek',
                start: startOfWeek(addDays(today, 7), { weekStartsOn: 1 }),
                end: endOfWeek(addDays(today, 7), { weekStartsOn: 1 })
              },
              {
                name: 'restOfMonth',
                start: startOfWeek(today, { weekStartsOn: numberDay as Day }),
                end: endOfMonth(today)
              },
              {
                name: 'nextMonth',
                start: startOfMonth(addMonths(today, 1)),
                end: endOfMonth(addMonths(today, 1))
              },
              {
                name: 'restOfYear',
                start: startOfWeek(today, { weekStartsOn: numberDay as Day }),
                end: endOfYear(today)
              },
              {
                name: 'tempWinter',
                start: isAfterWinter ? new Date(nextYear, 5, 21) : winterStart,
                end: isAfterWinter ? new Date(nextYear, 8, 21) : winterEnd
              },
              {
                name: 'tempSummer',
                start: summerStart,
                end: summerEnd
              }
            ];

      const presetSelected = dateRanges.find(
        (item) => item.name === preset.name
      );
      if (!presetSelected)
        throw new Error(`Unknown date range preset: ${presetName}`);

      // Si onlyDate es true, formatea las fechas como solo fecha (sin horas)
      const formattedStart = useOnlyDate
        ? normalizeDate(presetSelected.start)
        : presetSelected.start;
      const formattedEnd = useOnlyDate
        ? normalizeDate(presetSelected.end)
        : presetSelected.end;

      return { from: formattedStart, to: formattedEnd };
    },
    [direction, useOnlyDate]
  );

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
  };

  const checkPreset = useCallback((): void => {
    if (!range.from || !range.to) {
      setSelectedPreset(undefined);
      return;
    }

    for (const preset of direction === 'past' ? PAST_PRESETS : FUTURE_PRESETS) {
      const presetRange = getPresetRange(preset.name);
      if (
        range.from.getTime() === presetRange.from?.getTime() &&
        range.to.getTime() === presetRange.to?.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  }, [range, direction, getPresetRange]);

  useEffect(() => {
    checkPreset();
  }, [range, direction, checkPreset]);

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === 'string'
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom
    });
  };

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    if (!a.from || !b.from) return false;
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
          className={cn(
            'w-full data-[state=open]:bg-muted',
            !range.from && !range.to && 'truncate text-muted-foreground'
          )}
        >
          <div className="w-full truncate text-right">
            {range?.from ? (
              <span className="truncate">
                <span className={`hidden md:flex`}>
                  {range.to
                    ? `${formatWithTz(range.from, "dd 'de' MMM, yyyy", locale)} - ${formatWithTz(range.to, "dd 'de' MMM, yyyy", locale)}`
                    : `${formatWithTz(range.from, "EEEE dd 'de' MMM, yyyy", locale)} - ...`}
                </span>
                <span className="flex truncate md:hidden">
                  {range.to
                    ? `${formatWithTz(range.from, 'dd LLL, y', locale)} - ${formatWithTz(range.to, 'dd LLL, y', locale)}`
                    : `${formatWithTz(range.from, 'dd LLL, y', locale)} - ...`}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Selecciona un Periodo
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto overflow-auto lg:p-4">
        <div className="flex">
          <div className="flex flex-col gap-y-4">
            <div className="hidden flex-col items-center justify-end gap-1 lg:flex lg:flex-row lg:items-start">
              <DateInput
                value={range.from}
                onChange={(date) => {
                  const toDate =
                    range.to == null || date > range.to ? date : range.to;
                  setRange((prevRange) => ({
                    ...prevRange,
                    from: date ? normalizeDate(date) : undefined,
                    to: toDate ? normalizeDate(toDate) : undefined
                    // from: date,
                    // to: toDate
                  }));
                }}
              />
              <div className="hidden py-4 text-muted-foreground lg:flex">-</div>
              <DateInput
                value={range.to}
                disabled={!range.from}
                onChange={(date) => {
                  if (!range.from) return;
                  const fromDate = date < range.from ? date : range.from;
                  setRange((prevRange) => ({
                    ...prevRange,

                    from: fromDate ? normalizeDate(fromDate) : undefined,
                    to: date ? normalizeDate(date) : undefined
                    // from: fromDate,
                    // to: date
                  }));
                }}
              />
            </div>
            {isSmallScreen && (
              <Select
                defaultValue={selectedPreset}
                onValueChange={(value) => {
                  setPreset(value);
                }}
              >
                <SelectTrigger className="mx-auto min-w-[180px] max-w-full">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {(direction === 'past' ? PAST_PRESETS : FUTURE_PRESETS).map(
                    (preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
            <div>
              <Calendar
                mode="range"
                onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                  if (value?.from != null) {
                    setRange({
                      from: normalizeDate(value.from),
                      to: value?.to ? normalizeDate(value?.to) : undefined
                    });
                  } else {
                    setRange({
                      from: undefined,
                      to: undefined
                    });
                  }
                }}
                selected={range}
                fromMonth={
                  direction === 'future'
                    ? normalizeDate(addMonths(new Date(), -1))
                    : undefined
                }
                toDate={
                  direction === 'past' ? normalizeDate(new Date()) : undefined
                }
                numberOfMonths={isSmallScreen ? 1 : 2}
                locale={locale}
                weekStartsOn={1}
                defaultMonth={
                  direction === 'past'
                    ? normalizeDate(addMonths(new Date(), -1))
                    : undefined
                }
              />
            </div>
          </div>

          {!isSmallScreen && (
            <div className="ml-4 flex w-36 flex-col items-end gap-1 overflow-hidden">
              <Button
                type="button"
                className="my-1 w-full"
                disabled={!range.from || !range.to}
                onClick={() => {
                  setIsOpen(false);
                  if (!areRangesEqual(range, openedRangeRef.current)) {
                    onUpdate({ range });
                  }
                }}
              >
                {textButton}
              </Button>
              <div className="mb-2 flex w-full items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className=""
                  onClick={() => {
                    setIsOpen(false);
                    resetValues();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className=""
                  onClick={() => {
                    setRange({
                      from: undefined,
                      to: undefined
                    });
                    onUpdate({ range: { from: undefined, to: undefined } });
                  }}
                >
                  Limpiar
                </Button>
              </div>

              {(direction === 'past' ? PAST_PRESETS : FUTURE_PRESETS).map(
                (preset) => (
                  <PresetButton
                    key={preset.name}
                    label={preset.label}
                    onClick={() => setPreset(preset.name)}
                    isSelected={selectedPreset === preset.name}
                  />
                )
              )}
            </div>
          )}
        </div>
        {isSmallScreen && (
          <div className="mt-2 grid grid-cols-1 gap-2 lg:flex lg:justify-end">
            <div className="order-2 flex justify-between gap-x-2 lg:order-1">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  resetValues();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setRange({
                    from: undefined,
                    to: undefined
                  });
                  onUpdate({ range: { from: undefined, to: undefined } });
                }}
              >
                Limpiar
              </Button>
            </div>
            <Button
              type="button"
              className="order-1 min-w-36 lg:order-2"
              onClick={() => {
                setIsOpen(false);
                if (!areRangesEqual(range, openedRangeRef.current)) {
                  onUpdate({ range });
                }
              }}
            >
              {textButton}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = 'DateRangePicker';
