import { AxiosResponse } from "axios";

import { ApiService } from "@api/api";
import { IEvent } from "@models";
import {
  IClaimResponse,
  IGetLoyaltyProjects,
  ILoyaltyProject, LoyaltyProjectsLuckyDrawWinner,
  StickyMenuInvestorInfo
} from "@modules/quest/models";
import { appConfig } from "@/app.config";

class LoyaltyService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getLoyaltyProjectsData = (
    params: any,
  ): Promise<AxiosResponse<IGetLoyaltyProjects>> => {
    if (this.apiService) {
      const path = params
        ? `loyalty-projects?${new URLSearchParams(params).toString()}`
        : "loyalty-projects/";

      return this.apiService.get(path);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyProjectData = (
    linkTitle: string,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.get(`loyalty-project/${linkTitle}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyProjectInvestorInfo = (
    linkTitle: string,
  ): Promise<AxiosResponse<StickyMenuInvestorInfo>> => {
    if (this.apiService) {
      return this.apiService.get(`loyalty-project/${linkTitle}/investor`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyData = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("loyalty");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyEventData = (): Promise<AxiosResponse<IEvent>> => {
    if (this.apiService) {
      return this.apiService.get("loyalty-event");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postLoyaltyTaskCompleted = (
    id: number,
    data: any,
    params?: any,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      data.reCaptchaVersion = "v3";
      return this.apiService.post(
        `loyalty-tasks/${id}/completed`,
        data,
        params,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyScoreboard = (
    id: string,
    page: number,
    pageSize: number,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get(
        `loyalty-project/${id}/scoreboard?page=${page}&pageSize=${pageSize}`,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getOnbordingTasks = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("loyalty-tasks/onboarding");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getSubTaskByLoyaltyTaskId = (loyaltyTaskId, subTaskId): Promise<any> => {
    if (this.apiService)
      return this.apiService.get(
        `/loyalty-tasks/${loyaltyTaskId}/subTasks/${subTaskId}`,
      );
    return Promise.reject({ message: "Invalid api address" });
  };

  postClaim = (data: {
    linkTitle: string;
    rewardId: number;
  }): Promise<AxiosResponse<IClaimResponse>> => {
    if (this.apiService) {
      return this.apiService.post(`loyalty-project/${data.linkTitle}/claim`, {
        rewardId: data.rewardId,
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  confirmClaiming = (
    linkTitle: string,
    data: {
      rewardId: number;
      transactionHash: string;
    },
  ) => {
    if (this.apiService) {
      return this.apiService.post(
        `loyalty-project/${linkTitle}/claim/confirm`,
        data,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postClaimAq = (data: { linkTitle: string }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`loyalty-project/${data.linkTitle}/claim/aq`);
    }
    return Promise.reject({ message: "Invalid api address" });
  };

  getOnboardingQuestLinkTitle = (): Promise<
    AxiosResponse<{ linkTitle: string }>
  > => {
    if (this.apiService) {
      return this.apiService.get("loyalty-projects/onboarding-link");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getLoyaltyProjectWinners(linkTitle: string): Promise<AxiosResponse<LoyaltyProjectsLuckyDrawWinner[]>> {
    if (this.apiService) {
      return this.apiService.get(`loyalty-project/${linkTitle}/winners`);
    }

    return Promise.reject({ message: "Invalid api address" });
  }
}

export const loyaltyService = new LoyaltyService();
