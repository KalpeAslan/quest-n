import {
  DEFAULT_META_DESCRIPTION_EN,
  DEFAULT_META_DESCRIPTION_RU,
  DEFAULT_META_DESCRIPTION_UK,
  DEFAULT_META_TITLE_EN,
  DEFAULT_META_TITLE_RU,
  DEFAULT_META_TITLE_UK,
} from "@/models";

export const getDefaultMetaDescription = (locale: string) => {
  if (locale === "en") return DEFAULT_META_DESCRIPTION_EN;
  if (locale === "uk") return DEFAULT_META_DESCRIPTION_UK;
  return DEFAULT_META_DESCRIPTION_RU;
};

export const getDefaultMetaTitle = (locale: string) => {
  if (locale === "en") return DEFAULT_META_TITLE_EN;
  if (locale === "uk") return DEFAULT_META_TITLE_UK;
  return DEFAULT_META_TITLE_RU;
};
