/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ButtonLoading } from '@/components/button-loading';
import { PendingContent } from '@/components/pending-content';

interface ModalConfig {
  title?: string;
  description?: string;
  className?: string;
  onConfirm?: () => Promise<void>;
  content?: React.ReactNode;
  component?: React.ReactNode;
}

type ModalProps = Omit<ModalConfig, 'content'> & {
  fetchData?: (signal: AbortSignal) => Promise<React.ReactNode>;
};

type ModalContextType = {
  isOpen: boolean;
  openModal: (props: ModalProps) => void;
  closeModal: () => void;
};

const DefaultData = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {}
};

const ModalContext = React.createContext<ModalContextType>(DefaultData);

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<ModalConfig | null>(
    null
  );
  const [controller, setController] = React.useState<AbortController | null>(
    null
  );

  const openModal = async ({
    title,
    description,
    className,
    component,
    fetchData,
    onConfirm
  }: ModalProps) => {
    // if component is provided, use it
    if (component) {
      setModalConfig({ title, description, className, content: component });
      setIsOpen(true);
      return;
    }
    // cancel any pending requests
    if (controller) {
      controller.abort();
    }

    // create a new controller
    const newController = new AbortController();
    setController(newController);

    // configure the modal
    setModalConfig({ title, description, className, onConfirm });
    setIsOpen(true);

    if (fetchData) {
      setIsLoading(true);

      try {
        const data = await fetchData(newController.signal);
        setModalConfig((prev) => ({ ...prev, content: data }));
      } catch (error: unknown) {
        console.error('Error en la solicitud:', error);
        if (!newController.signal.aborted) {
          setModalConfig((prev) => ({
            ...prev,
            content: <p>Error al cargar los datos.</p>
          }));
        }
      } finally {
        // sure the request is not aborted
        if (!newController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
  };

  const closeModal = () => {
    if (controller) {
      controller.abort();
      setController(null);
    }
    setIsOpen(false);
    setTimeout(() => {
      setModalConfig(null);
      setIsLoading(false);
    }, 150); // by animation Dialog animate-in and animate-out
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ModalViewContent
        isOpen={isOpen}
        isLoading={isLoading}
        closeModal={closeModal}
        modalConfig={modalConfig}
      />
    </ModalContext.Provider>
  );
};

type ModalViewContentProps = {
  isOpen: boolean;
  closeModal: () => void;
  isLoading: boolean;
  modalConfig: ModalConfig | null;
};

const ModalViewContent: React.FC<ModalViewContentProps> = ({
  isOpen,
  closeModal,
  isLoading,
  modalConfig
}) => {
  const [isLoadingConfirm, setIsLoadingConfirm] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (modalConfig?.onConfirm) {
    return (
      <AlertDialog open={isOpen} onOpenChange={closeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalConfig?.title || '¿Estás seguro?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {modalConfig?.description ||
                'Esta acción no puede deshacerse. Esto eliminará el/los dato/s seleccionado/s de esta pantalla.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {error && <p className="mb-2 text-red-500">{error}</p>}
            <AlertDialogCancel disabled={isLoadingConfirm}>
              Cancelar
            </AlertDialogCancel>
            <ButtonLoading
              className="min-w-32"
              disabled={isLoadingConfirm}
              isWorking={isLoadingConfirm}
              onClick={async () => {
                if (modalConfig.onConfirm) {
                  setIsLoadingConfirm(true);
                  setError(null);
                  try {
                    await modalConfig.onConfirm();
                    closeModal();
                  } catch (err) {
                    setError(
                      'Ocurrió un error. Por favor, intenta nuevamente mas tarde.'
                    );
                    console.error('Error en confirmación:', err);
                  } finally {
                    setIsLoadingConfirm(false);
                  }
                }
              }}
            >
              Si, Confirmar
            </ButtonLoading>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent
          className={cn(
            'max-h-[98%] overflow-hidden px-0 lg:max-w-lg',
            modalConfig?.className
          )}
        >
          <DialogHeader>
            <DialogTitle className="font-helvetica text-2xl">
              {modalConfig?.title ?? ''}
            </DialogTitle>
            <DialogDescription>
              {modalConfig?.description ?? ''}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="scroller">
            {isLoading ? <PendingContent /> : modalConfig?.content || ''}
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  }
};
