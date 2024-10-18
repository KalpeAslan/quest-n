import { bodyValidator } from '../../../../helpers';
import { CompletedSuggestionLoyaltyTaskDto } from '../../CompletedSuggestionLoyaltyTaskDto';
import { SuggestionLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { LoyaltyTask } from '../../../../../db/entity';
import { ConflictError, ConflictErrorKeys } from '../../../../errors';
import { taskProgressModel } from '../../../../../db/models';
import { RequestLogger } from '../../../logger';
const logger = new RequestLogger();

export const isSuggestionLoyaltyTask = async (requestBody: any, loyaltyTask: LoyaltyTask) => {
  await bodyValidator(CompletedSuggestionLoyaltyTaskDto, requestBody);
  const body = loyaltyTask.body as SuggestionLoyaltyTaskBody;

  try {
    if (body.uniqueOnly) {
      const existingTaskProgress = await taskProgressModel.getSuggestionTaskByBodyDescription(requestBody.description);
      if (existingTaskProgress) {
        throw new ConflictError(ConflictErrorKeys.ConflictError, 'Not unique suggestion');
      }
    }

    if (body?.regex) {
      return {
        status: new RegExp(body.regex).test(requestBody.description),
        json: {
          description: requestBody.description,
        },
      };
    }
  } catch (e) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      {
        additionalData: `Error isSuggestionLoyaltyTask ${e}`,
      },
    );
    throw e;
  }

  const json = {
    description: requestBody.description,
  };

  return {
    status: true,
    json,
  };
};
