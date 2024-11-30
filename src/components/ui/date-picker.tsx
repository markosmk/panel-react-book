import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addMonths, format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { es } from 'date-fns/locale';
import { Icons } from '../icons';

export function DatePickerWithRange({
  className,
  field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: React.HTMLAttributes<HTMLDivElement> & { field: any }) {
  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            type="button"
            variant={'outline'}
            className={cn(
              'w-full justify-between text-left font-normal',
              !field.value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {field.value?.from ? (
              field.value.to ? (
                <>
                  <span className="hidden md:flex">
                    {format(field.value.from, "EEEE dd 'de' MMMM, yyyy", {
                      locale: es
                    })}{' '}
                    -{' '}
                    {format(field.value.to, "EEEE dd 'de' MMMM, yyyy", {
                      locale: es
                    })}
                  </span>
                  <span className="flex md:hidden">
                    {format(field.value.from, "dd 'de' LLL, y", {
                      locale: es
                    })}{' '}
                    - {format(field.value.to, "dd 'de' LLL, y", { locale: es })}
                  </span>
                </>
              ) : (
                <>
                  <span className="hidden md:flex">
                    {format(field.value.from, "EEEE dd 'de' MMMM, yyyy", {
                      locale: es
                    })}{' '}
                    - {'...'}
                  </span>
                  <span className="flex md:hidden">
                    {format(field.value.from, "dd 'de' LLL, y", {
                      locale: es
                    })}{' '}
                    - {'...'}
                  </span>
                </>
              )
            ) : (
              <span>Selecciona un Periodo</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={field.value?.from}
            selected={field.value}
            onSelect={field.onChange}
            numberOfMonths={2}
            fromDate={new Date()}
            toMonth={addMonths(new Date(), 3)}
            locale={es}
          />
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant={'outline'}
        onClick={() => field.onChange(undefined)}
      >
        <Icons.remove className="size-4" />
      </Button>
    </div>
  );
}
