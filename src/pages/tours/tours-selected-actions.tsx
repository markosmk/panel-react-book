import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Tour } from '@/types/tour.types';
import { ModifyPeriodSchedule } from './_components/modify-period-schedule';
import { useModalStore } from '@/utils/modal/use-modal-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface Props {
  table: Table<Tour>;
}

export function ToursSelectedActions({ table }: Props) {
  const { openModal, closeModal } = useModalStore();
  const count = table.getFilteredSelectedRowModel().rows.length;

  const handleModify = () => {
    const selectedRows = table.getSelectedRowModel()?.flatRows || [];
    const selectedData = selectedRows.map((row) => row.original);
    if (selectedData.length === 0) return;
    openModal({
      title: 'Agregar o Modificar Horarios',
      content: (
        <ModifyPeriodSchedule
          tourId={selectedData.filter((item) => item.id).map((i) => i.id)}
          closeModal={closeModal}
          action="create"
        />
      )
    });
  };

  if (table.getFilteredSelectedRowModel().rows.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto truncate">
            <div className="flex truncate">
              <span className="mr-2 hidden sm:flex">Seleccionados</span>({count}
              )
            </div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={handleModify}>
            <Icons.calendar className="mr-2 h-4 w-4" />
            Modificar Horarios
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} disabled>
            <Icons.archive className="mr-2 h-4 w-4" />
            Archivar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} disabled>
            <Icons.remove className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
