import { AxiosResponse } from "axios";

import { ApiService } from "@api/api";
import { IProject } from "@models";
import { appConfig } from "@/app.config";

class ShortenerService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_SHORTENER_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_SHORTENER_HOST)
      : null;
  }

  getShortenerData = (param: string): Promise<AxiosResponse<IProject>> => {
    if (this.apiService) {
      return this.apiService.get(param);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const shortenerService = new ShortenerService();
