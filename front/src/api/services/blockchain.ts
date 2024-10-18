import { appConfig } from "@/app.config";
import { ApiService } from "@api";
import { IAbiEvent } from "@models";

class Blockchain {
  private apiService: any;

  constructor() {
    this.apiService = appConfig.NEXT_PUBLIC_API_HOST
      ? new ApiService(appConfig.NEXT_PUBLIC_API_HOST)
      : null;
  }

  getAbiOfContract(address: string, chainId?: string): Promise<IAbiEvent[]> {
    if (this.apiService)
      return this.apiService
        .get(`/abi-of-contract/${address}?chainId=${chainId}`)
        .then(res => res.data.abi);
    return Promise.reject({ message: "Invalid api address" });
  }

  getTokenInfo(
    address: string,
    chainId?: string,
    tokenType?: string,
  ): Promise<{
    name: string;
    tokenType?: "ERC721" | "ERC1155" | null;
  }> {
    if (this.apiService)
      return this.apiService
        .get(
          `/abi-of-contract/token/${address}?chainId=${chainId}&tokenType=${tokenType}`,
        )
        .then(res => res.data);
    return Promise.reject({ message: "Invalid api address" });
  }
}

export const blockchainService = new Blockchain();
