import { ButtonLoading } from '@/components/button-loading';
import { Icons } from '@/components/icons';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { sleep } from '@/lib/utils';
import { BookingTable, Status } from '@/types/booking.types';
import * as React from 'react';
import { toast } from 'sonner';

export function FastEditingPopover({ booking }: { booking: BookingTable }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const initialValues = React.useMemo(
    () => ({
      status: booking.status || 'PENDING',
      totalPrice: booking.totalPrice || 0
    }),
    [booking]
  );
  const [formValues, setFormValues] = React.useState(initialValues);

  const hasUnsavedChanges = React.useMemo(() => {
    // compare form values with initial values
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  }, [formValues, initialValues]);

  const resetForm = () => {
    setTimeout(() => {
      setFormValues(initialValues);
    }, 150); // this is for animation purposes
  };

  const handleFastEdition = async () => {
    setIsLoading(true);
    await sleep(1000);
    toast.success('Reserva actualizada ' + booking.tour_name);
    resetForm();
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      modal={true}
      onOpenChange={(isOpen) => {
        // if (!isOpen && hasUnsavedChanges) {
        //   const confirmClose = window.confirm(
        //     'Tienes cambios sin guardar. ¿Deseas descartarlos?'
        //   );

        //   if (!confirmClose) {
        //     // this is when user clicks cancel
        //     setIsOpen(true); // mantain the popover open
        //     return;
        //   }

        //   // user confirms to close
        //   resetForm();
        // }

        // // use normal to close or open
        // setIsOpen(isOpen);

        if (!isOpen && hasUnsavedChanges) {
          toast.warning(
            'Tienes cambios sin guardar. Usa "Cancelar" o "Guardar Cambios".'
          );
          return;
        }

        // use normal to close or open
        setIsOpen(isOpen);
      }}
    >
      <TooltipHelper content="Cambiar Estado">
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.transform className="size-5" />
          </Button>
        </PopoverTrigger>
      </TooltipHelper>

      <PopoverContent
        className="w-80"
        align="end"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        // onInteractOutside={(event) => {
        //   if (!isOpen && hasUnsavedChanges) {
        //     // dont close popover
        //     event.preventDefault();
        //     // toast.warning(
        //     //   'Tienes cambios sin guardar. Usa "Cancelar" o "Guardar Cambios".'
        //     // );
        //   }
        // }}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edicion Rápida</h4>
            <p className="text-sm text-muted-foreground">
              Los cambios en el estado permiten organizar tus reservas,
              actualizarán además las estadísticas mensuales.
            </p>
          </div>
          <div className="grid gap-y-4">
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
                  className="col-span-2 ml-auto h-8 w-full"
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
                      <Icons.success className="mr-2 size-4 text-green-400" />
                      Confirmado
                    </span>
                  </SelectItem>
                  <SelectItem value={Status.CANCELED}>
                    <span className="flex items-center">
                      <Icons.canceled className="mr-2 size-4 text-red-400" />
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
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      totalPrice: parseFloat(e.target.value)
                    }))
                  }
                  className="h-8"
                />
                <p className="text-xs text-muted-foreground">
                  No modifiques el precio a menos que sea absolutamente
                  necesario. (El precio total fue calculado automáticamente)
                </p>
              </div>
            </div>
            {/* <p className="text-xs text-muted-foreground">
              Nota: Cualquier cambio aqui no afectará al precio del tour
              original que el cliente efectuo al momento de realizar la reserva
              , {formatPrice(Number(booking?.tour_price) || 0)}.
            </p> */}
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <ButtonLoading
                variant="outline"
                isWorking={isLoading}
                onClick={handleFastEdition}
              >
                Guardar Cambios
              </ButtonLoading>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
