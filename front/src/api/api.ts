import axios, { AxiosInstance, AxiosResponse } from "axios";

import { entryService } from "@api";
import { LocalStorageService } from "@services";
import { isTokenExpired, refreshAccessToken } from "@/utils/auth.utils";

export class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(async config => {
      let accessToken = await LocalStorageService.getItemAsync("au-t");
      const language = await LocalStorageService.getItemAsync("lng");
      const marketingToken = await LocalStorageService.getItemAsync(
        "marketing-token",
      );
      let refreshToken = await LocalStorageService.getItemAsync("au-rt");

      if (accessToken && isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken(refreshToken);
      }

      if (!(accessToken || language) || !config.headers) {
        return config;
      }

      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
      }

      if (marketingToken) {
        config.headers.marketing_auth = `Bearer ${marketingToken}`;
      }

      if (language) {
        config.headers.language = language;
      }

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      config => {
        return config;
      },
      async error => {
        const originalRequest = error.config;

        const refreshToken = await LocalStorageService.getItemAsync("au-rt");

        if (
          error.request.responseURL.includes("refresh-token") &&
          (error.response.data.errorCode === 5000 ||
            error.response.data.errorCode === 2000)
        ) {
          LocalStorageService.removeItem("au-t");
          LocalStorageService.removeItem("au-rt");
          return Promise.reject(error);
        }

        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const { data } = await entryService.refreshToken({
              refreshToken,
            });

            LocalStorageService.setItem("au-t", data.accessToken);

            return this.axiosInstance(originalRequest);
          } catch (error: any) {
            if (error.response && error.response.data) {
              return Promise.reject(error.response.data);
            }

            return Promise.reject(error);
          }
        }

        if (error?.response?.status === 401) {
          const event = new StorageEvent("storage", {
            key: "401",
            newValue: null,
          });
          window.dispatchEvent(event);

          return;
        }

        return Promise.reject(error);
      },
    );
  }

  get<T>(uri: string): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(uri);
  }

  post<T>(uri: string, body = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(uri, body);
  }

  patch<T>(uri: string, body = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(uri, body);
  }

  put<T>(uri: string, body = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(uri, body);
  }

  delete<T>(uri: string, body = {}): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(uri, body);
  }
}
