import { create } from "zustand";

type FinanceSaveState = {
  open: boolean;
  finishReloader: number;
  idToEdit: string | null;
  onClose: () => void;
  onOpen: () => void;
  onFinish: () => void;
};

export const useFinanceSaveStore = create<FinanceSaveState>((set) => ({
  open: false,
  finishReloader: 0,
  idToEdit: null,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onFinish: () =>
    set((state) => ({
      open: false,
      finishReloader: state.finishReloader + 1,
      idToEdit: null,
    })),
  onUpdate: (id: string) => set({ open: true, idToEdit: id }),
}));
