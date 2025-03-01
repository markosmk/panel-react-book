import { PendingContent } from '@/components/pending-content';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/utils/modal/use-modal-store';

export const ModalProvider = () => {
  const { isOpen, modalConfig, closeModal, isLoading } = useModalStore();

  if (!modalConfig) return null;

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
            {modalConfig.title}
          </DialogTitle>
          <DialogDescription>{modalConfig.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="scroller">
          {isLoading ? (
            <PendingContent withOutText sizeIcon="sm" />
          ) : (
            modalConfig?.content || ''
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
