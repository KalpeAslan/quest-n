import { appConfig } from "@/app.config";
import { ContractResponse, ETokenStandard, IContract } from "@/models";
import { ApiService } from "@api/api";
import { AxiosResponse } from "axios";

class ContractService {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  createTokenContract = (data: {
    chainId: string;
    address: string;
    name?: string;
    symbol?: string;
  }): Promise<AxiosResponse<IContract>> => {
    if (this.apiService) {
      return this.apiService.post("contracts/token", data);
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  createNftContract = (
    data: {
      name: string;
      symbol: string;
      chainId: string;
      transferable: boolean;
      standard: ETokenStandard;
    },
    logo: File,
  ): Promise<AxiosResponse<ContractResponse>> => {
    if (this.apiService) {
      const formData = new FormData();

      formData.append("logo", logo);
      formData.append("data", JSON.stringify(data));

      return this.apiService.post("contracts/nft", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return Promise.reject({ message: "Invalid api address" });
  };

  verifyContracts = (): Promise<
    AxiosResponse<Record<string, [number, string][]>>
  > => {
    if (this.apiService) {
      return this.apiService.get("contracts/verify");
    }
    return Promise.reject({ message: "Invalid api address" });
  };

  getContracts = (
    standards: ETokenStandard[],
  ): Promise<AxiosResponse<IContract[]>> => {
    if (this.apiService) {
      return this.apiService.get(`contracts?standard=${standards.join(",")}`);
    }

    return Promise.reject({ message: "Invalid api address" });
  };
}

export const contractService = new ContractService();
