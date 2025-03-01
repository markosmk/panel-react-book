import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { addMonths, formatISO } from 'date-fns';

import { HeadingMain } from '@/components/heading-main';
import { WrapperQueryTable } from '@/components/wrapper-query-table';
import { DateRangePicker } from '@/components/ui/date-range-picker';

import { HistoryTable } from './history-table';
import { useBookings } from '@/services/hooks/booking.query';

export default function BookingsHistoryPage() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: addMonths(new Date(), -2),
    to: new Date()
  });

  const { data, isLoading, isFetching, isError } = useBookings({
    dateFrom: range?.from
      ? formatISO(range.from, { representation: 'date' })
      : '',
    dateTo: range?.to ? formatISO(range.to, { representation: 'date' }) : ''
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Historial de Reservas"
        description="Seccion que contiene las reservas que han sido realizadas, con el estado de la misma"
      >
        <div className="flex gap-2 md:w-[260px] md:max-w-[260px]">
          <DateRangePicker
            disabled={isLoading || isFetching}
            initialDateFrom={range?.from}
            initialDateTo={range?.to}
            useOnlyDate={true}
            onUpdate={({ range }: { range: DateRange }) => {
              if (!range) return;
              if (!range?.from || !range?.to) return;
              setRange(range);
            }}
            textButton="Buscar"
          />
        </div>
      </HeadingMain>

      <WrapperQueryTable
        data={data?.results}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <HistoryTable data={data?.results || []} />
      </WrapperQueryTable>
    </div>
  );
}
