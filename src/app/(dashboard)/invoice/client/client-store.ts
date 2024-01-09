import { create } from "zustand";

type ClientSaveState = {
  open: boolean;
  reloader: number;
  idToEdit: string | null;
  onClose: () => void;
  onOpen: () => void;
  onFinish: () => void;
  onUpdate: (id: string) => void;
};

type ItemToDelete = { id: string; label: string } | null;

type ClientDeleteState = {
  open: boolean;
  reloader: number;
  itemToDelete: ItemToDelete;
  onClose: () => void;
  onFinish: () => void;
  onDelete: (item: ItemToDelete) => void;
};

export const useClientSaveStore = create<ClientSaveState>((set) => ({
  open: false,
  reloader: 0,
  idToEdit: null,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false, idToEdit: null }),
  onFinish: () =>
    set((state) => ({
      open: false,
      reloader: state.reloader + 1,
      idToEdit: null,
    })),
  onUpdate: (id: string) => set({ open: true, idToEdit: id }),
}));

export const useClientDeleteStore = create<ClientDeleteState>((set) => ({
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
