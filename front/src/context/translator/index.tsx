import { FC, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { i18n } from "@lingui/core";
import { I18nProvider, TransRenderProps } from "@lingui/react";
import { detect, fromNavigator } from "@lingui/detect-locale";
import { useRouter } from "next/router";
import { LocalStorageService } from "@/services";
import getConfig from "next/config";

interface IlanguageObject {
  name: string;
  value: ILanguage;
  icon: string;
}

interface ILanguages {
  en: IlanguageObject;
  uk: IlanguageObject;
  ru: IlanguageObject;
}

export const LANGUAGES: ILanguages = {
  en: { name: "ENG", value: "en", icon: "usa" },
  uk: { name: "UKR", value: "uk", icon: "ua" },
  ru: { name: "RUS", value: "ru", icon: "ru" },
};

export type ILanguage = keyof typeof LANGUAGES;

interface ITranslatorContext {
  language: ILanguage;
  loadLocale: (language: ILanguage) => void;
  languages: IlanguageObject[];
}

export const DEFAULT_LOCALE = "en";

export const TranslatorContext = createContext<Partial<ITranslatorContext>>({});

const { publicRuntimeConfig } = getConfig();

const { messages: defaultMessages } = publicRuntimeConfig[DEFAULT_LOCALE];

const getValidLanguage = (language: any) => {
  if (
    language &&
    (Object.keys(LANGUAGES).includes(language) || language === "ukr")
  )
    return language === "ukr" ? "uk" : language;

  return null;
};

const DefaultComponent: FC<TransRenderProps> = ({
  isTranslated,
  translation,
  id,
}) => (
  <>
    {isTranslated
      ? translation
      : typeof ((defaultMessages?.[id] || "") as string) === "string"
      ? ((defaultMessages?.[id] || "") as string).replace(/<.*>|\{.*\}/, "")
      : ((defaultMessages?.[id] || "") as string)}
  </>
);

export const TranslatorProvider = ({ children }: any) => {
  const { locale: pathLocale, query, push, pathname, asPath } = useRouter();
  const [language, setLanguage] = useState<ILanguage>(DEFAULT_LOCALE);
  const [languages, setLanguages] = useState<IlanguageObject[]>(
    Object.values(LANGUAGES),
  );

  const [firstLoad, setFirstLoad] = useState(true);

  const loadLocale = useCallback(
    async (locale: ILanguage) => {
      const { messages } = publicRuntimeConfig[locale];
      setLanguage(locale);
      i18n.load(locale, messages);
      i18n.activate(locale);
      setLanguages(prev => [
        LANGUAGES[locale],
        ...prev.filter(item => item.value !== locale),
      ]);
      LocalStorageService.setItem("lng", locale);
      push(pathname, asPath, { locale });
    },
    [asPath, pathname, push],
  );

  const init = useCallback(async () => {
    if (typeof window === "undefined" || !firstLoad) return;

    const localLanguage = await LocalStorageService.getItemAsync("lng");
    const languageFromQueryParams = query.lng as string;

    const pathLocaleValid = getValidLanguage(pathLocale);
    const languageFromQueryValid = getValidLanguage(languageFromQueryParams);
    const localLanguageValid = getValidLanguage(localLanguage);
    const navigatorLanguageValid = getValidLanguage(fromNavigator());

    const detectedLanguage = detect(
      pathLocaleValid,
      languageFromQueryValid,
      localLanguageValid,
      navigatorLanguageValid,
      DEFAULT_LOCALE,
    );

    setFirstLoad(false);

    if (
      detectedLanguage &&
      (Object.keys(LANGUAGES).includes(detectedLanguage) ||
        detectedLanguage === "ukr")
    ) {
      loadLocale(
        // @ts-ignore
        detectedLanguage === "ukr" ? "uk" : detectedLanguage,
      );
    } else {
      loadLocale("en");
    }
  }, [loadLocale, pathLocale, query, firstLoad]);

  useEffect(() => {
    init();
  }, [init]);

  const value: ITranslatorContext = {
    languages,
    language,
    loadLocale,
  };

  return (
    <I18nProvider
      i18n={i18n}
      defaultComponent={DefaultComponent}
      forceRenderOnLocaleChange={false}
    >
      <TranslatorContext.Provider value={value}>
        {children}
      </TranslatorContext.Provider>
    </I18nProvider>
  );
};
