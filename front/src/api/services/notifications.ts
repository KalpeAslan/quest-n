import { appConfig } from "@/app.config";
import { ApiService } from "@api/api";
import { INotification } from "@store/slices/notifications/notifications.slice";

export interface IGetAll {
  viewed?: boolean;
  page?: number;
  pageSize?: number;
}

class Notifications {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getAll({
    pageSize,
    page,
    viewed,
  }: IGetAll): Promise<{ items: INotification[]; total: number }> {
    if (this.apiService)
      return this.apiService
        .get(
          `/notifications?page=${page}&pageSize=${pageSize}&viewed=${
            viewed || ""
          }`,
        )
        .then(res => res.data);
    return Promise.reject({ message: "Invalid api address" });
  }

  read(IDs: number[]) {
    if (this.apiService)
      return this.apiService
        .post("/notifications", {
          IDs,
        })
        .then(res => res.data);
    return Promise.reject({ message: "Invalid api address" });
  }
}

export const notificationsService = new Notifications();
