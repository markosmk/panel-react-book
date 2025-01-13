import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { cn, formatDateOnly, formatPrice } from '@/lib/utils';
import { useModal } from '@/hooks/use-modal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAdditionalDelete } from '@/services/hooks/additional.mutation';

import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/notifications';
import { Additional } from '@/types/app.types';
import { DialogConfirm } from '@/components/dialog-confirm';
import { AdditionalForm } from './additional-form';

function ItemInfo({
  label,
  value,
  className
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('col-span-1 space-y-1', className)}>
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function DetailModal({ detail }: { detail: Additional }) {
  return (
    <div className="relative flex flex-col gap-2">
      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información en Detalle
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-2 gap-2">
                <ItemInfo
                  label="Nombre"
                  value={detail.name}
                  className="col-span-2"
                />
                <ItemInfo
                  label="Descripcion"
                  value={detail.description}
                  className="col-span-2"
                />
                <ItemInfo
                  label="Precio"
                  value={formatPrice(Number(detail.price))}
                />
                <ItemInfo label="disponibilidad" value={detail.availability} />

                <ItemInfo label="Estado" value={detail.active} />
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function DataTableActions({ data }: { data: Additional }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModal();
  const { mutateAsync, isPending } = useAdditionalDelete();
  const [openDialogDelete, setOpenDialogDelete] = React.useState(false);

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles Item',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      component: <DetailModal detail={data} />
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Item',
      description: 'ultima actualizacion el ' + formatDateOnly(data.updated_at),
      component: <AdditionalForm data={data} closeModal={closeModal} />
    });
  };

  const handleDelete = async () => {
    await mutateAsync(data.id, {
      onSuccess: (data) => {
        const message = data?.data?.message;
        toast.success(message || 'Item eliminado correctamente.');
        setTimeout(() => {
          setOpenDialogDelete(false);
        }, 150);
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Item">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Editar">
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenEdit}
            title="Editar"
          >
            <Icons.edit className="h-4 w-4" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenDialogDelete(true)}
            title="Eliminar"
          >
            <Icons.remove className="h-4 w-4" />
          </Button>
        </TooltipHelper>
      </div>

      {isMobile && (
        <div className="inline-flex sm:hidden">
          <DropdownMenu>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.copy className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialogDelete(true)}>
                <Icons.remove className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <DialogConfirm
        title={`¿Seguro que quieres Eliminar?`}
        description={`Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" para eliminar el item.`}
        onConfirm={handleDelete}
        isOpen={openDialogDelete}
        onOpenChange={setOpenDialogDelete}
        isProcessing={isPending}
      />
    </>
  );
}
