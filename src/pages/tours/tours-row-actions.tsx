import * as React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontalIcon } from 'lucide-react';

import { Tour } from '@/types/tour.types';
import { useDeleteTour } from '@/services/hooks/tour.mutation';

import { TooltipHelper } from '@/components/tooltip-helper';
import { FastEditingPopover } from './fast-editing-popover';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DialogConfirm } from '@/components/dialog-confirm';
import { toast } from '@/components/notifications';

export function ToursRowActions({ data: tour }: { data: Tour }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { mutateAsync, isPending } = useDeleteTour();

  const handleDelete = async () => {
    await mutateAsync(
      { id: tour.id },
      {
        onSuccess: (data) => {
          const message = data?.data?.message;
          toast.success(message || 'Tour eliminado correctamente.');
          setTimeout(() => {
            setOpenDialog(false);
          }, 200);
        }
      }
    );
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Editar Tour">
          <Link
            to={`/tours/${tour.id}`}
            title="Ver Tour"
            className={buttonVariants({
              variant: 'outline',
              size: 'icon'
            })}
          >
            <Icons.edit className="size-5" />
          </Link>
        </TooltipHelper>

        <FastEditingPopover data={tour} />

        <TooltipHelper content="Gestionar Horarios">
          <Link
            to={`/tours/${tour.id}/schedules`}
            title="ver Horarios"
            className={buttonVariants({
              variant: 'outline',
              size: 'icon'
            })}
          >
            <Icons.calendar className="size-5" />
          </Link>
        </TooltipHelper>

        <TooltipHelper content="Eliminar Tour">
          <Button
            variant="outline"
            size="icon"
            title="Eliminar"
            onClick={() => setOpenDialog(true)}
          >
            <Icons.remove className="size-5" />
          </Button>
        </TooltipHelper>
      </div>
      <div className="inline-flex sm:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 data-[state=open]:bg-background"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/tours/${tour.id}`}>
                <Icons.edit className="mr-2 h-4 w-4" />
                Editar Tour
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/tours/${tour.id}/schedules`}>
                <Icons.calendar className="mr-2 h-4 w-4" />
                Gestionar Horarios
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDialog(true)}>
              <Icons.remove className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DialogConfirm
        title={`¿Seguro que quieres Eliminar el Tour: ${tour.name}?`}
        description={`Esta acción no se puede deshacer. Se eliminara el tour de forma permanente. Si el tour tiene horarios asociados, estos se perderan.\nHaz click en "Si, Continuar" para eliminar el tour.`}
        onConfirm={handleDelete}
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        isProcessing={isPending}
      />
    </>
  );
}
