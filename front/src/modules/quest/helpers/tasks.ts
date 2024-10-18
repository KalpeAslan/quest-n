import {
  CHAIN_OPTIONS,
  ELoyaltyTasks,
  ETaskStatus,
  ILoyaltyTask,
} from "@/models";
import { AdditionalField } from "../models/Quest";
import { ITaskFormData } from "../components/createQuestSteps/CreateTasksStep/CreateTasksStep";
import { standardOptions } from "../hooks/useTaskTypes.constants";

export const getFieldValue = ({
  fieldItem,
  savedTasksAsObject,
  index,
}: {
  fieldItem: AdditionalField;
  savedTasksAsObject: ILoyaltyTask[];
  index: number;
}) =>
  fieldItem.path
    ? getFieldJsonValue({
        value:
          savedTasksAsObject[index]?.body?.[fieldItem.path]?.[fieldItem.name],
        json: fieldItem.json,
      })
    : getFieldJsonValue({
        value: savedTasksAsObject[index]?.body?.[fieldItem.name],
        json: fieldItem.json,
      });

const getFieldJsonValue = ({ json, value }: { json?: boolean; value: any }) =>
  json ? JSON.stringify(value) : value;

export const getDefaultValue = ({
  fieldItem,
  taskType,
}: {
  fieldItem: AdditionalField;
  taskType?: ELoyaltyTasks;
}) => {
  if (
    [
      ELoyaltyTasks.TOKEN,
      ELoyaltyTasks.NFT,
      ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
      ELoyaltyTasks.NATIVE_HOLDER,
      ELoyaltyTasks.VALUE_HOLDER,
    ].includes(taskType as any)
  ) {
    if (fieldItem.name === "minTokenAmount") return 1;
  }

  if (fieldItem.name === "eventsQuantity") return 1;
  if (fieldItem.type === "number") return 10;
  if (fieldItem.type === "selector" && fieldItem.selectorOptions)
    return fieldItem.selectorOptions[0].value;
  return "";
};

export const getStartDate = (currentDate: Date | string | number) => {
  const today = new Date(currentDate);
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 7);
  return nextDate;
};

export const getEndDate = (currentDate: Date | string | number) => {
  const today = new Date(currentDate);
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 21);
  return nextDate;
};

export const getFormattedText = ({
  text,
  taskData,
}: {
  text: string;
  taskData: ITaskFormData;
}) => {
  return Object.entries(taskData.values).reduce((acc: string, [key, value]) => {
    if (
      key === "description" &&
      taskData.taskType === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER &&
      taskData.values.methodAbi
    ) {
      return acc.replace(
        `$eventName$`,
        (taskData.values.methodAbi as any).name,
      );
    }

    if (key === "title" || key === "description") return acc;

    if (key === "methodAbi") {
      try {
        const data = JSON.parse(value);
        const methodName = data[0].name;
        return acc.replace(`$${key}$`, methodName);
      } catch (error) {
        return acc;
      }
    }

    if (key === "chainId") {
      return acc.replace(
        `$${key}$`,
        CHAIN_OPTIONS.find(item => item.value === value).title,
      );
    }

    if (key === "standard") {
      return acc.replace(
        `$${key}$`,
        standardOptions.find(item => item.value === value).title,
      );
    }

    if (!value) return acc;
    return acc.replace(`$${key}$`, value);
  }, text);
};

export const getFormatOfText = ({
  text,
  taskData,
}: {
  text: string;
  taskData: ITaskFormData;
}) => {
  return Object.entries(taskData.values).reduce((acc: string, [key, value]) => {
    if (!value || key === "title" || key === "description") return acc;

    if (key === "methodAbi") {
      try {
        const data = JSON.parse(value);
        const methodName = data[0].name;
        return acc.replace(methodName, `$${key}$`);
      } catch (error) {
        return acc;
      }
    }

    if (key === "chainId") {
      return acc.replace(
        CHAIN_OPTIONS.find(item => item.value === value).title,
        `$${key}$`,
      );
    }

    if (key === "standard") {
      return acc.replace(
        standardOptions.find(item => item.value === value).title,
        `$${key}$`,
      );
    }

    if (!value) return acc;
    return acc.replace(value, `$${key}$`);
  }, text);
};

export const getDoneTasksCount = (tasks: ILoyaltyTask[]) =>
  tasks.reduce((acc, item) => {
    if (item.status === ETaskStatus.DONE) {
      return acc + 1;
    }
    return acc;
  }, 0);
