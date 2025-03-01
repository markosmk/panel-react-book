import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Icons } from '@/components/icons';
import { toast } from '../notifications';

interface PopConfirmProps {
  isError?: boolean;
  isPending?: boolean;
  children: React.ReactNode;
  confirmationText: string | React.ReactNode;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
}

export function PopConfirm({
  // isError = false,
  isPending = false,
  children,
  confirmationText,
  onConfirm,
  onCancel
}: PopConfirmProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      //   setIsOpen(false);
    } catch (error) {
      console.error('Error during confirmation:', error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(prev) => {
        if (isLoading || isPending) {
          toast.warning('Acción en progreso, por favor espere.');
          return;
        }
        setIsOpen(prev);
      }}
      modal
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2.5" side="top">
        <div className="grid gap-2">
          <p className="text-left text-sm">{confirmationText}</p>
          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading || isPending}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={isLoading}>
              {(isLoading || isPending) && (
                <Icons.spinner className="mr-2 h-4 w-4" />
              )}
              {isLoading || isPending ? 'Cargando' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
