import { appConfig } from "@/app.config";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class GamesService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getIframe = (
    bundle: string,
  ): Promise<
    AxiosResponse<{
      success: boolean;
      url: string;
    }>
  > => {
    if (this.apiService) {
      return this.apiService.get(`games/${bundle}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const gamesService = new GamesService();
