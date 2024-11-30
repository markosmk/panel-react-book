import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { ButtonLoading } from './button-loading';

type Props = {
  /** for add trigger, for example Button without onClick */
  children?: React.ReactNode;
  /** to control open dialog, so not need add children */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** gral */
  title?: string;
  description: string;
  onConfirm: () => void;
  isProcessing?: boolean;
  textConfirm?: string;
};

export function DialogConfirm({
  title = '¿Estás absolutamente seguro?',
  description,
  onConfirm,
  children,
  isProcessing = false,
  isOpen,
  onOpenChange,
  textConfirm = 'Si, Continuar'
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <AlertDialog
      open={isOpen ?? openDialog}
      onOpenChange={onOpenChange ?? setOpenDialog}
    >
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={
              onOpenChange
                ? () => onOpenChange(false)
                : () => setOpenDialog(false)
            }
            disabled={isProcessing}
          >
            Cancelar
          </AlertDialogCancel>
          <ButtonLoading
            onClick={onConfirm}
            disabled={isProcessing}
            isWorking={isProcessing}
            className="min-w-28"
          >
            {textConfirm}
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
