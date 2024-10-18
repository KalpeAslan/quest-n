import Crowdin from "@crowdin/crowdin-api-client";
import fetch from "node-fetch";

interface ICrowdinService {
  token: string;
  projectId: number;
}

export class CrowdinService {
  private readonly crowdin: Crowdin;
  private readonly projectId: number;

  constructor({ token, projectId }: ICrowdinService) {
    this.crowdin = new Crowdin({
      token,
    });
    this.projectId = projectId;
  }

  getTranslations = async (language: "uk" | "en" | "ru") => {
    const res = await this.crowdin.translationsApi.exportProjectTranslation(
      this.projectId,
      { targetLanguageId: language, format: "crowdin-json" },
    );

    const url = res.data.url;

    const file = await fetch(url);

    const strings = await file.json();

    const result = strings.reduce((acc, item) => {
      if (item.translation.includes("{") && item.translation.includes("}")) {
        let templateStarted = false;
        let templateEnded = true;
        const translation = item.translation.split("").reduce((acc, letter) => {
          if (letter === "{") {
            templateStarted = true;
            templateEnded = false;
            acc.push([]);
            return acc;
          }
          if (templateStarted && letter === "}") {
            templateStarted = false;
            templateEnded = true;
            return acc;
          }
          if (templateStarted) {
            const templateArr = acc[acc.length - 1];
            acc[acc.length - 1] = [(templateArr[0] || "") + letter];
            return acc;
          }
          if (templateEnded) {
            acc.push(letter);
            templateEnded = false;
            return acc;
          }
          acc[acc.length - 1] = acc[acc.length - 1] + letter;
          return acc;
        }, []);
        return { ...acc, [item.identifier]: translation };
      }
      return { ...acc, [item.identifier]: item.translation };
    }, {});

    return result;
  };
}
