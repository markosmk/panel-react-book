import * as React from 'react';
import { toast } from 'sonner';

import { ButtonLoading } from '@/components/button-loading';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { useEditingTour } from '@/services/hooks/tour.mutation';
import { Tour } from '@/types/tour.types';
import { Switch } from '@/components/ui/switch';

export function FastEditingPopover({ data }: { data: Tour }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const initialValues = React.useMemo(
    () => ({
      price: parseFloat(data.price) || 0,
      duration: data.duration || 0,
      capacity: data.capacity || 0,
      active: data.active === '1' ? true : false
    }),
    [data]
  );
  const [formValues, setFormValues] = React.useState(initialValues);

  React.useEffect(() => {
    setFormValues({
      price: initialValues.price,
      duration: initialValues.duration,
      capacity: initialValues.capacity,
      active: initialValues.active
    });
  }, [initialValues]);

  const hasUnsavedChanges = React.useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  }, [formValues, initialValues]);

  const resetForm = () => {
    setTimeout(() => {
      setFormValues(initialValues);
    }, 150); // this is for animation purposes
  };

  const { mutate, isPending } = useEditingTour();

  const handleFastEdition = async () => {
    toast.dismiss();

    mutate(
      {
        id: data.id,
        price: parseFloat(formValues.price.toFixed(2)),
        duration: formValues.duration,
        capacity: formValues.capacity,
        active: formValues.active ? '1' : '0'
      },
      {
        onSuccess: () => {
          toast.success('Tour actualizado correctamente.');
          setTimeout(() => {
            setIsOpen(false);
          }, 100);
        }
      }
    );
  };

  const handleCancel = () => {
    toast.dismiss();
    resetForm();
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      modal={true}
      onOpenChange={(isOpen) => {
        if (!isOpen && hasUnsavedChanges) {
          toast.warning(
            'Tienes cambios sin guardar. Usa "Cancelar" o "Guardar Cambios".',
            {
              position: 'top-right'
            }
          );
          return;
        }

        // use normal to close or open
        setIsOpen(isOpen);
      }}
    >
      <TooltipHelper content="Edicion Rápida">
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.transform className="size-5" />
          </Button>
        </PopoverTrigger>
      </TooltipHelper>

      <PopoverContent
        className="w-72"
        align="end"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edicion Rápida</h4>
            <p className="text-sm text-muted-foreground">
              Al actualizar no se cambiarán los datos de las reservas ya
              realizadas, se aplicarán los cambios para las nuevas reservas.
            </p>
          </div>
          <div
            className={cn(
              'grid gap-y-4 transition-opacity',
              isPending && 'pointer-events-none select-none opacity-50'
            )}
          >
            <div className="grid grid-cols-3 items-start gap-4">
              <Label htmlFor="price" className="mt-2">
                Precio
              </Label>
              <div className="col-span-2 space-y-1">
                <Input
                  id="price"
                  type="number"
                  value={formValues.price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFormValues((prev) => ({
                      ...prev,
                      price: isNaN(value) ? 0 : parseFloat(value.toFixed(2))
                    }));
                  }}
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFastEdition();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Precio por persona
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="capacity">Capacidad</Label>
              <div className="col-span-2">
                <Input
                  id="capacity"
                  type="number"
                  value={formValues.capacity}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormValues((prev) => ({
                      ...prev,
                      capacity: isNaN(value) ? 0 : value
                    }));
                  }}
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFastEdition();
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="duration">Duration</Label>
              <div className="col-span-2">
                <Input
                  id="duration"
                  type="number"
                  value={formValues.duration}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormValues((prev) => ({
                      ...prev,
                      duration: isNaN(value) ? 0 : value
                    }));
                  }}
                  className="h-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFastEdition();
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="active">Activo</Label>

              <div className="col-span-2">
                <Switch
                  id="active"
                  checked={formValues.active}
                  onCheckedChange={(checked) => {
                    setFormValues((prev) => ({
                      ...prev,
                      active: checked
                    }));
                  }}
                />
              </div>
            </div>
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
              variant="outline"
              type="button"
              className="min-w-[148px]"
              isWorking={isPending}
              onClick={handleFastEdition}
            >
              Guardar Cambios
            </ButtonLoading>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
