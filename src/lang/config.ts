import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import frRessources from "./ressources/fr.json";
import zodFrRessources from "zod-i18n-map/locales/fr/zod.json";
import { Lang, useLangStore } from "./use-lang-store";

export const defaultNS = "translation";
export const resources = {
  fr: {
    translation: frRessources,
    zod: zodFrRessources,
  },
} as const;

export const setupLang = (
  params: { onLanguageChange?: (lang: Lang) => void } = {},
) => {
  i18next.use(initReactI18next).init({
    defaultNS,
    resources,
    lng: useLangStore.getState().lang,
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
  });

  i18next.on("languageChanged", (lang) => {
    params.onLanguageChange?.(lang as Lang);
  });
};
