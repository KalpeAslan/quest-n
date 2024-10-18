import { appConfig } from "@/app.config";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class ExperienceService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  mint = (): Promise<
    AxiosResponse<{
      signature: string;
      investorId: number;
      chainId: `0x${string}`;
      contractAddress: `0x${string}`;
    }>
  > => {
    if (this.apiService) {
      return this.apiService.post(`experience/level/mint`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  verify = (): Promise<
    AxiosResponse<{
      isProfileMinted: boolean;
    }>
  > => {
    if (this.apiService) {
      return this.apiService.post(`experience/level/verify`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  claim = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("experience/claim-daily-visit");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  dailyLogin = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("experience/daily-visit", {});
    }
    return Promise.reject({ message: "Invalid api address" });
  };
}

export const experienceService = new ExperienceService();
