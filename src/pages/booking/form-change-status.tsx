import * as React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useStatusBooking } from '@/services/hooks/booking.mutation';
import { BookingTable, Status } from '@/types/booking.types';

import { ButtonLoading } from '@/components/button-loading';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type FormChangeStatusProps = {
  booking: BookingTable;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

export function FormChangeStatus({
  booking,
  setIsOpen,
  setHasUnsavedChanges
}: FormChangeStatusProps) {
  const initialValues = React.useMemo(
    () => ({
      status: booking.status || 'PENDING',
      totalPrice: parseFloat(booking.totalPrice) || 0
    }),
    [booking]
  );
  const [formValues, setFormValues] = React.useState(initialValues);
  const { mutateAsync, isPending } = useStatusBooking();

  React.useEffect(() => {
    setFormValues({
      status: initialValues.status,
      totalPrice: initialValues.totalPrice
    });
  }, [initialValues]);

  // const hasUnsavedChanges = React.useMemo(() => {
  //   // compare form values with initial values
  //   return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  // }, [formValues, initialValues]);

  React.useEffect(() => {
    setHasUnsavedChanges(
      JSON.stringify(formValues) !== JSON.stringify(initialValues)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, initialValues]);

  const resetForm = () => {
    setTimeout(() => {
      setFormValues(initialValues);
    }, 150); // this is for animation purposes
  };

  const handleFastEdition = async () => {
    toast.dismiss();
    const totalPriceUpdated =
      formValues.totalPrice !== initialValues.totalPrice
        ? parseFloat(formValues.totalPrice.toFixed(2))
        : undefined;

    await mutateAsync(
      {
        id: booking.id,
        status: formValues.status,
        totalPrice: totalPriceUpdated
      },
      {
        onSuccess: () => {
          toast.success('Estado actualizado correctamente.');
          setTimeout(() => {
            setIsOpen(false);
          }, 100);
        }
      }
    );
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Edicion Rápida</h4>
        <p className="text-sm text-muted-foreground">
          Los cambios en el estado permiten organizar tus reservas, actualizarán
          además las estadísticas mensuales.
        </p>
      </div>
      <div
        className={cn(
          'grid gap-y-4 transition-opacity',
          isPending && 'pointer-events-none select-none opacity-50'
        )}
      >
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="status">Estado</Label>
          <Select
            defaultValue="pending"
            value={formValues.status}
            onValueChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                status: value as Status
              }))
            }
          >
            <SelectTrigger
              id="status"
              className="col-span-2 ml-auto h-10 w-full"
              defaultValue={'pending'}
            >
              <SelectValue placeholder="Cambiar Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Status.PENDING}>
                <span className="flex items-center">
                  <Icons.pending className="mr-2 size-4 text-yellow-600" />
                  Pendiente
                </span>
              </SelectItem>
              <SelectItem value={Status.CONFIRMED}>
                <span className="flex items-center">
                  <Icons.success className="mr-2 size-4 text-green-600" />
                  Confirmado
                </span>
              </SelectItem>
              <SelectItem value={Status.CANCELED}>
                <span className="flex items-center">
                  <Icons.canceled className="mr-2 size-4 text-red-600" />
                  Cancelado
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 items-start gap-4">
          <Label htmlFor="totalPrice" className="mt-2">
            Precio Total
          </Label>
          <div className="col-span-2">
            <Input
              id="totalPrice"
              type="number"
              value={formValues.totalPrice}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormValues((prev) => ({
                  ...prev,
                  totalPrice: isNaN(value) ? 0 : parseFloat(value.toFixed(2))
                }));
              }}
              className="h-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFastEdition();
                }
              }}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              No modifiques el precio a menos que sea absolutamente necesario.
              (El precio total fue calculado automáticamente)
            </p>
          </div>
        </div>
        {/* <p className="text-xs text-muted-foreground">
        Nota: Cualquier cambio aqui no afectará al precio del tour
        original que el cliente efectuo al momento de realizar la reserva
        , {formatPrice(Number(booking?.tour_price) || 0)}.
      </p> */}
      </div>
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <ButtonLoading
          variant="secondary"
          type="button"
          // disabled={!hasUnsavedChanges || isPending}
          isWorking={isPending}
          onClick={handleFastEdition}
        >
          Guardar Cambios
        </ButtonLoading>
      </div>
    </div>
  );
}
