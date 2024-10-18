import { ApiService } from "@/api/api";
import { appConfig } from "@/app.config";
import {
  CreatePartnerProjectDto,
  IInvitedUser,
  IInviteInfoForPartnerProject,
  UpdatePartnerProjectDto,
} from "@/models";
import { IPartnerProject } from "@/modules/quest/models";
import { AxiosResponse } from "axios";

class AdminProjectService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getDefaultLogo = (): Promise<AxiosResponse<string>> => {
    if (this.apiService) {
      return this.apiService.get("admin/project/default-logo");
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createProject = (
    logo: File | null,
    data: CreatePartnerProjectDto,
  ): Promise<AxiosResponse<{ project: IPartnerProject }>> => {
    if (this.apiService) {
      const formData = new FormData();

      if (logo) {
        formData.append("logo", logo);
      }

      formData.append("data", JSON.stringify(data));

      return this.apiService.post(`admin/project`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  updateProject = (
    logo: File | null,
    linkTitle: string,
    data: UpdatePartnerProjectDto,
  ): Promise<AxiosResponse<{ project: IPartnerProject }>> => {
    if (this.apiService) {
      const formData = new FormData();

      if (logo) {
        formData.append("logo", logo);
      }

      formData.append("data", JSON.stringify(data));

      return this.apiService.put(`admin/project/${linkTitle}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  public async inviteForPartnerProject(
    projectLinkTitle: string,
    body: { email: string },
  ) {
    if (this.apiService) {
      return this.apiService.post(
        `/admin/project/${projectLinkTitle}/invite`,
        body,
      );
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  public async getInvitedUsersOfPartnerProject(
    projectLinkTitle: string,
  ): Promise<AxiosResponse<IInvitedUser[]>> {
    if (this.apiService) {
      return this.apiService.get(
        `/admin/project/${projectLinkTitle}/invited-users`,
      );
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  async removeInvitedUserFromPartnerProject(
    projectLinkTitle: string,
    email: string,
  ) {
    if (this.apiService) {
      return this.apiService.delete(
        `/admin/project/${projectLinkTitle}/remove-invited-user/${email}`,
      );
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  async acceptInviteToPartnerProject(body: { projectId: number }) {
    if (this.apiService) {
      return this.apiService.patch(`/admin/project/accept-invite`, body);
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  async declineInviteToPartnerProject(body: { projectId: number }) {
    if (this.apiService) {
      return this.apiService.patch(`/admin/project/decline-invite`, body);
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  async leaveFromPartnerProject(projectLinkTitle: string) {
    if (this.apiService) {
      return this.apiService.delete(
        `/admin/project/${projectLinkTitle}/invite`,
      );
    }
    return Promise.reject({ message: "Invalid api address" });
  }

  async getInviteById(
    inviteId: number | string,
  ): Promise<AxiosResponse<IInviteInfoForPartnerProject>> {
    if (this.apiService) {
      return this.apiService.get(`/admin/project/invite/${inviteId}`);
    }
    return Promise.reject({ message: "Invalid api address" });
  }
}

export const adminProjectService = new AdminProjectService();
