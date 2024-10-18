import { NextApiRequest, NextApiResponse } from "next";
import { CrowdinService } from "@services/CrowdinService";
import { appConfig } from "@/app.config";
import getConfig from "next/config";

const crowdinService = new CrowdinService({
  token: appConfig.CROWDIN_API_KEY,
  projectId: 562739,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { publicRuntimeConfig } = getConfig();

  const enTranslations = await crowdinService.getTranslations("en");

  publicRuntimeConfig.en.messages = {
    ...publicRuntimeConfig.en.messages,
    ...enTranslations,
  };

  const ukTranslations = await crowdinService.getTranslations("uk");

  publicRuntimeConfig.uk.messages = {
    ...publicRuntimeConfig.uk.messages,
    ...ukTranslations,
  };

  const ruTranslations = await crowdinService.getTranslations("ru");

  publicRuntimeConfig.ru.messages = {
    ...publicRuntimeConfig.ru.messages,
    ...ruTranslations,
  };

  res
    .status(200)
    .json({
      en: publicRuntimeConfig.en,
      uk: publicRuntimeConfig.uk,
      ru: publicRuntimeConfig.ru,
    });
}
