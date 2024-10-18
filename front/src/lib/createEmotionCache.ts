import createCache from "@emotion/cache";
import { EmotionCache } from "@emotion/utils";

export const createEmotionCache = (): EmotionCache => {
  return createCache({ key: "css", prepend: true });
};
