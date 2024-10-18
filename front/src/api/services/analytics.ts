import { AxiosResponse } from "axios";

import { ApiService } from "@api/api";
import { IAnalyticsData } from "@models";
import { appConfig } from "@/app.config";

class AnalyticsService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_ANALYTICS_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_ANALYTICS_HOST)
      : null;
  }

  postAnalyticsSendData = (
    data: IAnalyticsData,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.post("/api/events", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const analyticService = new AnalyticsService();
