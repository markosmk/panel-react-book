import * as React from 'react';
import { AxiosError } from 'axios';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { ButtonLoading } from '@/components/button-loading';
import { toast } from '@/components/notifications';

import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';

export const ConfirmModalProvider = () => {
  const { isOpen, dialogConfig, closeConfirm } = useConfirmStore();
  const [isProcessing, setProcessing] = React.useState(false);

  const handleConfirm = React.useCallback(async () => {
    if (!dialogConfig?.onConfirm) return;
    toast.dismiss();
    setProcessing(true);
    try {
      await dialogConfig.onConfirm();
      toast.success(
        dialogConfig?.messageSuccess || 'Solicitud confirmada con éxito.'
      );
      dialogConfig?.onSuccess && dialogConfig.onSuccess();
      setProcessing(false);
      setTimeout(() => {
        closeConfirm();
      }, 150);
    } catch (error) {
      setProcessing(false);

      dialogConfig?.onError && dialogConfig.onError(error as AxiosError);
      let message =
        dialogConfig?.messageError || 'Error al confirmar la solicitud.';
      if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.messages?.error) {
          message = data.messages.error;
        }
      }
      toast.error(message, { duration: 3000 });
    } finally {
      dialogConfig?.onSettled && dialogConfig?.onSettled();
    }
  }, [dialogConfig, closeConfirm]);

  const handleClose = React.useCallback(() => {
    toast.dismiss();
    dialogConfig?.onCancel && dialogConfig.onCancel();
    closeConfirm();
  }, [closeConfirm, dialogConfig]);

  if (!dialogConfig) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={closeConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dialogConfig?.title || '¿Estás seguro?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {dialogConfig?.description ||
              'Esta acción no puede deshacerse.\nEsto eliminará el/los dato/s seleccionado/s de esta pantalla.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing} onClick={handleClose}>
            Cancelar
          </AlertDialogCancel>
          <ButtonLoading isWorking={isProcessing} onClick={handleConfirm}>
            Confirmar
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
