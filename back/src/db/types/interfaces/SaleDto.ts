export interface VestingItem {
  percentage: number;
  claimDate: number;
}

export class CreateSaleDto {
  tokenHolder!: string;
  totalSupply!: number;
  headImage!: string;
  hardCap?: number | null;
  vesting!: VestingItem[];
  minAllocation!: number;
  maxAllocation!: number;
  pricePerToken!: number;
  projectId!: number;
  gasLimit!: number;
  gasPrice!: number;
  hideAllocation!: boolean;
  hideProgress!: boolean;
  generatedTokenDecimals!: number;
  generatedStableDecimals!: number;
  exchangeRate!: number;
  minTokenPart!: number;
  handled!: boolean;
}

export class UpdateSaleDto {
  tokenHolder?: string | null;
  totalSupply?: number | null;
  headImage?: string | null;
  hardCap?: number | null;
  vesting?: VestingItem[] | null;
  minAllocation?: number | null;
  maxAllocation?: number | null;
  pricePerToken?: number | null;
  projectId?: number | null;
  gasLimit?: number | null;
  gasPrice?: number | null;
  hideAllocation?: boolean | null;
  hideProgress?: boolean | null;
  generatedTokenDecimals?: number | null;
  generatedStableDecimals?: number | null;
  exchangeRate?: number | null;
  minTokenPart?: number | null;
  handled?: boolean | null;
}
