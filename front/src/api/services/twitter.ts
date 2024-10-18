import { appConfig } from "@/app.config";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class TwitterService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  checkUsername = (
    username: string,
  ): Promise<AxiosResponse<{ success: boolean }>> => {
    if (this.apiService) {
      return this.apiService.get(`twitter/check-username?username=${username}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const twitterService = new TwitterService();
