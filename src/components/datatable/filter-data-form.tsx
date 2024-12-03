import { addMonths } from 'date-fns';
// import { XIcon } from "lucide-react"
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { ButtonLoading } from '@/components/button-loading';
// import { Button } from "@/components/ui/button"
// import { DatePickerRange } from "@/components/date-picker-range"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = {
  setRangeSubmit: (range?: { from: Date; to: Date }) => void;
  isPending?: boolean;
};

export function FilterDataForm({ setRangeSubmit, isPending }: Props) {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [submitted, setSubmitted] = React.useState(false);
  const [quickSelected, setQuickSelected] = React.useState<string>('');

  const handleSearchPeriod = async () => {
    if (!range?.from || !range?.to) return;
    setRangeSubmit({ from: range.from, to: range.to });
    setSubmitted(true);
  };

  // const handleReset = () => {
  //   setRange(undefined)
  //   setRangeSubmit(undefined)
  //   setSubmitted(false)
  // }

  React.useEffect(() => {
    setSubmitted(false);
  }, [quickSelected]);

  return (
    <div
      className={cn(
        'flex w-full space-x-2 sm:w-auto',
        isPending && 'pointer-events-none opacity-50'
      )}
    >
      <Select
        value={quickSelected}
        onValueChange={(value) => {
          setQuickSelected(value);
          setRange({
            from: addMonths(new Date(), -parseInt(value)),
            to: new Date()
          });
        }}
      >
        <SelectTrigger className="min-w-48 bg-card">
          <SelectValue placeholder="Seleccione Periodo" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="3">Hace 3 Meses</SelectItem>
          <SelectItem value="6">Hace 6 Meses</SelectItem>
          <SelectItem value="12">Hace 1 Año</SelectItem>
          <SelectItem value="24">Hace 2 Años</SelectItem>
          <SelectItem value="36">Hace 3 Años</SelectItem>
        </SelectContent>
      </Select>

      {/* {submitted && (
        <Button type="button" size="icon" className="min-w-11" onClick={handleReset} disabled={isPending}>
          <XIcon className="h-4 w-4" />
        </Button>
      )} */}

      <ButtonLoading
        type="button"
        disabled={!range?.from || !range?.to || submitted}
        isWorking={isPending}
        onClick={() => handleSearchPeriod()}
      >
        Buscar
      </ButtonLoading>
    </div>
  );
}
