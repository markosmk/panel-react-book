import { AxiosError } from 'axios';
import { create } from 'zustand';

type ConfirmDialogConfig = {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (error: Error | AxiosError) => void;
  onCancel?: () => void;
  onSettled?: () => void;
  messageSuccess?: string;
  /** message gral */
  messageError?: string;
};

type ConfirmDialogState = {
  isOpen: boolean;
  dialogConfig: ConfirmDialogConfig | null;
  openConfirm: (config: ConfirmDialogConfig) => void;
  closeConfirm: () => void;
};

export const useConfirmStore = create<ConfirmDialogState>((set) => ({
  isOpen: false,
  dialogConfig: null,
  openConfirm: (config: ConfirmDialogConfig) =>
    set({ isOpen: true, dialogConfig: config }),
  closeConfirm: () => {
    set({ isOpen: false });
    setTimeout(() => {
      set({ dialogConfig: null });
    }, 250); // by animation Dialog animate-in and animate-out
  }
}));
