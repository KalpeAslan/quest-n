import { appConfig } from "@/app.config";
import {
  TEmailLoginDataType,
  TEmailSignupDataType,
  TPhoneLoginDataType,
  TPhoneSignupDataType,
  TSocialDataType,
  TWalletEntry,
} from "@/models";
import {
  EntryLoginResponse,
  I2FaData,
  SuccessfulEntryResponse,
  TAuthType,
  TSocialAuthType,
} from "@/modules/account/models";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class EntryService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  // registration flow
  registration = (
    type: TAuthType,
    data:
      | TSocialDataType
      | TEmailSignupDataType
      | TPhoneSignupDataType
      | TWalletEntry,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/register/${type}`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // verification flow
  verifyEmail = (data: { emailToken: string }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/verify/email`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  phoneResendVerificationCode = (data: {
    confirmToken: string;
  }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/register/phone/retry`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  verifyPhone = (data: {
    code: string;
    confirmToken: string;
  }): Promise<AxiosResponse<SuccessfulEntryResponse>> => {
    if (this.apiService) {
      return this.apiService.post("auth/register/phone/confirm", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // verify or confirm
  confirm2fa = (
    type: TAuthType[2] | TAuthType[3],
    data: { emailToken: string },
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/register/${type}/confirm`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // 2fa flow
  post2faEntryCode = (
    type: TAuthType,
    code: I2FaData,
  ): Promise<AxiosResponse<{ success: boolean }>> => {
    if (this.apiService) {
      return this.apiService.post(`/security/2fa/login`, code);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faEntryConfirm = (
    code: I2FaData,
  ): Promise<AxiosResponse<SuccessfulEntryResponse>> => {
    if (this.apiService) {
      return this.apiService.post("security/2fa/login/confirm", code);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // post2faEntryRetry = (
  //   code: I2FaData,
  // ): Promise<AxiosResponse<{ success: boolean }>> => {
  //   if (this.apiService) {
  //     return this.apiService.post("security/2fa/retry", code);
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };

  // refresh token flow
  refreshToken = (data: {
    refreshToken: string;
  }): Promise<
    AxiosResponse<{
      accessToken: string;
    }>
  > => {
    if (this.apiService) {
      return this.apiService.post("auth/refresh-token", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // get social entry url
  getSocialEntry = (type: TSocialAuthType): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get(`auth/${type}/connect`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // login flow
  login = (
    type: TAuthType,
    data:
      | TSocialDataType
      | TEmailLoginDataType
      | TPhoneLoginDataType
      | TWalletEntry,
  ): Promise<AxiosResponse<EntryLoginResponse>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/login/${type}`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // Socials Endpoints

  getSocialsConnect = (
    type: TSocialAuthType[1] | TSocialAuthType[3],
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.get(`socials/${type}/connect`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postSocialsConfirm = (
    type: TSocialAuthType[1] | TSocialAuthType[3],
    data: any,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`socials/${type}/confirm`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  verifyTelegram = (): Promise<
    AxiosResponse<{ id: string; username: string }>
  > => {
    if (this.apiService) {
      return this.apiService.get("socials/telegram/verify");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postSocialsDisconnect = (
    type: TSocialAuthType[1] | TSocialAuthType[3],
    data: any,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`socials/${type}/disconnect`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const entryService = new EntryService();
