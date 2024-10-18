import { appConfig } from "@/app.config";
import { ApiService } from "@api/api";

class Ambassador {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  findAmbassadorByContact(contact: string, method: string): Promise<any> {
    if (this.apiService)
      return this.apiService
        .get(`/ambassadors/find?contact=${contact}&method=${method}`)
        .then(res => res.data);
    return Promise.reject({ message: "Invalid api address" });
  }
}

export const ambassadorService = new Ambassador();
