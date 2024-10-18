import { appConfig } from "@/app.config";
import { RewardToken } from "@/modules/quest/models";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class TokenService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getTokens = (): Promise<AxiosResponse<RewardToken[]>> => {
    if (this.apiService) {
      return this.apiService.get("token");
    }
    return Promise.reject({ message: "Invalid api address" });
  };
}

export const tokenService = new TokenService();
