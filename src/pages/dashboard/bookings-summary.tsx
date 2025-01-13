import * as React from 'react';
import { useBookingSummary } from '@/services/hooks/booking.query';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn, formatDateOnly } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { es } from 'date-fns/locale';
import { DataTableSummary } from './summary/data-table-summary';
import { PendingContent } from '@/components/pending-content';
import { ErrorContent } from '@/components/error-content';

export function BookingSummarySection() {
  const [dateSelected, setDateSelected] = React.useState<Date | undefined>(
    new Date()
  );
  const { data, isLoading, isFetching, isError } = useBookingSummary(
    dateSelected?.toISOString().split('T')[0] || ''
  );

  return (
    <div>
      <div className="flex flex-col justify-between gap-x-2 gap-y-2 pb-4 md:flex-row md:gap-y-0">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Resumen Reservas:</h1>
          <p className="font-semibold capitalize italic text-muted-foreground">
            {dateSelected && formatDateOnly(dateSelected, 'PPPP')}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'min-w-10 max-w-[280px] justify-start text-left font-normal',
                !dateSelected && 'text-muted-foreground'
              )}
              disabled={isLoading || isFetching}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateSelected ? (
                format(dateSelected, 'PPP', { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateSelected}
              onSelect={setDateSelected}
              disabled={isLoading || isFetching}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {isLoading || isFetching ? (
        <PendingContent withOutText className="h-40" />
      ) : isError ? (
        <ErrorContent />
      ) : null}
      {!isLoading && !isError && !isFetching && data ? (
        <DataTableSummary data={data?.schedules || []} />
      ) : null}
    </div>
  );
}
