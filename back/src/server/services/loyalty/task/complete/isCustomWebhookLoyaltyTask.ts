import { LoyaltyTask } from '../../../../../db/entity';
import axios from 'axios';
import { CustomWebhookTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../logger';
import { taskProgressModel, walletUserModel } from '../../../../../db/models';
import { CustomWebhookTaskProgressBody } from '../../../../../db/types/interfaces/taskProgress/customWebhook.types';
import { BadRequestError, BadRequestErrorKeys } from '../../../../errors';
const logger = new RequestLogger();

export const isCustomWebhookLoyaltyTask = async (requestedBody, loyaltyTask: LoyaltyTask, investorId: number) => {
  const loyaltyTaskBody = loyaltyTask.body as CustomWebhookTaskBody;
  const request = loyaltyTaskBody.webhookDetails;

  const input = request.userInput;

  if (input.inputOptions.includes('wallet')) {
    requestedBody.wallet = (await walletUserModel.getByInvestorId(investorId))?.address || '';
  }

  const requestKey = Object.keys(requestedBody).filter((key) => {
    return ['text', 'email', 'phone', 'wallet'].includes(key);
  })[0];

  if (input.isBodyPart) {
    request.body = getBody(input.keyOptions[requestKey], { ...request.body }, requestedBody[requestKey]);
  } else if (input.isPathPart) {
    request.path += `${input.keyOptions[requestKey]}=${requestedBody[requestKey]}&`;
  }

  const requestParams = {
    headers: request.headers,
    method: request.method as 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    url: request.path,
    params: null,
    data: request.body,
  };

  await logger.info(
    { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
    { requestTo3rdParty: requestParams },
  );

  const response = await axios(requestParams);

  await logger.info(
    { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
    {
      responseFrom3rdParty: {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      },
    },
  );

  if (request.uniqueOnly) {
    const taskProgresses = await taskProgressModel.getByLoyaltyTaskId(loyaltyTask.id);
    const userInput = requestedBody[requestKey];
    for (const currTaskProgress of taskProgresses) {
      const json = currTaskProgress.json as CustomWebhookTaskProgressBody;
      if (json.successfulResponse && json.successfulResponse === userInput) {
        throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Value already used');
      }
    }
  }

  const successMatch: boolean = checkAllOptionsMatch(response, request.successfulResponseOptions);

  return {
    status: successMatch,
    json: {
      userInput: requestedBody[requestKey],
    },
  };
};

function getNestedValue(data: any, key: string) {
  const keys = key.split('.');
  let nestedData = data;

  for (const k of keys) {
    if (!nestedData || typeof nestedData !== 'object') {
      return false;
    }
    nestedData = nestedData[k];
  }

  return nestedData;
}

function checkAllOptionsMatch(
  response: any,
  options: {
    key: string;
    value?: any;
    checkExists?: boolean | undefined;
  }[],
) {
  for (const option of options) {
    const { key, value, checkExists } = option;
    const isMatch = checkExists ? !!getNestedValue(response.data, key) : getNestedValue(response.data, key) === value;

    if (!isMatch) {
      return false;
    }
  }

  return true;
}

const getBody = (keyOptions: string[] | string, body: any, value: any) => {
  if (typeof keyOptions === 'string') {
    body[keyOptions] = value;
    return body;
  }

  if (keyOptions.length === 1) {
    body[keyOptions[0]] = value;
    return body;
  }

  body[keyOptions[0]] = getBody(keyOptions.slice(1), body?.[keyOptions[0]] || {}, value);

  return body;
};
