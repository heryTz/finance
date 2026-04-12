import { create } from "zustand";

export enum Lang {
  fr = "fr",
}

type LangStore = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLangStore = create<LangStore>((set) => ({
  lang: Lang.fr,
  setLang: (lang) => set({ lang }),
}));
