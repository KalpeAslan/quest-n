import { appConfig } from "@/app.config";
import { IPartnerProject } from "@/modules/quest/models";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class PartnerProjectService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getPartnerProjectData = (
    linkTitle: string,
  ): Promise<AxiosResponse<{ project: IPartnerProject }>> => {
    if (this.apiService) {
      return this.apiService.get(`partner-projects/${linkTitle}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const partnerProjectService = new PartnerProjectService();
