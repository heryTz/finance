import { create } from "zustand";

type ItemToDelete = { id: string; label: string } | null;

type InvoiceDeleteState = {
  open: boolean;
  reloader: number;
  itemToDelete: ItemToDelete;
  onClose: () => void;
  onFinish: () => void;
  onDelete: (item: ItemToDelete) => void;
};

export const useInvoiceDeleteStore = create<InvoiceDeleteState>((set) => ({
  open: false,
  reloader: 0,
  itemToDelete: null,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false, itemToDelete: null }),
  onFinish: () =>
    set((state) => ({
      open: false,
      reloader: state.reloader + 1,
      idToDelete: null,
    })),
  onDelete: (item) => set({ open: true, itemToDelete: item }),
}));
