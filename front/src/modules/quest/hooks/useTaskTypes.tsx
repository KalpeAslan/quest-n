import { CHAIN_OPTIONS, ELoyaltyTasks } from "@/models";
import { AdditionalField } from "../models";
import { useMemo } from "react";
import {
  _defaultPointsForCompletion,
  _defaultTitleAndDescription,
  getOnchainTasks,
  IOffChainTaskType,
  offChainTaskTypesSchema,
  standardOptions,
} from "@modules/quest/hooks/useTaskTypes.constants";

export const useTaskTypes = () => {
  const offChainTaskTypes: IOffChainTaskType = useMemo(
    () => offChainTaskTypesSchema,
    [],
  );

  const chainIdSelectorOptions = useMemo(() => CHAIN_OPTIONS, []);

  const nftStandardSelectorOptions = useMemo(() => standardOptions, []);

  const onChainTaskTypes: IOffChainTaskType = useMemo(
    () => getOnchainTasks(chainIdSelectorOptions, nftStandardSelectorOptions),
    [chainIdSelectorOptions, nftStandardSelectorOptions],
  );

  const allTasksTypesAsObject: {
    [key: string]: {
      type: ELoyaltyTasks;
      title: string;
      description: string;
      defaultDescription: string;
      socialAlgorithm: boolean;
      additionalFields: AdditionalField[];
      mainFields?: AdditionalField[];
      placeholder?: string;
      taskDescription?: { text: string; dynamic: boolean }[];
    };
  } = useMemo(
    () => ({
      ...Object.values(offChainTaskTypes).reduce(
        (typeAcc, typeItem) => ({
          ...typeAcc,
          ...typeItem.tasks.reduce(
            (takAcc, taskItem) => ({ ...takAcc, [taskItem.type]: taskItem }),
            {},
          ),
        }),
        {},
      ),
      ...Object.values(onChainTaskTypes).reduce(
        (typeAcc, typeItem) => ({
          ...typeAcc,
          ...typeItem.tasks.reduce(
            (takAcc, taskItem) => ({ ...takAcc, [taskItem.type]: taskItem }),
            {},
          ),
        }),
        {},
      ),
    }),
    [offChainTaskTypes, onChainTaskTypes],
  );

  const pointsForCompletion = useMemo(() => _defaultPointsForCompletion, []);
  const defaultTitleAndDescription = useMemo(
    () => _defaultTitleAndDescription,
    [],
  );

  return {
    offChainTaskTypes,
    onChainTaskTypes,
    allTasksTypesAsObject,
    pointsForCompletion,
    defaultTitleAndDescription,
  };
};
