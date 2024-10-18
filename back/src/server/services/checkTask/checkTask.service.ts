import { LoyaltyTask } from '../../../db/entity';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import { CheckTaskDto } from '../../../db/types/interfaces/checkTask/checkTask.dto';
import { isBridgeLoyaltyTask } from '../loyalty/task/complete/isBridgeLoyaltyTask';
import { isDEXLoyaltyTaskLiquidityProvider } from '../loyalty/task/complete/isDEXLoyaltyTaskLiquidityProvider';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { isGitCoinLoyaltyTask } from '../loyalty/task/complete/isGitCoinLoyaltyTask';

export const checkTask = async (task: LoyaltyTask, body: CheckTaskDto): Promise<boolean> => {
  switch (task.type) {
    case LoyaltyTaskType.DEXLiquidityProvider: {
      const result = await isDEXLoyaltyTaskLiquidityProvider(body.wallet, task);
      return result.status;
    }
    case LoyaltyTaskType.Bridge:
      return await isBridgeLoyaltyTask(body.wallet, task).then((res) => res.status);
    case LoyaltyTaskType.GitCoin: {
      const result = await isGitCoinLoyaltyTask(body.wallet, task);
      return result.status;
    }
  }
  throw new BadRequestError(
    BadRequestErrorKeys.NotValidParameter,
    `Task with id ${task.id} doesn't implemented for checking`,
  );
};
