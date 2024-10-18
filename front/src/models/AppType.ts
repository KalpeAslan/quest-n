export type TThemne = "dark" | "light";
export type TWallet = "Metamask" | "WalletConnect";

export interface IWaleltPopup {
  status: boolean;
  chainId: number | string | null | undefined;
}

export interface IRestrictionForCreation {
  open: boolean;
  type: string;
  username: string;
}

export interface IRestrictionForWallet {
  open: boolean;
  type: string;
  address: string;
}

export interface IReferralPopupResult {
  open: boolean;
  type: "success" | "error";
}
