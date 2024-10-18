import { AxiosResponse } from "axios";

import { ApiService } from "@api/api";
import { IPutInvestor } from "@modules/account/models";

import { appConfig } from "@/app.config";
import {
  EUserModalSettingsTypes,
  IExpHistoryItem,
  IPutReferralClaim,
} from "@models";

class AccountService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getAccountUserInfo = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("investor");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getUserReferral = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("investor/referral");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getUserAnalyticsInfo = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("investor/analytics");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getUserProfile = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("investor/profile");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getUserPartnerProjects = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("investor/partner-projects");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  putInvestor = (data: IPutInvestor): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.put("investor", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  deleteInvestor = (data: any): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.delete("investor", data ? { data } : null);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getInvestorStatistics = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get("project-currency-abi");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postAddReferral = (data: { code: string }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("referral", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postAddQuestReferral = (data: {
    code: string;
  }): Promise<
    AxiosResponse<{
      success: true;
      response: { questLinkTitle: string };
    }>
  > => {
    if (this.apiService) {
      return this.apiService.post("questReferral", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getQuestTitleByReferralCodeTask(code: string): Promise<
    AxiosResponse<{
      success: true;
      response: { questLinkTitle: string };
    }>
  > {
    if (this.apiService) {
      return this.apiService.get(`questReferral?code=${code}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  }

  putClaimReferralTokens = (): Promise<AxiosResponse<IPutReferralClaim>> => {
    if (this.apiService) {
      return this.apiService.post("/investor/referral/claim");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getExpHistory = (
    page?: number,
    perPage?: number,
  ): Promise<
    AxiosResponse<{ data: IExpHistoryItem[]; totalCount: number }>
  > => {
    if (this.apiService) {
      return this.apiService.get(
        `profiles/experience/history?page=${page}&per_page=${perPage}`,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  readUserSettingsModal(type: EUserModalSettingsTypes) {
    if (this.apiService) {
      return this.apiService.post("profiles/userModalSetting", {
        type,
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  }
}

export const accountService = new AccountService();
