import { create } from 'zustand';
import { ReactNode } from 'react';

type ModalConfig = {
  title?: string;
  description?: string;
  className?: string;
  classNameBody?: string;
  content?: ReactNode;
  fetchData?: (signal: AbortSignal) => Promise<ReactNode>;
  onClose?: () => void;
};

type ModalState = {
  isOpen: boolean;
  isLoading: boolean;
  modalConfig: ModalConfig | null;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  modalConfig: null,
  isLoading: false,
  openModal: async (config: ModalConfig) => {
    if (config.fetchData) {
      const newController = new AbortController();

      set({
        isLoading: true,
        isOpen: true,
        modalConfig: {
          title: config.title,
          description: config.description,
          className: config.className,
          classNameBody: config.classNameBody,
          content: null
        }
      });

      try {
        const data = await config.fetchData(newController.signal);

        set((prev) => ({
          ...prev,
          modalConfig: {
            ...prev.modalConfig,
            content: data
          }
        }));
      } catch (error: unknown) {
        console.error('Error en la solicitud:', error);
        if (!newController.signal.aborted) {
          set((prev) => ({
            ...prev,
            modalConfig: {
              ...prev.modalConfig,
              content: (
                <p className="text-center text-muted-foreground/70">
                  Error al cargar los datos.
                </p>
              )
            }
          }));
        }
      } finally {
        // sure the request is not aborted
        if (!newController.signal.aborted) {
          set({ isLoading: false });
        }
      }
    } else {
      set({ isOpen: true, modalConfig: config });
    }
  },
  closeModal: () => {
    const { modalConfig } = get();

    modalConfig?.onClose && modalConfig.onClose();

    set({ isOpen: false });
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
      set({ modalConfig: null, isLoading: false });
    }, 250); // by animation Dialog animate-in and animate-out
  }
}));
