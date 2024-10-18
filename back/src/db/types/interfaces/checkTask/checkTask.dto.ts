import { LoyaltyTaskType } from '../loyalty';

export type CheckTaskDto =
  | CheckTaskAllBridgeTaskBody
  | CheckTaskDEXLiquidityProviderTaskBody
  | CheckTaskGitCoinTaskBody;

interface CheckTaskAllBridgeTaskBody {
  type: LoyaltyTaskType.Bridge;
  wallet: string;
}

interface CheckTaskDEXLiquidityProviderTaskBody {
  type: LoyaltyTaskType.DEXLiquidityProvider;
  wallet: string;
}

interface CheckTaskGitCoinTaskBody {
  type: LoyaltyTaskType.GitCoin;
  wallet: string;
}
