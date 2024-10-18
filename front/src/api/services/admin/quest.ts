import { ApiService } from "@/api/api";
import { appConfig } from "@/app.config";
import {
  EProjectType,
  ILoyaltyProject,
  QuestStatus,
} from "@/modules/quest/models";
import { AxiosResponse } from "axios";
import { CreateRewards } from "@/modules/quest/components/createQuestSteps/RewardsStep/rewardsStep.types";
import { ILoyaltyTask } from "@models";

class AdminQuestService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  createQuest = (data: {
    projectName: string;
    title: string;
    linkTitle: string;
    description: string;
    startAt: string;
    endAt: string;
    socialDescription: string;
    partnerLinkTitle: string;
    previewImage: string | null;
    projectType: EProjectType;
    questStatus: QuestStatus;
  }): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.post("admin/quest", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateQuest = (
    data: {
      projectName?: string;
      title?: string;
      description?: string;
      startAt?: string;
      endAt?: string;
      socialDescription?: string;
      visible?: boolean;
      projectType?: EProjectType;
      tokensAmount?: number;
      eligibleUsersCount?: number;
      threshold?: number;
      rewards?: {
        startPlace: number;
        endPlace: number;
        tokens: {
          id: number;
          amount: number;
        }[];
        whitelisting?: boolean;
      }[];
      questStatus?: QuestStatus;
    },
    linkTitle: string,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.put(`admin/quest/${linkTitle}`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createRewards = (linkTitle: string, data: CreateRewards[]) => {
    if (this.apiService) {
      return this.apiService.post(`admin/quest/${linkTitle}/rewards`, data);
    }
    return Promise.reject({ message: "Invalid api address" });
  };

  replaceRewards = (linkTitle: string, data: CreateRewards[]) => {
    if (this.apiService) {
      return this.apiService.put(`admin/quest/${linkTitle}/rewards`, data);
    }
    return Promise.reject({ message: "Invalid api address" });
  };

  deleteQuest = (linkTitle: string): Promise<AxiosResponse<{}>> => {
    if (this.apiService) {
      return this.apiService.delete(`admin/quest/${linkTitle}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getDefaultPreviewImage = (): Promise<AxiosResponse<string>> => {
    if (this.apiService) {
      return this.apiService.get("admin/quest/preview-image");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  savePreviewImage = (file: File): Promise<AxiosResponse<string>> => {
    if (this.apiService) {
      const formData = new FormData();

      formData.append("preview", file);

      return this.apiService.put("admin/quest/preview-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateQuestPreviewImage = (
    linkTitle: string,
    file: File,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      const formData = new FormData();

      formData.append("preview", file);

      return this.apiService.put(
        `admin/quest/${linkTitle}/preview-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  deleteQuestPreviewImage = (
    linkTitle: string,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.delete(`admin/quest/${linkTitle}/preview-image`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createLoyaltyTasks = (
    data: any,
    linkTitle: string,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.post(`admin/quest/${linkTitle}/tasks`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateLoyaltyTasks = (
    data: any,
    linkTitle: string,
  ): Promise<AxiosResponse<ILoyaltyProject>> => {
    if (this.apiService) {
      return this.apiService.put(`admin/quest/${linkTitle}/tasks`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createTask = (
    data: any,
    questId: number,
  ): Promise<AxiosResponse<ILoyaltyTask>> => {
    if (this.apiService) {
      return this.apiService.post(`admin/quest/${questId}/task`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateTask = (
    data: any,
    questId: number,
    id: number,
  ): Promise<AxiosResponse<ILoyaltyTask>> => {
    if (this.apiService) {
      return this.apiService.put(`admin/quest/${questId}/task/${id}`, data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  deleteTask = (
    questId: number,
    taskId: number,
  ): Promise<AxiosResponse<any>> => {
    if (this.apiService) {
      return this.apiService.delete(`admin/quest/${questId}/task/${taskId}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  getAdminSettings = (
    partnerProjectLinkTitle: string,
  ): Promise<
    AxiosResponse<{ limit: number; tgBotLink: string; questsCount: number }>
  > => {
    if (this.apiService) {
      return this.apiService.get(
        `admin/${partnerProjectLinkTitle}/quest/getAdminTasksSettings`,
      );
    }

    return Promise.reject({ message: "Invalid api address" });
  };
  public async isInvitedBot(groupId: string): Promise<
    AxiosResponse<{
      isBotInvited: { ok: boolean; chat_id: number };
      success: boolean;
    }>
  > {
    if (this.apiService) {
      return this.apiService.get(
        `/admin/quest/checkIsBotInvited?groupId=${groupId}`,
      );
    }
    return Promise.reject({ message: "Invalid api address" });
  }
}

export const adminQuestService = new AdminQuestService();
