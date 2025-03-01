import * as React from 'react';

import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { BookingTable } from '@/types/booking.types';
import { FormChangeStatus } from './form-change-status';
import { toast } from '@/components/notifications';

export function FastEditingPopover({ booking }: { booking: BookingTable }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal={true}
      onOpenChange={(isOpen) => {
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
        <FormChangeStatus
          booking={booking}
          setIsOpen={setIsOpen}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      </PopoverContent>
    </Popover>
  );
}
