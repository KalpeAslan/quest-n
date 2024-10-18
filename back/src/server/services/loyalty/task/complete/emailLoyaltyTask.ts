import { SuggestionLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { LoyaltyTask } from '../../../../../db/entity';

export const isEmailLoyaltyTask = async (body: any, loyaltyTask: LoyaltyTask) => {
  const status =
    !!body.email && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(body.email);

  const taskBody = loyaltyTask.body as SuggestionLoyaltyTaskBody;

  try {
    if (taskBody?.regex) {
      return {
        status: new RegExp(taskBody.regex).test(body.email),
        json: {
          email: body.email,
        },
      };
    }
  } catch (e) {
    console.log('Error isSuggestionLoyaltyTask in regex', e);
  }

  const json = {
    email: body.email,
  };

  return {
    status,
    json,
  };
};
