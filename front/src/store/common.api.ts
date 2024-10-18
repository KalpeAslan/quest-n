import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { appConfig } from "@/app.config";
import { LocalStorageService } from "@services";
import { isTokenExpired, refreshAccessToken } from "@/utils/auth.utils";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: appConfig.NEXT_PUBLIC_API_HOST,
    prepareHeaders: async headers => {
      headers.set("Content-Type", "application/json;charset=UTF-8");
      headers.set("Authorization", "anonymous");

      let accessToken = await LocalStorageService.getItemAsync("au-t");
      let refreshToken = await LocalStorageService.getItemAsync("au-rt");
      const language = await LocalStorageService.getItemAsync("lng");
      const marketingToken = await LocalStorageService.getItemAsync(
        "marketing-token",
      );

      if (accessToken && isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken(refreshToken);
      }

      if (!(accessToken || language) || !headers) {
        return headers;
      }

      if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

      if (marketingToken)
        headers.set("marketing_auth", `Bearer ${marketingToken}`);

      if (language) headers.set("language", language);

      return headers;
    },
  }),
  endpoints: () => ({}),
});
