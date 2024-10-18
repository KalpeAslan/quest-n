export const computeLanguage = (lang: string) => {
  if (lang === "uk") return "ua".toUpperCase();
  return lang.toUpperCase();
};
