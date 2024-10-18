import { ApiService } from "@/api/api";
import { appConfig } from "@/app.config";
import {
  ICreateNftRewardDto,
  ICreateTokenRewardDto,
  ICreateWhitelistRewardDto,
  ILoyaltyProjectFullReward,
  INft,
  INftRewardResponse,
  ITokenRewardResponse,
  TVerifyNftRewardsResponse,
} from "@/models";
import { AxiosResponse } from "axios";

class AdminRewardService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  createWhitelistRewards = (
    data: ICreateWhitelistRewardDto[],
  ): Promise<AxiosResponse<ILoyaltyProjectFullReward[]>> => {
    if (this.apiService) {
      return this.apiService.post("admin/reward/whitelist", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createTokenRewards = (
    data: ICreateTokenRewardDto,
  ): Promise<AxiosResponse<ITokenRewardResponse>> => {
    if (this.apiService) {
      return this.apiService.post("admin/reward/token", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createNftReward = (
    data: ICreateNftRewardDto,
    image: File,
  ): Promise<AxiosResponse<INftRewardResponse>> => {
    if (this.apiService) {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("data", JSON.stringify(data));

      return this.apiService.post("admin/reward/nft", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  verifyRewards = (
    questId: number,
  ): Promise<AxiosResponse<TVerifyNftRewardsResponse>> => {
    if (this.apiService) {
      return this.apiService.post("admin/reward/verify", { questId });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  deleteReward = (
    rewardId: number,
  ): Promise<AxiosResponse<{ success: boolean }>> => {
    if (this.apiService) {
      return this.apiService.delete(`admin/reward/${rewardId}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getNftMetadata = (
    contractId: number,
    nftId: number,
  ): Promise<AxiosResponse<INft>> => {
    if (this.apiService) {
      return this.apiService.get(`nft/${contractId}/${nftId}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const adminRewardService = new AdminRewardService();
