export interface IProjectSale {
  id: number;
  totalSupply: number;
  headImage: string;
  hardCap: number | null;
  minAllocation: number;
  maxAllocation: number;
  pricePerToken: number;
  hideAllocation: boolean;
  hideProgress: boolean;
  precision: number;
  fulfilledAllocation: number;
}
