import { AxiosResponse } from "axios";
import { ApiService } from "@api/api";
import { Advertisement, IPartner } from "@models";
import { appConfig } from "@/app.config";

class HomeService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getHomePartnersData = (): Promise<AxiosResponse<IPartner[]>> => {
    if (this.apiService) {
      return this.apiService.get("partners");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getAdvertisements = (): Promise<AxiosResponse<Advertisement[]>> => {
    if (this.apiService) {
      return this.apiService.get("/advertisements");
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const homeService = new HomeService();
