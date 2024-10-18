import { ELoyaltyTasks, ENetworks, IAbiEvent, ILoyaltyTask } from "@/models";
import { Wrapper } from "./taskForm.styles";
import {
  ChangeEvent,
  Dispatch,
  FC,
  FocusEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box } from "@mui/material";
import { Icon } from "@/components/UI/icon";
import { NumberInput } from "@/components/UI/numberInput";
import classNames from "classnames";
import { icons } from "@/modules/quest/models/constants";
import { Input } from "@/components/UI/input";
import { ILoyaltyProject } from "@/modules/quest/models";
import { twitterService } from "@/api";
import { ITaskFormData } from "../../CreateTasksStep";
import { AnySchema } from "yup";
import { t, Trans } from "@lingui/macro";
import { useTaskTypes } from "@/modules/quest/hooks/useTaskTypes";
import { Selector } from "@/components/UI/selector";
import { WYSIWYG } from "@components/WYSIWYG/WYSIWYG";
import { isAddress } from "viem";
import { blockchainService } from "@api/services/blockchain";
import Tooltip from "@components/UI/tooltip/Tooltip";
import Tabs from "@components/UI/tabs/Tabs";
import {
  computeEndAt,
  computeStartAt,
  validateScanUrlAndGetNetworkKey,
  validateTGLink,
} from "@modules/quest/components/createQuestSteps/CreateTasksStep/components/TaskForm/taskForm.constants";
import { CBreakpoints } from "@styles/variables";
import Button from "@components/UI/button/Button";
import {
  getFormatOfText,
  getFormattedText,
} from "@/modules/quest/helpers/tasks";
import Loader from "../../../../../../../components/UI/loader/Loader";
import { Switcher } from "@components/UI/switcher/Switcher";

interface Props {
  tgBotLink: string;
  type: ELoyaltyTasks;
  setCurrentQuest: Dispatch<SetStateAction<ILoyaltyProject>>;
  taskData: ITaskFormData;
  setTasksData: Dispatch<SetStateAction<ITaskFormData[]>>;
  savedData: ILoyaltyTask | null;
  validation: {
    title: AnySchema;
    points?: AnySchema;
    description: AnySchema;
    [key: string]: AnySchema;
  };
  isLoading: boolean;
  index: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentQuest: ILoyaltyProject;
  onSave: () => void;
  onClose: () => void;
  isDraft: boolean;
}

interface IQuizAnswerItem {
  value: string;
  optional?: boolean;
}

const TaskCard: FC<Props> = ({
  type,
  taskData,
  setTasksData,
  savedData,
  validation,
  index,
  tgBotLink,
  setLoading,
  currentQuest,
  onSave,
  onClose,
  isDraft,
}) => {
  const { allTasksTypesAsObject } = useTaskTypes();

  const taskType = useMemo(
    () => allTasksTypesAsObject[type],
    [type, allTasksTypesAsObject],
  );

  const setFieldValue = useCallback(
    (name: string, value: string | number | any) => {
      const savedValue = savedData?.[name] || savedData?.body?.[name];
      setTasksData(prev => {
        const newVal = [...prev];
        if (newVal && newVal[index]) {
          newVal[index].values[name] = value;
          newVal[index].changed = value !== savedValue;
          return newVal;
        }
        return prev;
      });
    },
    [setTasksData, type, savedData],
  );

  const setFieldError = useCallback(
    (name: string, error: string) => {
      setTasksData(prev => {
        const newArr = [...prev];
        if (newArr && newArr[index]) {
          newArr[index] = {
            ...newArr[index],
            errors: {
              ...(newArr[index] ? newArr[index].errors : ({} as any)),
              [name]: error,
            },
          };
          return newArr;
        }
        return prev;
      });
    },
    [setTasksData, type],
  );

  const onBlur = useCallback(
    (isTwitterUsername?: boolean) =>
      async (
        e:
          | FocusEvent<HTMLInputElement>
          | { target: { name: string; value: string } },
      ) => {
        const { name, value } = e.target;

        const schema = validation[name];
        const error = taskData.errors[name];

        const isOnchainTask = [
          ELoyaltyTasks.TOKEN,
          ELoyaltyTasks.NFT,
          ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
        ].includes(taskData.taskType as any);

        if (isOnchainTask && error) return;

        try {
          if (schema) {
            schema.validateSync(value, {});
          }

          setFieldError(name, "");
        } catch (error) {
          setFieldError(name, error.message);
        }

        if (isTwitterUsername) {
          try {
            const { data: result } = await twitterService.checkUsername(value);

            if (!result.success) {
              setFieldError(
                name,
                t({
                  id: "6PYRCbqEiCjA529JEXfatd-quest",
                  message: "Invalid username",
                }),
              );
            } else {
              setFieldError(name, "");
            }
          } catch (error) {
            setFieldError(
              name,
              t({
                id: "8oTSSqAQ7gRjFBCddirxe6-quest",
                message: "Invalid username",
              }),
            );
          }
        }
      },
    [validation, setFieldError, type],
  );

  const getError = useCallback(
    (name: string) => {
      const computeErrorText = () => {
        if (name === "linkAddress") {
          if (!taskData.values[name])
            return t({
              message: "Smart Contract Link is required",
              id: "dfkgj9232340-46sfnsdj-quest",
            });

          return t({
            message: "Please provide a valid Link to the smart contract",
            id: "dsjh23fksdhfj-2837894hfdd-quest",
          });
        }

        if (name === "contractAddress" || name === "address") {
          if (!taskData.values[name])
            return t({
              message: "Smart contract address is required",
              id: "vfjsskdjf-2837894hf-quest",
            });

          if (
            [
              ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
              ELoyaltyTasks.TOKEN,
              ELoyaltyTasks.NFT,
            ].includes(taskData.taskType as any)
          )
            return t({
              message: "Please provide a valid adress",
              id: "dsjhfksdtfesnv-2837894hf-quest",
            });

          return taskData.errors[name];
        }

        if (
          name === "inviteLink" &&
          taskData.taskType === ELoyaltyTasks.JOIN_TELEGRAM &&
          taskData.values.inviteLink &&
          !validateTGLink(taskData.values.inviteLink as string)
        )
          return t({
            message: "Only support public groups and channels.",
            id: "snndjuwqca9523-quest",
          });

        return taskData.errors[name];
      };
      return {
        error: Boolean(taskData.errors[name]),
        errorText: computeErrorText(),
      };
    },
    [taskData],
  );

  const [customFields, setCustomFields] = useState<
    Array<IAbiEvent | IQuizAnswerItem>
  >([]);
  const [isAbiEventsLoading, setIsAbiEventsLoading] = useState<boolean>(false);

  const getAbiEvents = useCallback(
    (contractAddress: string, chainId?: string) => {
      setLoading(true);
      setIsAbiEventsLoading(true);
      blockchainService
        .getAbiOfContract(
          contractAddress,
          chainId ? chainId : ENetworks.Ethereum,
        )
        .then(abi => {
          setCustomFields(abi);
          if (selectedTab === "link") {
            return setFieldError("linkAddress", "");
          }
          setFieldError("address", "");
          return setFieldError("contractAddress", "");
        })
        .catch(() => {
          setCustomFields([]);
          setFieldError(
            "methodAbi",
            t({
              message: "0 events found for this smart contract",
              id: "safhgdfsadasdh-sudyuyqwvc-quest",
            }),
          );
        })
        .finally(() => {
          setIsAbiEventsLoading(false);
          setLoading(false);
        });
    },
    [customFields],
  );

  const getTokenInfo = (contractAddress: string, chainId?: string) => {
    setLoading(true);
    blockchainService
      .getTokenInfo(
        contractAddress,
        chainId ? chainId : ENetworks.Ethereum,
        taskType.type === ELoyaltyTasks.NFT ? "nft" : "token",
      )
      .then(data => {
        setFieldValue("tokenSymbol", data.name);
        if (taskType.type === ELoyaltyTasks.NFT) {
          setFieldValue("tokenName", data.name);
        }
        setFieldError("invalidContract", "");
        setFieldError("address", "");
        setFieldError("linkAddress", "");
        setFieldError("contractAddress", "");
      })
      .catch(() => {
        setFieldError("invalidContract", "400");
        if (selectedTab === "link") {
          setFieldError(
            "linkAddress",
            t({
              message:
                "We couldn't find this link. Please try again or use the manual entry mode.",
              id: "jsdyfu1287fdb-124fbusy23-quest",
            }),
          );
        } else {
          setFieldError(
            "address",
            t({
              message:
                "We couldn't find this contract address. Please try again or use the Load from link mode.",
              id: "jsdyfasdu1287fdb-124fbusy23-quest",
            }),
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [lightedBorder, setLightedBorder] = useState<boolean>(false);

  useEffect(() => {
    let timeOut = null;
    if (taskData.new) {
      setLightedBorder(taskData.new);
      timeOut = setTimeout(() => {
        setLightedBorder(false);
      }, 5000);
    }

    if (taskType.type === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER) {
      const { contractAddress, chainId } = taskData.values;
      if (contractAddress && isAddress(contractAddress as string)) {
        getAbiEvents(contractAddress as string, chainId as string);
      }
    }

    if (
      taskType.type === ELoyaltyTasks.TOKEN ||
      taskType.type === ELoyaltyTasks.NFT
    ) {
      const { contractAddress, chainId } = taskData.values;
      if (contractAddress && isAddress(contractAddress as string)) {
        getTokenInfo(contractAddress as string, chainId as string);
      }
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  const handleChangeForLightedBorder = useCallback(() => {
    if (taskData.new && lightedBorder) setLightedBorder(false);
  }, [lightedBorder]);

  const onChange = useCallback(
    (fieldType: "number" | "text" | "date") =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleChangeForLightedBorder();
        if (fieldType === "number") {
          if (isNaN(Number(e.target.value)) || Number(e.target.value) < 0) {
            return;
          }

          setFieldValue(name, Number(value));

          return;
        }
        if (
          (name === "contractAddress" || name === "address") &&
          isAddress(value)
        ) {
          if (taskType.type === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER)
            getAbiEvents(value, taskData.values.chainId as string);
          if (
            taskType.type === ELoyaltyTasks.NFT ||
            taskType.type === ELoyaltyTasks.TOKEN
          )
            getTokenInfo(value, taskData.values.chainId as string);
        } else if (
          name === "contractAddress" &&
          !isAddress(value) &&
          customFields.length
        ) {
          setCustomFields([]);
        }
        setFieldValue(
          name,
          name === "title" ? getFormatOfText({ text: value, taskData }) : value,
        );
      },
    [setFieldValue, getAbiEvents, getTokenInfo, handleChangeForLightedBorder],
  );

  const onSelectorChange = useCallback(
    (fieldName: string) => (data: string) => {
      handleChangeForLightedBorder();
      if (fieldName === "chainId") {
        const value =
          taskData.taskType === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER
            ? (taskData.values.contractAddress as string)
            : (taskData.values.address as string);
        if (isAddress(value)) {
          if (taskType.type === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER)
            getAbiEvents(value, data);
          if (
            taskType.type === ELoyaltyTasks.NFT ||
            taskType.type === ELoyaltyTasks.TOKEN
          )
            getTokenInfo(value, data);
        } else if (!isAddress(value) && customFields.length) {
          setCustomFields([]);
        }
      }
      setFieldValue(fieldName, data);
    },
    [setFieldValue, handleChangeForLightedBorder],
  );

  const renderMainFields = () => {
    if (!taskType.mainFields) return null;

    const isOnChainSelector = [
      ELoyaltyTasks.TOKEN,
      ELoyaltyTasks.NFT,
      ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
    ].includes(taskType.type as any);

    const mainFieldsUI =
      taskType.mainFields &&
      taskType.mainFields.map((item, index, arr) => {
        if (
          isOnChainSelector &&
          selectedTab === "link" &&
          (item.name === "chainId" || item.name === "address")
        )
          return null;

        if (item.hidden) return;
        if (item.type === "number") {
          const computeTitle = () => {
            if (taskData.taskType === ELoyaltyTasks.NATIVE_HOLDER)
              return getFormattedText({
                text: item.title,
                taskData,
              });
            return item.title;
          };
          return (
            <Box mb={2.5} key={item.name}>
              <Box className="c-font-16-22" mb={0.75}>
                {computeTitle()}
              </Box>

              <NumberInput
                className={classNames("c-full-width", "input", "numberInput")}
                name={item.name}
                value={String(taskData.values[item.name])}
                onBlur={onBlur()}
                onChange={onChange("number")}
                error={getError(item.name).error}
                errortext={getError(item.name).errorText}
                classnames={{ error: "error" }}
                setValue={data => setFieldValue(item.name, data)}
                min={1}
                isDisabled={!isDraft}
              />
            </Box>
          );
        }

        if (item.type === "selector" && item.selectorOptions) {
          const computeOptions = () => {
            if (taskData.taskType === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER) {
              return item.selectorOptions.filter(
                chain => chain.value !== ENetworks.ZetaChain,
              );
            }
            return item.selectorOptions;
          };
          return (
            <Box mb={2.5} key={item.name}>
              <Box className="c-font-16-22" mb={0.75}>
                {item.title}
              </Box>

              <Selector
                className={classNames("c-full-width", "input")}
                zIndex={arr.length - index}
                options={computeOptions()}
                value={String(taskData.values[item.name])}
                onSelect={onSelectorChange(item.name)}
                disabled={!isDraft}
              />
            </Box>
          );
        }
        if (item.type === "wyziwyg") {
          return (
            <Box mb={2.5} key={item.name}>
              <Box className="c-font-16-22" mb={0.75}>
                {item.title}
              </Box>
              <WYSIWYG
                minHeight={taskData.taskType === ELoyaltyTasks.QUIZ ? 150 : 135}
                placeholder={item.placeholder || item.title}
                name={item.name}
                value={
                  !taskData.values[item.name]
                    ? ""
                    : item.name === "description"
                    ? getFormattedText({
                        text: taskData.values.description,
                        taskData,
                      })
                    : String(taskData.values[item.name])
                }
                onInit={value => {
                  if (!item.placeholder) {
                    item.name === "description"
                      ? setFieldValue(
                          "description",
                          getFormatOfText({ text: value, taskData }),
                        )
                      : setFieldValue(item.name, value);
                  }
                }}
                onBlur={onBlur(item.isTwitterUsername)}
                onChange={value =>
                  item.name === "description"
                    ? setFieldValue(
                        "description",
                        getFormatOfText({ text: value, taskData }),
                      )
                    : setFieldValue(item.name, value)
                }
                maxLength={1000}
                error={getError(item.name).error}
                errorMessage={getError(item.name).errorText}
                setFieldError={error =>
                  setFieldError(
                    item.name,
                    error ? "Max length is 1000 characters" : null,
                  )
                }
                isDisabled={item.name !== "description" && !isDraft}
              />
            </Box>
          );
        }

        const renderTitle = () => {
          if (item.name !== "address")
            return (
              <Box className="c-font-16-22 c-font-color" mb={0.75}>
                {getFormattedText({
                  text: item.title,
                  taskData,
                })}
              </Box>
            );

          return (
            <Tooltip
              value={t({
                message: "Paste Address of your Smart Contract",
                id: "qh912213-21dsjbgjiw-124nf-quest",
              })}
            >
              <Box className="c-font-16-22 c-flex-items-center" mb={0.75}>
                <p>{item.title}</p>
                <Box position={"relative"} top={7} left={5}>
                  <Icon name={"question-mark"} />
                </Box>
              </Box>
            </Tooltip>
          );
        };

        return (
          <Box mb={2.5} key={item.name}>
            {renderTitle()}

            <Input
              className={classNames("c-full-width", "input")}
              placeholder={
                (taskType.mainFields[index] &&
                  taskType.mainFields[index]?.placeholder) ||
                item.title
              }
              name={item.name}
              value={
                item.name === "title"
                  ? getFormattedText({
                      text: String(taskData.values[item.name]),
                      taskData,
                    })
                  : String(taskData.values[item.name] || "")
              }
              onBlur={onBlur(item.isTwitterUsername)}
              onChange={onChange("text")}
              error={getError(item.name).error}
              errortext={getError(item.name).errorText}
              classnames={{ error: "error" }}
              multiline={item.type === "multiline"}
              rows={4}
              initiateChangeOnRender={item.name === "title"}
              isDisabled={item.name !== "title" && !isDraft}
            />
          </Box>
        );
      });

    if (isOnChainSelector)
      return (
        <>
          <Box mb={2}>
            <Tabs
              tabs={[
                {
                  id: 1,
                  title: t({
                    id: "sjkgjsbfSfdfbf-quest",
                    message: "Load from Link",
                  }),
                  tab: "link",
                },
                {
                  id: 2,
                  title: t({
                    id: "oiutyrgjsbfSbdjeq-quest",
                    message: "Input manually",
                  }),
                  tab: "custom",
                },
              ]}
              activeTab={selectedTab}
              changeFn={setSelectedTab}
              type={"tertiary"}
              buttonType={"button"}
              isDisabled={!isDraft}
            />
          </Box>
          {
            <>
              {selectedTab === "link" && (
                <Box mb={2.5} id={"linkAddress"}>
                  <Tooltip
                    value={t({
                      message:
                        "Paste URL link to your \n Smart Contract Address in Scanner",
                      id: "jh912-21dsjbgjiw-124nf-quest",
                    })}
                  >
                    <Box className="c-font-16-22 c-flex-items-center" mb={0.75}>
                      <p>
                        {t({
                          message: "Link to the smart contract",
                          id: "sbioqwyuq48924-ewnfqoiy1-12vbdsh",
                        })}
                      </p>
                      <Box position={"relative"} top={7} left={5}>
                        <Icon name={"question-mark"} />
                      </Box>
                    </Box>
                  </Tooltip>

                  <Input
                    className={classNames("c-full-width", "input")}
                    placeholder={
                      "https://etherscan.io/address/0x0000000000000000000000000000000000000000"
                    }
                    name={"linkAddress"}
                    value={String(taskData.values["linkAddress"] || "")}
                    onBlur={onBlur()}
                    onChange={e => {
                      const value = validateScanUrlAndGetNetworkKey(
                        e.target.value,
                      );
                      if (value) {
                        setFieldValue("chainId", value.chainId);
                        const fieldName =
                          taskType.type === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER
                            ? "contractAddress"
                            : "address";
                        setFieldValue(fieldName, value.contractAddress);
                        if (isAddress(value.contractAddress)) {
                          if (
                            taskType.type ===
                            ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER
                          )
                            getAbiEvents(value.contractAddress, value.chainId);
                          if (
                            taskType.type === ELoyaltyTasks.NFT ||
                            taskType.type === ELoyaltyTasks.TOKEN
                          )
                            getTokenInfo(value.contractAddress, value.chainId);
                        }
                      } else if (customFields.length) {
                        setCustomFields([]);
                      }
                      return setFieldValue("linkAddress", e.target.value);
                    }}
                    error={getError("linkAddress").error}
                    errortext={getError("linkAddress").errorText}
                    classnames={{ error: "error" }}
                    isDisabled={!isDraft}
                  />
                </Box>
              )}
              {mainFieldsUI}
            </>
          }
          {taskType.type === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER && (
            <>
              {selectedTab === "custom" && (
                <Tooltip
                  value={t({
                    message: "Paste Your Smart Contract Address",
                    id: "sdhj-jdhguh1-124-dg-quest",
                  })}
                >
                  <Box mb={2.5} position={"relative"} key={"contractAddress"}>
                    <Box className={"c-flex-items-center"}>
                      <Box className="c-font-16-22" mb={0.75}>
                        Smart Contract Address
                      </Box>
                      <Box position={"relative"} top={3} left={5}>
                        <Icon name={"question-mark"} />
                      </Box>
                    </Box>

                    <Input
                      className={classNames("c-full-width", "input")}
                      placeholder={"0x0000000000000000000000000000000000000000"}
                      name={"contractAddress"}
                      value={taskData.values.contractAddress as string}
                      onBlur={onBlur()}
                      onChange={onChange("text")}
                      error={getError("contractAddress").error}
                      errortext={getError("contractAddress").errorText}
                      classnames={{ error: "error" }}
                      rows={4}
                      isDisabled={!isDraft}
                    />
                  </Box>
                </Tooltip>
              )}
              <Box>
                <Tooltip value={"Select only one ABI event of contract"}>
                  <Box className={"c-flex-items-center"}>
                    <Box>Event to check</Box>
                    <Box position={"relative"} top={7} left={5}>
                      <Icon name={"question-mark"} />
                    </Box>
                  </Box>
                </Tooltip>

                <Box
                  borderRadius={"10px"}
                  mt={1}
                  p={2}
                  display={"flex"}
                  bgcolor={"#141414"}
                  position={"relative"}
                  minHeight={60}
                  height={"100%"}
                  maxHeight={300}
                  className={
                    taskData.errors.methodAbi && !customFields.length
                      ? "c-font-color-4"
                      : "c-font-color-8"
                  }
                  sx={{
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    ...(customFields.length
                      ? {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "20px",
                        }
                      : {}),
                    ["@media (max-width: 768px)"]: {
                      gridTemplateColumns: "1fr",
                    },
                  }}
                >
                  {taskData.errors.methodAbi && !customFields.length ? (
                    <span>{taskData.errors.methodAbi}</span>
                  ) : isAbiEventsLoading ? (
                    <Loader size={30} width={"30px"} style={{ left: 15 }} />
                  ) : customFields.length ? (
                    customFields.map((item: IAbiEvent, index) => (
                      <Box
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "#87F696",
                          },
                          borderColor:
                            taskData.values["methodAbi"] &&
                            ((taskData.values["methodAbi"] as any).name ===
                            item.name
                              ? "#87F696"
                              : "rgba(255, 255, 255, 0.10)"),
                        }}
                        border={"1px solid rgba(255, 255, 255, 0.10)"}
                        borderRadius={"10px"}
                        py={1.5}
                        px={2}
                        onClick={() => {
                          if (!isDraft) return;
                          setFieldValue("methodAbi", item);
                        }}
                        bgcolor={"#272A2A"}
                        key={index}
                      >
                        {item.name}
                      </Box>
                    ))
                  ) : (
                    <Box>
                      {`Set the ${
                        selectedTab === "link"
                          ? "link to the"
                          : "address of the"
                      } smart contract to get the list of events`}
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          )}
        </>
      );

    if (taskType.type === ELoyaltyTasks.QUIZ) {
      taskData.values.answers = (taskData.values.answers || "") as string;
      return (
        <>
          {mainFieldsUI}
          <Box>
            <Box
              display={"grid"}
              gridTemplateColumns={"1fr 1fr"}
              alignItems={"start"}
              gap={2.7}
            >
              <Box>
                <Box className="c-font-16-22" mb={1}>
                  {t({
                    id: "iure9ce64-14ab-11ee-be56-0654549820002-quest",
                    message: "Answer",
                  })}
                </Box>
                {taskData.values.answers
                  .split(",")
                  .map((item: string, index) => (
                    <Box
                      key={index}
                      mb={2}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      <Input
                        className={classNames("c-full-width", "input", "mb-2")}
                        placeholder={t({
                          id: "iure9ce64-14ab-11ee-be56-0654549820002-quest",
                          message: "Answer",
                        })}
                        value={item}
                        onChange={e => {
                          setFieldValue(
                            "answers",
                            (taskData.values.answers as string)
                              .split(",")
                              .map((item: string, i: number) =>
                                i === index ? e.target.value : item,
                              )
                              .join(","),
                          );
                          if (e.target.value) {
                            setFieldError("answers", "");
                          }
                        }}
                        error={getError("answers").error}
                        errortext={getError("answers").errorText}
                        classnames={{ error: "error" }}
                        isDisabled={!isDraft}
                      />
                      {index !== 0 && (
                        <Icon
                          onClick={() => {
                            if (!isDraft) return;
                            setFieldValue(
                              "answers",
                              (taskData.values.answers as string)
                                .split(",")
                                .filter(
                                  (item: string, i: number) => i !== index,
                                )
                                .join(","),
                            );
                          }}
                          style={{ cursor: "pointer", marginLeft: 16 }}
                          name={"menu-close"}
                          size={"24"}
                        />
                      )}
                    </Box>
                  ))}
              </Box>
              <Box id={"maxAnswers"}>
                <Box className="c-font-16-22" mb={0.75}>
                  {t({
                    id: "cb79ce64-14ab-11ee-be56-0242ac120002-quest",
                  })}
                </Box>

                <NumberInput
                  className={classNames("c-full-width", "input", "numberInput")}
                  name={"maxAnswers"}
                  value={String(taskData.values.maxAnswers)}
                  onBlur={onBlur()}
                  onChange={onChange("number")}
                  error={getError("maxAnswers").error}
                  errortext={getError("maxAnswers").errorText}
                  classnames={{ error: "error" }}
                  setValue={data => setFieldValue("maxAnswers", data)}
                  isDisabled={!isDraft}
                />
              </Box>
            </Box>
            <Box position={"relative"} display={"inline-block"}>
              <Tooltip
                value={t({
                  id: "9356bnj-14dt-11ee-be56-0242ac1200fd-quest",
                  message: "You can’t add more than 5 answer options",
                })}
                hide={taskData.values.answers.split(",").length < 5}
              >
                <Button
                  disabled={
                    taskData.values.answers.split(",").length >= 5 || !isDraft
                  }
                  onClick={() => {
                    setFieldValue("answers", taskData.values.answers + ",");
                  }}
                  size={"medium"}
                  style={
                    taskData.values.answers.split(",").length >= 5
                      ? "checked"
                      : "secondary"
                  }
                >
                  {t({
                    id: "9dfdg-14dt-11ee-be5sad6-ertdgfk-quest",
                    message: "+ Answer Option",
                  })}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </>
      );
    }

    if (taskType.type === ELoyaltyTasks.JOIN_TELEGRAM) {
      return (
        <>
          <Box>
            <div>
              <span className={"c-font-16-22"} style={{ fontWeight: 500 }}>
                <Trans id={"xcnnvbkd8235adsiafs-quest"}>
                  Add AlphaGuilty support bot as an admin to your group or
                  channel.
                </Trans>
              </span>
              <Box
                display={"inline"}
                className={"c-pointer"}
                position={"relative"}
                sx={{
                  ".white-space_pre *": {
                    whiteSpace: "pre",
                  },
                }}
              >
                <Tooltip
                  className={"white-space_pre"}
                  value={t({
                    message: `1) Invite Bot To the Group or Channel
                            2) Give admin rights to the bot
                            3) Paste "/start" command in the group 
                            or if its Channel Paste "/verify" command
                            4) Copy the link of the group or channel 
                            and paste it in the field below`,
                    id: "nhdiw21bchjgAFYQR-quest",
                  })}
                >
                  <span
                    className={"c-font-16-22 c-font-color-3"}
                    style={{ fontWeight: 500 }}
                  >
                    {" "}
                    <Trans id={"sjdhwqiurq34-quest"}>How it works?</Trans>
                  </span>
                </Tooltip>
              </Box>
            </div>
            <Box my={2}>
              <a href={tgBotLink} target={"_blank"} rel={"noreferrer"}>
                <Button style={"secondary"}>
                  <Trans id={"nfiweitbasdrqw4234-quest"}>Invite bot</Trans>
                </Button>
              </a>
            </Box>
          </Box>
          {mainFieldsUI}
        </>
      );
    }

    return mainFieldsUI;
  };

  const selectedTab = taskData.values.selectedTab as string;
  const setSelectedTab = (value: string) => setFieldValue("selectedTab", value);

  const renderStatus = () => {
    if (!taskData.id)
      return (
        <Box mr={1} component="p" className="c-font-16-22 c-font-color-3">
          <Trans id="dBkTDJX7dCCEP9sdsdxaWEnF-quest">New</Trans>
        </Box>
      );

    return (
      <Box mr={1} className="c-font-16-22 c-font-color-4">
        <Trans id="3g4VYEmdUY8S6xVADPQSxb-quest">Edited</Trans>
      </Box>
    );
  };

  return (
    <Wrapper
      lightBorder={lightedBorder}
      id={`create-task-card_${taskData.taskType}_${index}`}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box display="flex" alignItems="center">
          <Box className="iconWrapper" mr={1}>
            <Icon name={icons[type]} size="30" />
          </Box>

          <Box component="h2" className="c-fw-500 c-font-20-24 c-font-color">
            {taskType.title}
          </Box>
        </Box>

        <Box display={"flex"} alignItems={"center"}>
          {renderStatus()}
          <Icon
            onClick={onClose}
            style={{ cursor: "pointer" }}
            name={"menu-close"}
            size={"24"}
          />
        </Box>
      </Box>

      {taskType.taskDescription && (
        <Box component={"ul"}>
          {taskType.taskDescription.map(({ text, dynamic }, index) => (
            <Box
              style={{ color: "rgba(255, 255, 255, 0.50)" }}
              key={index}
              className={"c-font-12-16"}
              component={"li"}
            >
              {dynamic ? getFormattedText({ text, taskData }) : text}
            </Box>
          ))}
        </Box>
      )}
      <Box></Box>
      {taskType.socialAlgorithm && (
        <Box
          component="ul"
          color="rgba(255, 255, 255, 0.5)"
          className="c-font-12-16"
          pl={2}
          m={0}
        >
          <Box component="li">
            <Trans id="xu5DmsBJeQsgfscVDHLFau-quest">
              Using Social Power Score Algorithm
            </Trans>
          </Box>
        </Box>
      )}

      <Box
        bgcolor="rgba(255, 255, 255, 0.1)"
        height="1px"
        width="100%"
        mt={2}
        mb={2}
      />

      {renderMainFields()}

      <Box display={"flex"} alignItems={"center"} mt={2} mb={2} width="100%">
        <p
          style={{ whiteSpace: "nowrap", color: "rgba(255, 255, 255, 0.50)" }}
          className={"c-font-16-22"}
        >
          Additional Options
        </p>
        <Box
          mx={2}
          bgcolor="rgba(255, 255, 255, 0.1)"
          height="1px"
          width="100%"
        />
      </Box>

      <Box>
        {taskType.type === ELoyaltyTasks.GIT_COIN && (
          <Box mb={2}>
            <Switcher
              open={!!taskData.values.gitCoinSwitcher}
              onChange={open => setFieldValue("gitCoinSwitcher", open)}
              label={t({
                message: "I want to use my own scorer",
                id: "sdjh-eifuoi-vndjfbh-8789-quest",
              })}
              toolTip={t({
                message: "You can use your own GitCoin with API Key scorer",
                id: "sjdg-23ivdbu3-wqrfk-koprh0qwnf-quest",
              })}
              isDisabled={!isDraft}
            />
          </Box>
        )}
        {taskType.additionalFields.map((item, index, arr) => {
          if (item.type === "number") {
            return (
              <Box mb={2.5} key={item.name}>
                <Box className="c-font-16-22" mb={0.75}>
                  {item.title}
                </Box>

                <NumberInput
                  className={classNames("c-full-width", "input", "numberInput")}
                  name={item.name}
                  value={String(taskData.values[item.name])}
                  onBlur={onBlur()}
                  onChange={onChange("number")}
                  error={getError(item.name).error}
                  errortext={getError(item.name).errorText}
                  classnames={{ error: "error" }}
                  setValue={data => setFieldValue(item.name, data)}
                  isDisabled={!isDraft}
                  min={1}
                  inputDisabled={item.name === "eventsQuantity"}
                  {...(item.name === "eventsQuantity" ? { max: 5 } : {})}
                />
              </Box>
            );
          }

          if (item.name === "description") {
            const computePlaceholder = () => {
              if (taskData.taskType === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER)
                return getFormattedText({
                  text: item.placeholder,
                  taskData,
                });
              return taskType.placeholder || item.placeholder;
            };

            return (
              <Box mb={2.5} key={item.name}>
                <Box className="c-font-16-22 c-font-color" mb={0.75}>
                  {item.title}
                </Box>

                <WYSIWYG
                  placeholder={computePlaceholder()}
                  name="description"
                  value={getFormattedText({
                    text: taskData.values.description,
                    taskData,
                  })}
                  onBlur={onBlur()}
                  onChange={value =>
                    setFieldValue(
                      "description",
                      getFormatOfText({ text: value, taskData }),
                    )
                  }
                  error={getError("description").error}
                  errorMessage={getError("description").errorText}
                  maxLength={1000}
                  setFieldError={error =>
                    setFieldError(
                      item.name,
                      error ? "Max length is 1000 characters" : null,
                    )
                  }
                />
              </Box>
            );
          }

          if (item.type === "selector" && item.selectorOptions) {
            const computeOptions = () => {
              if (taskData.taskType === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER) {
                return item.selectorOptions.filter(
                  chain => chain.value !== ENetworks.ZetaChain,
                );
              }
              return item.selectorOptions;
            };
            return (
              <Box mb={2.5} key={item.name}>
                <Box className="c-font-16-22" mb={0.75}>
                  {item.title}
                </Box>

                <Selector
                  className={classNames("c-full-width", "input")}
                  zIndex={arr.length - index}
                  options={computeOptions()}
                  value={String(taskData.values[item.name])}
                  onSelect={onSelectorChange(item.name)}
                  disabled={!isDraft}
                />
              </Box>
            );
          }

          if (
            !taskData.values.gitCoinSwitcher &&
            (item.name === "gitCoinApiKey" || item.name === "gitCoinScorerId")
          ) {
            return null;
          }
          return (
            <Box mb={2.5} key={item.name}>
              <Box className="c-font-16-22 c-font-color" mb={0.75}>
                {taskData.taskType === ELoyaltyTasks.TOKEN
                  ? getFormattedText({
                      text: item.title,
                      taskData,
                    })
                  : item.title}
              </Box>

              <Input
                className={classNames("c-full-width", "input")}
                placeholder={item.title}
                name={item.name}
                value={getFormattedText({
                  text: String(taskData.values[item.name]),
                  taskData,
                })}
                onBlur={onBlur(item.isTwitterUsername)}
                onChange={onChange("text")}
                error={getError(item.name).error}
                errortext={getError(item.name).errorText}
                classnames={{ error: "error" }}
                initiateChangeOnRender={item.name === "title"}
                isDisabled={item.name !== "title" && !isDraft}
              />
            </Box>
          );
        })}

        {taskType.type !== ELoyaltyTasks.INVITE ? (
          <Box mb={2.5}>
            <Box className="c-font-16-22" mb={0.75}>
              {taskType.type === ELoyaltyTasks.GIT_COIN ? (
                <Trans id={"sjdfh214781nwqh-qvbd32y41"}>Points</Trans>
              ) : (
                <Trans id="ihFCr2VHdhYLncoa38Yvv6-quest">
                  Rewards for Completion
                </Trans>
              )}
            </Box>

            <NumberInput
              className={classNames("c-full-width", "input", "numberInput")}
              name="points"
              value={String(taskData.values.points)}
              onBlur={onBlur()}
              onChange={onChange("number")}
              error={getError("points").error}
              errortext={getError("points").errorText}
              classnames={{ error: "error" }}
              setValue={data => setFieldValue("points", data)}
              isDisabled={!isDraft}
            />
          </Box>
        ) : (
          <Box mb={2.5} id={"scorePercentage"}>
            <Box className="c-font-16-22" mb={0.75}>
              <Trans id="18a40d90-19a1-11ee-be56-0242ac120002">
                % of the points
              </Trans>
            </Box>

            <NumberInput
              className={classNames("c-full-width", "input", "numberInput")}
              name="scorePercentage"
              value={String(taskData.values.scorePercentage) + "%"}
              onBlur={onBlur()}
              onChange={onChange("number")}
              error={getError("scorePercentage").error}
              errortext={getError("scorePercentage").errorText}
              classnames={{ error: "error" }}
              setValue={data => setFieldValue("scorePercentage", data)}
              percentage
              isDisabled={!isDraft}
            />
          </Box>
        )}


        <Box mb={2.5}>
          <Box className="c-font-16-22" mb={0.75}>
            <Trans id={"klfgmn-3kldfb-48ghd-dfvn"}>Sort Order</Trans>
          </Box>

          <NumberInput
            className={classNames("c-full-width", "input", "numberInput")}
            name="sortOrder"
            value={String(taskData.values.sortOrder || 0)}
            onBlur={onBlur()}
            onChange={onChange("number")}
            error={getError("sortOrder").error}
            errortext={getError("sortOrder").errorText}
            classnames={{ error: "error" }}
            setValue={data => setFieldValue("sortOrder", data)}
            isDisabled={!isDraft}
          />
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            gap: 2,
            ".inputWrapper.date": {
              width: "50%",
            },
            [`@media (max-width: ${CBreakpoints.md}px)`]: {
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              ".inputWrapper.date": {
                width: "100% !important",
                mr: 0,
              },
            },
          }}
        >
          <Box className="inputWrapper date">
            <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
              <Trans id="brCbKrhZTGq9G9KNpvadeD-quest">Start Date</Trans>
            </Box>
            <Input
              className={classNames("c-full-width", "input")}
              name="startAt"
              value={computeStartAt(taskData.values.startAt, currentQuest)}
              placeholder={""}
              onBlur={onBlur}
              onChange={onChange("date")}
              error={getError("startAt").error}
              errortext={getError("startAt").errorText}
              classnames={{ error: "error" }}
              type="datetime-local"
              clearbtn={false}
              isDisabled={!isDraft}
            />
          </Box>

          <Box className="inputWrapper date">
            <Box className="c-font-16-22 c-fw-500" component="p" mb={0.75}>
              <Trans id="oKUppZq9gKC7HMwfDYQP7n-quest">End Date</Trans>
            </Box>
            <Input
              className={classNames("c-full-width", "input")}
              name="endAt"
              value={computeEndAt(taskData.values.endAt, currentQuest)}
              placeholder={""}
              onBlur={onBlur}
              onChange={onChange("date")}
              error={getError("endAt").error}
              errortext={getError("endAt").errorText}
              classnames={{ error: "error" }}
              type="datetime-local"
              clearbtn={false}
              isDisabled={!isDraft}
            />
          </Box>
        </Box>
        <Box
          onClick={onSave}
          mt={4}
          sx={{
            button: {
              width: 200,
            },
          }}
        >
          <Button style={"primary"}>Save</Button>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default TaskCard;
