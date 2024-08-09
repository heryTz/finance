import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Lang, useLangStore } from "./use-lang-store";
import { useStorage } from "@/lib/use-storage";

export function useLang() {
  const { lang, setLang } = useLangStore();
  const { t, i18n } = useTranslation();
  const storage = useStorage<Lang>("lang");

  const changeLang = (lang: Lang) => {
    i18next.changeLanguage(lang);
    setLang(lang);
    storage.setItem(lang);
  };

  const loadLang = async () => {
    const l = (await storage.getItem()) ?? Lang.fr;
    if (lang !== l) {
      setLang(l);
      i18n.changeLanguage(l);
    }
    return l;
  };

  return { changeLang, t, lang, loadLang };
}

// use this instead of "i18next."
export const t = i18next.t;
