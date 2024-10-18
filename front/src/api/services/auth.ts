import { AxiosResponse } from "axios";

import { ApiService } from "@api/api";

import {
  I2FaData,
  EResetPasswordFlow,
  TAuthType,
} from "@modules/account/models";
import { appConfig } from "@/app.config";

class AuthService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  sendResetPasswordVerification = (data: {
    phone?: string;
    email?: string;
    type: EResetPasswordFlow;
  }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("reset-password/verification-send", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  resendResetPasswordVerification = (data: {
    confirmToken: string;
    type: EResetPasswordFlow;
  }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("reset-password/verification-resend", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  confirmResetPassword = (data: {
    confirmToken: string;
    code: string;
    type: EResetPasswordFlow;
  }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("reset-password/verification-confirm", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  resetPassword = (data: {
    resetToken: string;
    newPassword: string;
    type: EResetPasswordFlow;
  }): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("reset-password", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  // twitterLogin = (): Promise<AxiosResponse<any>> => {
  //   if (this.apiService) {
  //     return this.apiService.get("twitter/login");
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };

  // Confirm Social
  confirmSocial = (
    type: TAuthType[0] | TAuthType[3] | TAuthType[4],
    data: any,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/${type}/confirm`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  //
  // discordLogin = (): Promise<AxiosResponse<any>> => {
  //   if (this.apiService) {
  //     return this.apiService.get("discord/login");
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };
  //
  // discordToken = (data: any): Promise<AxiosResponse<any>> => {
  //   if (this.apiService) {
  //     return this.apiService.post("discord/token", data);
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };

  // telegramLogin = (): Promise<AxiosResponse<any>> => {
  //   if (this.apiService) {
  //     return this.apiService.get("telegram/login");
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };

  // telegramValidateUserData = (
  //   data: TelegramUser,
  // ): Promise<AxiosResponse<any>> => {
  //   if (this.apiService) {
  //     return this.apiService.post("telegram/validate", data);
  //   }
  //
  //   return Promise.reject({ message: "Invalid api address" });
  // };

  postDisconnect = (type: TAuthType): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/${type}/disconnect`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  changePassword = (
    type: TAuthType,
    data: { oldPassword: string; newPassword: string },
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post(`auth/${type}/change-password`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postInvestor2FaCode = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("investor/2fa/removing-code");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  postInvestor2FaConfirm = (data: I2FaData): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("investor/2fa/removing-confirm", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faConnect = (data: I2FaData): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/security/2fa/connect", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faConnectConfirm = (data: I2FaData): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/security/2fa/connect/confirm", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faDisconnect = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/security/2fa/disconnect");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faDisconnectConfirm = (data: I2FaData): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/security/2fa/disconnect/confirm", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  post2faRetry = (): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/security/2fa/connect");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  async registerWithInviteToPartnerProject(data: {
    password: string;
    referralCode?: string;
    email: string;
  }) {
    if (this.apiService) {
      return this.apiService.post("/auth/partnerProject/register", data);
    }
    return Promise.reject();
  }

  async loginWithInviteToPartnerProject(data: {
    password: string;
    email: string;
  }) {
    if (this.apiService) {
      return this.apiService.post("/auth/partnerProject/login", data);
    }
    return Promise.reject();
  }
}

export const authService = new AuthService();
