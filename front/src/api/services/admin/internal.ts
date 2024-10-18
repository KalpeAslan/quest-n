import { ApiService } from "@/api/api";
import { appConfig } from "@/app.config";
import { AxiosResponse } from "axios";
import { IParticipant } from "@models/InternalAdmin";

class AdminInternalService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getQuest = (token: string, linkTitle: string) => {
    if (this.apiService) {
      return this.apiService.get(
        `/admin/internal/quest/${linkTitle}?token=${token}`,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateQuest = (
    token: string,
    linkTitle: string,
    data: { featured: boolean; visible: boolean },
  ) => {
    if (this.apiService) {
      return this.apiService.put(
        `/admin/internal/quest/${linkTitle}?token=${token}`,
        data,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getQuestParticipants = (
    token: string,
    linkTitle: string,
  ): Promise<AxiosResponse<IParticipant[]>> => {
    if (this.apiService) {
      return this.apiService.get(
        `/admin/internal/quest/${linkTitle}/participants?token=${token}`,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const adminInternalService = new AdminInternalService();
