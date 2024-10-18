import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTaskTypes } from "./useTaskTypes";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getScanByAddressAndChainId } from "../components/createQuestSteps/CreateTasksStep/components/TaskForm/taskForm.constants";
import { isAddress } from "viem";
import {
  getDefaultValue,
  getFieldValue,
  getFormattedText,
} from "../helpers/tasks";
import { ELoyaltyTasks, ILoyaltyTask } from "@/models";
import { ITaskFormData } from "../components/createQuestSteps/CreateTasksStep/CreateTasksStep";
import { AnySchema, date, string } from "yup";
import { t } from "@lingui/macro";
import { adminQuestService, twitterService } from "@/api";
import { ECreateQuestSteps, ILoyaltyProject } from "../models";
import {
  setPreviewOpen,
  setPreviewPanel,
} from "@/store/slices/system/system.slice";
import { useDebouncedEffect } from "@/hooks";
import { useRouter } from "next/router";

interface Props {
  selectedTaskTypes: ELoyaltyTasks[];
  setStep: Dispatch<SetStateAction<ECreateQuestSteps>>;
  currentQuest: ILoyaltyProject;
  setCurrentQuest: Dispatch<SetStateAction<ILoyaltyProject>>;
  setShouldSave: Dispatch<SetStateAction<boolean>>;
  shouldSave: boolean;
  setPreviewLoading: Dispatch<SetStateAction<boolean>>;
  isUpdate: boolean;
  setTasksData: Dispatch<SetStateAction<ITaskFormData[]>>;
  tasksData: ITaskFormData[];
  savedTasksAsObject: ILoyaltyTask[];
  setWrongStepPopupOpen: Dispatch<SetStateAction<boolean>>;
}

export interface ICreateTasksHookData {
  anchors: {
    [key: string]: string;
    title: string;
    points?: string;
    description: string;
  }[];
  validationSchemas: {
    [taskType: string]: {
      [key: string]: AnySchema;
      title: AnySchema;
      points?: AnySchema;
      description: AnySchema;
    };
  };
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  onSave: () => Promise<void>;
  selectedTaskTypes: ELoyaltyTasks[];
  currentQuest: ILoyaltyProject;
  setCurrentQuest: Dispatch<SetStateAction<ILoyaltyProject>>;
  setTasksData: Dispatch<SetStateAction<ITaskFormData[]>>;
  tasksData: ITaskFormData[];
  savedTasksAsObject: ILoyaltyTask[];
  setSelectedTaskIndex: Dispatch<SetStateAction<number | null>>;
  selectedTaskIndex: number;
  onSaveTask: (index: number) => Promise<void>;
  onDeleteTask: (index: number) => Promise<void>;
}

const useCreateTasks = ({
  setTasksData,
  savedTasksAsObject,
  selectedTaskTypes,
  tasksData,
  currentQuest,
  setWrongStepPopupOpen,
  setStep,
  isUpdate,
  setCurrentQuest,
  shouldSave,
  setPreviewLoading,
  setShouldSave,
}: Props): ICreateTasksHookData => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSavedTasks, setIsSavedTasks] = useState<boolean>(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(
    null,
  );

  const dispatch = useAppDispatch();

  const {
    allTasksTypesAsObject,
    pointsForCompletion,
    defaultTitleAndDescription,
  } = useTaskTypes();

  useDebouncedEffect(
    () => {
      setTasksData(
        savedTasksAsObject.reduce((acc, item, index) => {
          const typeItem = item.type;

          if (!allTasksTypesAsObject[typeItem]) return acc;

          const commonValues = {
            typeItem,
            startAt: item.startAt,
            endAt: item.endAt,
            sortOrder: item.sortOrder,
            ...allTasksTypesAsObject[typeItem].additionalFields.reduce(
              (fieldAcc, fieldItem) => {
                if (fieldItem.name === "title")
                  return {
                    ...fieldAcc,
                    [fieldItem.name]:
                      item?.title ||
                      defaultTitleAndDescription[typeItem].title ||
                      allTasksTypesAsObject[typeItem].title,
                  };

                if (fieldItem.name === "description") {
                  return {
                    ...fieldAcc,
                    [fieldItem.name]:
                      item?.body?.description ||
                      defaultTitleAndDescription[typeItem].description ||
                      allTasksTypesAsObject[typeItem].description,
                  };
                }

                return {
                  ...fieldAcc,
                  [fieldItem.name]:
                    getFieldValue({
                      fieldItem,
                      savedTasksAsObject,
                      index,
                    } as any) ||
                    getDefaultValue({ fieldItem, taskType: typeItem }),
                };
              },
              {},
            ),
            ...allTasksTypesAsObject[typeItem].mainFields.reduce(
              (fieldAcc, fieldItem) => {
                if (fieldItem.name === "title")
                  return {
                    ...fieldAcc,
                    [fieldItem.name]:
                      item?.title ||
                      allTasksTypesAsObject[typeItem].title ||
                      defaultTitleAndDescription[typeItem].title,
                  };

                if (fieldItem.name === "linkAddress") {
                  const contractAddress =
                    item?.body?.address || item?.body?.contractAddress;
                  return {
                    ...fieldAcc,
                    [fieldItem.name]: contractAddress
                      ? getScanByAddressAndChainId(
                          contractAddress,
                          item?.body?.chainId,
                        )
                      : "",
                  };
                }
                if (fieldItem.name === "tweetLink") {
                  return {
                    ...fieldAcc,
                    [fieldItem.name]: `https://twitter.com/rektfencer/status/${item?.body?.tweetId}`,
                  };
                }

                if (fieldItem.name === "methodAbi") {
                  const { contractAddress, methodAbi } = item.body;
                  let value = {};
                  if (
                    contractAddress &&
                    isAddress(contractAddress as string) &&
                    methodAbi
                  ) {
                    try {
                      if (typeof methodAbi === "string") {
                        const parsed = JSON.parse(methodAbi);
                        if (parsed && parsed[0]) {
                          value = parsed[0];
                        }
                      } else {
                        value = Array.isArray(methodAbi)
                          ? methodAbi[0]
                          : methodAbi;
                      }
                    } catch (e) {
                      console.log(
                        "Parsing error at setting Method ABI field: ",
                        e,
                      );
                    }
                  }

                  return {
                    ...fieldAcc,
                    [fieldItem.name]: value,
                  };
                }

                if (fieldItem.name === "eventsQuantity") {
                  return {
                    ...fieldAcc,
                    [fieldItem.name]: item?.body?.eventsQuantity || 1,
                  };
                }

                if (fieldItem.name === "description") {
                  return {
                    ...fieldAcc,
                    [fieldItem.name]:
                      item?.body?.description || item?.body?.description === ""
                        ? item?.body?.description
                        : defaultTitleAndDescription[typeItem].description,
                  };
                }

                return {
                  ...fieldAcc,
                  [fieldItem.name]:
                    getFieldValue({
                      fieldItem,
                      savedTasksAsObject,
                      index,
                    } as any) ||
                    getDefaultValue({ fieldItem, taskType: typeItem }),
                };
              },
              {},
            ),
          } as any;

          const commonErrors = {
            title: "",
            description: "",
            ...allTasksTypesAsObject[typeItem].additionalFields.reduce(
              (fieldAcc, fieldItem) => ({
                ...fieldAcc,
                [fieldItem.name]: "",
              }),
              {},
            ),
            ...allTasksTypesAsObject[typeItem].mainFields.reduce(
              (fieldAcc, fieldItem) => ({
                ...fieldAcc,
                [fieldItem.name]: "",
              }),
              {},
            ),
          };

          const isOnChainSelector = [
            ELoyaltyTasks.TOKEN,
            ELoyaltyTasks.NFT,
            ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
          ].includes(typeItem as any);

          if (isOnChainSelector) {
            commonValues.selectedTab = "link";
          }

          acc.push({
            changed: false,
            taskType: typeItem,
            values:
              typeItem === ELoyaltyTasks.INVITE
                ? {
                    ...commonValues,
                    scorePercentage: 10,
                  }
                : {
                    ...commonValues,
                    points: item?.points || pointsForCompletion[typeItem] || 10,
                  },
            errors:
              typeItem === ELoyaltyTasks.INVITE
                ? {
                    ...commonErrors,
                    scorePercentage: "",
                  }
                : {
                    ...commonErrors,
                    points: "",
                  },
            id: item?.id || null,
          } as ITaskFormData);

          return acc;
        }, [] as ITaskFormData[]),
      );
    },
    { ignoreInitialCall: true, timeout: 500 },
    [savedTasksAsObject, setTasksData, allTasksTypesAsObject],
  );

  const anchors: {
    title: string;
    points?: string;
    description: string;
    [key: string]: string;
  }[] = useMemo(
    () =>
      selectedTaskTypes.reduce((acc, item) => {
        const commonAnchors = {
          ...allTasksTypesAsObject[item].mainFields.reduce(
            (fieldAcc, fieldItem) => ({
              ...fieldAcc,
              [fieldItem.name]: `${item}_${fieldItem.name}`,
            }),
            {},
          ),
        };
        return [
          ...acc,
          item === "invite"
            ? {
                ...commonAnchors,
                scorePercentage: `${item}_scorePercentage`,
              }
            : {
                ...commonAnchors,
                points: `${item}_points`,
              },
        ];
      }, []),
    [selectedTaskTypes, allTasksTypesAsObject],
  );

  const validationSchemas: {
    [taskType: string]: {
      title: AnySchema;
      points?: AnySchema;
      description: AnySchema;
      [key: string]: AnySchema;
    };
  } = useMemo(() => {
    return tasksData.reduce((acc, taskData) => {
      const item = taskData.taskType;
      if (!allTasksTypesAsObject[item]) return acc;

      const commonSchema = {
        title: string().required(
          t({
            id: "nr6QtVg3sdBxrS3pwqMpvj-quest",
            message: "Title is required",
          }),
        ),
        description: string(),
        ...allTasksTypesAsObject[item].additionalFields.reduce(
          (fieldAcc, fieldItem) => ({
            ...fieldAcc,
            [fieldItem.name]: fieldItem.schema,
          }),
          {},
        ),
        ...allTasksTypesAsObject[item].mainFields.reduce(
          (fieldAcc, fieldItem) => ({
            ...fieldAcc,
            [fieldItem.name]: fieldItem.schema,
          }),
          {},
        ),
        startAt: date().nullable(),
        endAt: date().nullable(),
      } as any;

      const isOnChainSelector = [
        ELoyaltyTasks.TOKEN,
        ELoyaltyTasks.NFT,
        ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
      ].includes(item as any);

      if (isOnChainSelector && taskData.values.selectedTab === "link") {
        commonSchema.linkAddress = commonSchema.linkAddress.required();
      }

      return {
        ...acc,
        [item]:
          item === "invite"
            ? {
                ...commonSchema,
                scorePercentage: string().required(
                  t({
                    id: "be86d774-19ab-11ee-be56-0242ac120002",
                    message: "Rewards percentage are required",
                  }),
                ),
              }
            : {
                ...commonSchema,
                points: string().required(
                  t({
                    id: "2LHaidE31zG4UtkABc3LgQ-quest",
                    message: "Rewards are required",
                  }),
                ),
              },
      };
    }, {});
  }, [allTasksTypesAsObject, tasksData]);

  const setFieldError = useCallback(
    (taskIndex: number, fieldName: string, error: string) =>
      setTasksData(prev => {
        const newArr = [...prev];
        newArr[taskIndex] = {
          ...newArr[taskIndex],
          errors: {
            ...(newArr[taskIndex] ? newArr[taskIndex].errors : ({} as any)),
            [fieldName]: error,
          },
        };
        return newArr;
      }),
    [],
  );

  const setFieldValue = (name: string, value: string | number, index) => {
    setTasksData(prev => {
      const newVal = [...prev];
      newVal[index].values[name] = value;
      return newVal;
    });
  };

  const getErrorLocation = useCallback(async (): Promise<{
    taskType: string;
    fieldName: string;
    taskIndex: number;
  } | null> => {
    const errors = await Promise.all(
      tasksData.map(async (taskItem, taskIndex) => {
        const { taskType } = taskItem;

        for (const fieldName of Object.keys(taskItem.values)) {
          const value = taskItem.values[fieldName];
          const isValidate = () => {
            if (fieldName === "typeItem") return false;
            if (fieldName === "selectedTab") return false;

            if (
              taskType === ELoyaltyTasks.GIT_COIN &&
              !taskItem.values.gitCoinSwitcher &&
              (fieldName === "gitCoinApiKey" || fieldName === "gitCoinScorerId")
            )
              return false;

            if (
              fieldName === "chatId" &&
              taskType === ELoyaltyTasks.JOIN_TELEGRAM
            )
              return false;
            if (
              (fieldName === "address" || fieldName === "contractAddress") &&
              taskItem.errors.invalidContract !== "400" &&
              taskItem.values.selectedTab === "link" &&
              taskItem.values.linkAddress
            ) {
              return false;
            }
            if (
              fieldName === "linkAddress" &&
              taskItem.errors.invalidContract !== "400" &&
              taskItem.values.selectedTab === "custom"
            ) {
              return false;
            }

            if (fieldName === "methodAbi" && taskItem.values.methodAbi) {
              return false;
            }

            return true;
          };
          if (isValidate()) {
            try {
              if (
                fieldName === "inviteLink" &&
                taskType === ELoyaltyTasks.JOIN_TELEGRAM
              ) {
                const computeGroupId = (): string => {
                  const splitted = (taskItem.values.inviteLink as string).split(
                    "/",
                  );
                  return splitted[splitted.length - 1];
                };
                const res = await adminQuestService
                  .isInvitedBot(computeGroupId())
                  .then(res => res.data)
                  .catch(console.log);
                if (!res) {
                  setFieldError(
                    taskIndex,
                    "inviteLink",
                    t({
                      id: "e7QgPesfsdasdafb51bnqfufvkpDEPU-quest",
                      message: "Something went wrong! Please try again later",
                    }),
                  );
                  return { taskType, fieldName, taskIndex };
                }
                const { ok, chat_id } = res.isBotInvited;
                if (ok) {
                  setFieldValue("chatId", String(chat_id), taskIndex);
                  return null;
                }

                setFieldError(
                  taskIndex,
                  "inviteLink",
                  t({
                    id: "e7QgPesfsdfb51bnqfufvkpDEPU-quest",
                    message: "Invite Bot to the channel!",
                  }),
                );
                return { taskType, fieldName, taskIndex };
              }

              if (validationSchemas[taskType][fieldName]) {
                validationSchemas[taskType][fieldName].validateSync(value);
              }
            } catch (error) {
              setFieldError(taskIndex, fieldName, error.message);

              return { taskType, fieldName, taskIndex };
            }

            const isTwitterUsername = allTasksTypesAsObject[
              taskType
            ].mainFields.find(
              item => item.name == fieldName,
            )?.isTwitterUsername;

            if (isTwitterUsername) {
              try {
                setLoading(true);
                const { data: result } = await twitterService
                  .checkUsername(String(value))
                  .finally(() => setLoading(false));

                if (!result.success) {
                  setFieldError(
                    taskIndex,
                    fieldName,
                    t({
                      id: "e7QgPeb51bnqfufvkpDEPU-quest",
                      message: "Invalid username",
                    }),
                  );
                  return { taskType, fieldName, taskIndex };
                }
              } catch (error) {
                setFieldError(
                  taskIndex,
                  fieldName,
                  t({
                    id: "4gfW3LuMEgFWfDuJkrc5NB-quest",
                    message: "Invalid username",
                  }),
                );
                return { taskType, fieldName, taskIndex };
              }
            }
          }
        }

        for (const fieldName of Object.keys(taskItem.errors)) {
          const error = taskItem.errors[fieldName];

          if (
            fieldName === "address" &&
            taskItem.values.selectedTab === "link" &&
            taskItem.values.linkAddress
          ) {
          }
          if (
            fieldName === "linkAddress" &&
            taskItem.values.selectedTab === "custom"
          )
            return null;

          if (error) {
            return {
              taskType,
              fieldName,
              taskIndex,
            };
          }
        }
      }),
    );

    if (errors.some(item => item)) {
      return errors.find(item => item);
    }

    return null;
  }, [tasksData, setFieldError, validationSchemas, allTasksTypesAsObject]);

  const { push, asPath } = useRouter();
  const onSaveAllTasks = useCallback(async () => {
    if (!currentQuest) {
      setWrongStepPopupOpen(true);
      return;
    }

    const pattern =
      /\/admin\/project\/([^/]+)\/quest\/([^/]+)\/(edit|create)\/tasks/;

    const replacedUrl = asPath.replace(
      pattern,
      "/admin/project/$1/quest/$2/$3/rewards",
    );
    push(replacedUrl);
  }, [currentQuest, asPath]);

  const onPreviewSave = useCallback(async () => {
    if (shouldSave) {
      setPreviewLoading(true);
      await onSaveAllTasks();
      setShouldSave(false);
      dispatch(setPreviewOpen(true));
      dispatch(setPreviewPanel({ open: true, onClick: "close" }));
      setPreviewLoading(false);
    }
  }, [dispatch, onSaveAllTasks, setPreviewLoading, setShouldSave, shouldSave]);

  const onSaveTask = async (index: number) => {
    const errorLocation = await getErrorLocation();
    if (errorLocation) return errorLocation;

    const taskData = tasksData[index];
    const body = (() => {
      const item = taskData.taskType;
      const data: any = {
        type: item,
        ...(taskData.id ? { id: taskData.id } : {}),
        ...Object.keys(tasksData[index].values).reduce(
          (valueKeyAcc, valueKeyItem) => {
            const data = tasksData[index].values[valueKeyItem];

            const value = (() => {
              if (valueKeyItem === "methodAbi") {
                return JSON.stringify([data]);
              }

              return typeof data === "string"
                ? getFormattedText({
                    text: data,
                    taskData: tasksData[index],
                  })
                : data;
            })();
            const path =
              allTasksTypesAsObject[item].mainFields.find(
                mainField => mainField.name == valueKeyItem,
              )?.path ||
              allTasksTypesAsObject[item].additionalFields.find(
                additionalFieldsItem =>
                  additionalFieldsItem.name == valueKeyItem,
              )?.path;

            if (!path) {
              return {
                ...valueKeyAcc,
                [valueKeyItem]:
                  item === ELoyaltyTasks.QUIZ && valueKeyItem === "answer"
                    ? [value]
                    : value,
              };
            }
            return {
              ...valueKeyAcc,
              [path]: {
                ...(valueKeyAcc[path] || {}),
                [valueKeyItem]:
                  item === ELoyaltyTasks.QUIZ && valueKeyItem === "answer"
                    ? [value]
                    : value,
              },
            };
          },
          {},
        ),
      };

      return data;
    })();

    if (body.id)
      return adminQuestService
        .updateTask(body, currentQuest.id, body.id)
        .then(() => setSelectedTaskIndex(null))
        .catch(reason => {
          console.log("reason.message", reason);
          if (
            reason.response &&
            reason.response.data &&
            reason.response.data.message ===
              "discordApiService.getServerIdByInviteLink error"
          ) {
            setFieldError(
              index,
              "inviteLink",
              t({
                id: "8gfW3LuMEgFWfDuJkrc5NB-quest",
                message: "Invalid Discord Invite Link",
              }),
            );
          }
        });

    return adminQuestService.createTask(body, currentQuest.id).then(res => {
      taskData.id = res.data.id;
      setSelectedTaskIndex(null);
      setTasksData(prevState => {
        const data = [...prevState];
        data[index] = taskData;
        return data;
      });
    });
  };

  const onDeleteTask = (index: number) => {
    const taskData = tasksData[index];
    return adminQuestService
      .deleteTask(currentQuest.id, taskData.id)
      .then(() => {
        setTasksData(prevState => {
          const data = [...prevState];
          data.splice(index, 1);
          return data;
        });
      });
  };

  useEffect(() => {
    onPreviewSave();
  }, [onPreviewSave]);

  return <ICreateTasksHookData>{
    anchors,
    validationSchemas,
    setLoading,
    loading,
    onSave: onSaveAllTasks,
    selectedTaskTypes,
    currentQuest,
    setCurrentQuest,
    setTasksData,
    tasksData,
    savedTasksAsObject,
    setSelectedTaskIndex,
    selectedTaskIndex,
    onSaveTask,
    onDeleteTask,
  };
};

export default useCreateTasks;
