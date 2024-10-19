import { adminQuestService, contractService } from "@/api";
import { adminRewardService } from "@/api/services/admin/rewards";
import { useDebouncedEffect } from "@/hooks";
import {
  ERewardTabs,
  ETokenStandard,
  IContract,
  ICreateReward,
  ILoyaltyProjectFullReward,
  INft,
  IRewardPlacementItem,
  TCreateRewards,
  TVerifyNftRewardsResponse,
} from "@/models";
import {
  ECreateQuestSteps,
  EProjectType,
  EReward,
  ILoyaltyProject,
  QuestStatus,
} from "@/modules/quest/models";
import { CBreakpoints } from "@/styles/variables";
import { useMediaQuery } from "@mui/material";
import {
  clearTabs,
  copyReward,
  copyRewards,
  getCreateNftRewardData,
  getCreateTokenRewardData,
  getCreateWhitelistRewardData,
  getDefaultContract,
} from "../helpers/rewards";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ITaskFormData } from "@modules/quest/components/createQuestSteps/CreateTasksStep/CreateTasksStep";
import { t } from "@lingui/macro";
import { useRouter } from "next/router";

interface Props {
  currentQuest: ILoyaltyProject | null;
  setIsSuccessOpen: Dispatch<SetStateAction<boolean>>;
  setWrongStepPopupOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentQuest: Dispatch<SetStateAction<ILoyaltyProject>>;
  tasksData: ITaskFormData[];
  step: ECreateQuestSteps;
}

export interface ICreateRewardsHookData {
  rewards: TCreateRewards;
  addReward: () => void;
  deleteReward: (rewardId: number) => Promise<void>;
  luckyDrawUsersAmount: number;
  setLuckyDrawUsersAmount: Dispatch<SetStateAction<number>>;
  threshold: number;
  setThreshold: Dispatch<SetStateAction<number>>;
  setContractId: (rewardId: number, contractId: number) => void;
  setActiveTab: (rewardId: number, tab: ERewardTabs) => void;
  addRewardField: (rewardId: number) => void;
  removeLastRewardField: (rewardId: number) => void;
  partnerProjectLinkTitle: string;
  onRewardFieldEndPlaceChange: (data: {
    rewardId: number;
    rewardFieldIndex: number;
    endPlaceValue: string;
  }) => void;
  onRewardFieldAmountChange: (data: {
    rewardId: number;
    rewardFieldIndex: number;
    amountValue: string;
  }) => void;
  removeRewardFieldByIndex: (
    rewardId: number,
    rewardFieldIndex: number,
  ) => void;
  onLuckyDrawAmountChange: (
    rewardId: number,
    luckyDrawAmountValue: string,
  ) => void;
  setVerified: (rewardId: number, verified: boolean) => void;
  setRewardIds: (
    data: {
      id: number;
      rewardIds: number[];
    }[],
  ) => void;
  setWhitelistRewardIds: (data: { id: number; rewardId: number }[]) => void;
  onWhitelistNameChange: (rewardId: number, whitelistNameValue: string) => void;
  onWhitelistDescriptionChange: (
    rewardId: number,
    whitelistDescriptionValue: string,
  ) => void;
  onWhitelistEndPlaceChange: (
    rewardId: number,
    whitelistEndPlaceChange: string,
  ) => void;
  setNftImage: (rewardId: number, imageValue: File | null) => void;
  onNftNameChange: (rewardId: number, nftNameValue: string) => void;
  isSaveHidden: boolean;
  isNotMd: boolean;
  isDisabledAddNewReward: boolean;
  loading: boolean;
  onSaveClick: () => void;
  onSaveAsDraft: () => Promise<void>;
  popupOpen: boolean;
  setPopupOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  nftCollections: IContract[];
  tokenContracts: IContract[];
  rewardsLength: number;
  getNftCollections: () => Promise<void>;
  getTokensContracts: () => Promise<void>;
  questId: number;
  isLuckyDraw: boolean;
  setIsSuccessOpen: Dispatch<SetStateAction<boolean>>;
  currentQuest: ILoyaltyProject;
  computeAndSetLuckyDrawThresholdByTasksPoints: () => void;
  computePaddingBottomOfWrapper: () => number;
  computedDraftButtonName: string;
  setCurrentQuest: Dispatch<SetStateAction<ILoyaltyProject>>;
}

const MAX_REWARDS_LENGTH = 4;

export const useCreateRewards = ({
  currentQuest,
  setWrongStepPopupOpen,
  setIsSuccessOpen,
  setCurrentQuest,
  tasksData,
  step,
}: Props): ICreateRewardsHookData => {
  const { query } = useRouter();
  const partnerProjectLinkTitle = query.linkTitle as string;
  const [currentRewardId, setCurrentRewardId] = useState<number>(1);
  const [luckyDrawUsersAmount, setLuckyDrawUsersAmount] = useState<number>(10);
  const [threshold, setThreshold] = useState<number>(10);
  const [parsed, setParsed] = useState<boolean>(false);

  const [nftCollections, setNftCollections] = useState<IContract[]>([]);
  const [tokenContracts, setTokenContracts] = useState<IContract[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const getNftCollections = useCallback(async () => {
    try {
      await contractService.verifyContracts();

      const { data } = await contractService.getContracts([
        ETokenStandard.ERC721,
      ]);

      setNftCollections(data);
    } catch (error) {
      console.log("Nft collections", error);
    }
  }, []);

  const getTokensContracts = useCallback(async () => {
    try {
      const { data } = await contractService.getContracts([
        ETokenStandard.ERC20,
      ]);

      setTokenContracts(data);
    } catch (error) {
      console.log("Token contracts", error);
    }
  }, []);

  useEffect(() => {
    getNftCollections();
    getTokensContracts();
  }, [getNftCollections, getTokensContracts]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const initialToken = useMemo(
    () => ({
      rewards: [{ endPlace: 10, amount: 10 }],
      errors: [false],
      contractId: tokenContracts[0]?.id || null,
      luckyDrawAmount: 10,
    }),
    [tokenContracts],
  );

  const initialNft = useMemo(
    () => ({
      rewards: [{ endPlace: 10, amount: 10 }],
      errors: [false],
      contractId: nftCollections[0]?.id || null,
      image: null,
      name: "",
      nameError: "",
      luckyDrawAmount: 10,
    }),
    [nftCollections],
  );

  const initialWhitelist = useMemo(
    () => ({
      name: "",
      description: "",
      endPlace: 100,
      error: "",
    }),
    [],
  );

  const currentRewards = useMemo(
    () =>
      (
        currentQuest?.fullRewards as {
          rewards: ILoyaltyProjectFullReward[];
        }
      )?.rewards ||
      (currentQuest?.fullRewards as ILoyaltyProjectFullReward[]) ||
      [],
    [currentQuest?.fullRewards],
  );

  const initialLuckyDrawUsersAmount = useMemo(
    () => (currentQuest ? currentQuest?.eligibleUsersCount : 0),
    [currentQuest],
  );

  const initialThreshold = useMemo(
    () => (currentQuest ? currentQuest?.threshold : 0),
    [currentQuest],
  );

  const questId = useMemo(() => currentQuest?.id || null, [currentQuest?.id]);

  const createInitialReward = useCallback(
    (id: number): ICreateReward => ({
      id,
      activeTab: ERewardTabs.TOKEN,
      verified: false,
      token: initialToken,
      nft: initialNft,
      whitelist: initialWhitelist,
    }),
    [initialNft, initialToken, initialWhitelist],
  );

  const initialValue: TCreateRewards = useMemo(
    () => ({ [1]: createInitialReward(1) }),
    [createInitialReward],
  );

  const [rewards, setRewards] = useState<TCreateRewards>(initialValue);

  const parseInitialRewards = useCallback(async () => {
    if (parsed || !currentRewards?.length) return;
    setParsed(true);

    if (currentRewards?.length) {
      let verificationData: TVerifyNftRewardsResponse | null = null;

      try {
        const { data } = await adminRewardService.verifyRewards(questId);
        verificationData = data;
      } catch (error) {
        console.log("verify rewards error", error);
      }

      let rewardId: number = 1;
      const newRewards: TCreateRewards = {};

      const sortedRewards = currentRewards.sort(
        (a, b) => a.endPlace - b.endPlace,
      );

      const verifiedRewards = sortedRewards.map(rewardItem => ({
        ...rewardItem,
        verified:
          rewardItem.verified ||
          verificationData?.[rewardItem.contract.chainId]?.find(
            verificationDataItem =>
              verificationDataItem.rewardId === rewardItem.id,
          )?.isVerified,
      }));

      for (const reward of verifiedRewards) {
        if (reward.tokenType === EReward.TOKEN) {
          const boundRewardItem = Object.values(newRewards).find(item => {
            const lastRewardFieldItem =
              item.token.rewards[item.token.rewards.length - 1];

            return (
              lastRewardFieldItem.endPlace === reward.startPlace - 1 &&
              reward.contractId === item.token.contractId &&
              reward.verified === item.verified
            );
          });

          if (boundRewardItem) {
            newRewards[boundRewardItem.id].token.rewards.push({
              id: reward.id,
              endPlace: reward.endPlace,
              amount: reward.amount,
            });
            newRewards[boundRewardItem.id].token.errors.push(false);
          } else {
            rewardId = rewardId + 1;

            const newReward: ICreateReward = {
              id: rewardId,
              activeTab: ERewardTabs.TOKEN,
              verified: reward.verified,
              token: {
                rewards: [
                  {
                    id: reward.id,
                    endPlace: reward.endPlace,
                    amount: reward.amount,
                  },
                ],
                errors: [false],
                contractId: reward.contractId,
                luckyDrawAmount: reward.amount,
                luckyDrawRewardId: reward.id,
              },
              nft: initialNft,
              whitelist: initialWhitelist,
            };

            newRewards[rewardId] = newReward;
          }
          continue;
        }

        if (reward.tokenType === EReward.NFT) {
          let rewardNftMetadata: INft | null = null;

          try {
            const res = await adminRewardService.getNftMetadata(
              reward.contractId,
              reward.tokenIds[0],
            );

            rewardNftMetadata = res.data || null;
          } catch (error) {
            console.log(
              "get nft metadata error",
              reward.tokenIds[0],
              reward.contractId,
              error,
            );
            continue;
          }

          const boundRewardItem = Object.values(newRewards).find(item => {
            const lastRewardFieldItem =
              item.nft.rewards[item.nft.rewards.length - 1];

            return (
              lastRewardFieldItem.endPlace === reward.startPlace - 1 &&
              reward.contractId === item.nft.contractId &&
              reward.verified === item.verified &&
              item.nft.image === rewardNftMetadata.image
            );
          });

          if (boundRewardItem) {
            newRewards[boundRewardItem.id].nft.rewards.push({
              id: reward.id,
              amount: reward.amount,
              endPlace: reward.endPlace,
            });
            newRewards[boundRewardItem.id].nft.errors.push(false);
          } else {
            rewardId = rewardId + 1;

            const newReward: ICreateReward = {
              id: rewardId,
              activeTab: ERewardTabs.NFT,
              verified: reward.verified,
              token: initialToken,
              nft: {
                rewards: [
                  {
                    id: reward.id,
                    amount: reward.amount,
                    endPlace: reward.endPlace,
                  },
                ],
                errors: [false],
                contractId: reward.contractId,
                image: rewardNftMetadata.image,
                name: rewardNftMetadata.name,
                nameError: "",
                luckyDrawAmount: reward.amount,
                luckyDrawRewardId: reward.id,
              },
              whitelist: initialWhitelist,
            };

            newRewards[rewardId] = newReward;
          }

          continue;
        }

        if (reward.tokenType === EReward.WHITELIST) {
          rewardId = rewardId + 1;

          const newReward: ICreateReward = {
            id: rewardId,
            activeTab: ERewardTabs.WHITELIST,
            verified: reward.verified,
            token: initialToken,
            nft: initialNft,
            whitelist: {
              rewardId: reward.id,
              name: reward.contract.name,
              description: reward.description,
              endPlace: reward.endPlace,
              error: "",
            },
          };

          newRewards[rewardId] = newReward;
        }
      }

      setRewards(newRewards);
      setCurrentRewardId(rewardId);
    }
    if (initialThreshold) {
      setThreshold(initialThreshold);
    }
    if (initialLuckyDrawUsersAmount) {
      setLuckyDrawUsersAmount(initialLuckyDrawUsersAmount);
    }
  }, [
    currentRewards,
    initialLuckyDrawUsersAmount,
    initialNft,
    initialThreshold,
    initialToken,
    initialWhitelist,
    questId,
    parsed,
  ]);

  useDebouncedEffect(
    () => {
      parseInitialRewards();
    },
    { ignoreInitialCall: true, timeout: 500 },
    [parseInitialRewards],
  );

  const setActiveTab = useCallback((rewardId: number, tab: ERewardTabs) => {
    setRewards(prev => {
      const newReward = copyReward(prev[rewardId]);

      if (newReward.activeTab === ERewardTabs.WHITELIST) {
        newReward.verified = false;
      }

      if (tab === ERewardTabs.WHITELIST && newReward.whitelist.rewardId) {
        newReward.verified = true;
      }

      newReward.activeTab = tab;

      return {
        ...prev,
        [rewardId]: newReward,
      };
    });
  }, []);

  const addReward = useCallback(() => {
    const rewardId = currentRewardId + 1;

    const newReward = createInitialReward(rewardId);

    setRewards(prev => ({ ...prev, [rewardId]: newReward }));

    setCurrentRewardId(prev => prev + 1);
  }, [createInitialReward, currentRewardId]);

  const deleteReward = useCallback(
    async (rewardId: number) => {
      const reward = rewards[rewardId];

      try {
        if (
          reward.activeTab === ERewardTabs.WHITELIST &&
          reward.whitelist.rewardId
        ) {
          await adminRewardService.deleteReward(reward.whitelist.rewardId);
        }
        if (
          reward.activeTab === ERewardTabs.NFT ||
          reward.activeTab === ERewardTabs.TOKEN
        ) {
          const tokens = reward[reward.activeTab].rewards;

          for (const item of tokens) {
            if (item.id) {
              await adminRewardService.deleteReward(item.id);
            }
          }
        }
      } catch (error) {
        return;
      }

      setRewards(prev => {
        const newRewards = copyRewards(prev);

        delete newRewards[rewardId];

        return newRewards;
      });
    },
    [rewards],
  );

  const setContractId = useCallback((rewardId: number, contractId: number) => {
    setRewards(prev => {
      if (!prev[rewardId]) return { ...prev };

      const newReward = copyReward(prev[rewardId]);

      if (newReward.activeTab === ERewardTabs.WHITELIST) return { ...prev };

      newReward[newReward.activeTab].contractId = contractId;

      return {
        ...prev,
        [rewardId]: newReward,
      };
    });
  }, []);

  const addRewardField = useCallback((rewardId: number) => {
    let added = false;
    setRewards(prev => {
      if (!prev[rewardId]) return { ...prev };

      const newReward = copyReward(prev[rewardId]);

      if (newReward.activeTab === ERewardTabs.WHITELIST || added)
        return { ...prev };

      const newRewardFields = [...newReward[newReward.activeTab].rewards];
      newRewardFields.push({
        amount: 0,
        endPlace: newRewardFields[newRewardFields.length - 1].endPlace + 10,
      });

      const newRewardErrors = [...newReward[newReward.activeTab].errors];
      newRewardErrors.push(false);

      newReward[newReward.activeTab].rewards = newRewardFields;
      newReward[newReward.activeTab].errors = newRewardErrors;

      added = true;

      return {
        ...prev,
        [rewardId]: newReward,
      };
    });
  }, []);

  const removeLastRewardField = useCallback((rewardId: number) => {
    let removed = false;
    setRewards(prev => {
      if (!prev[rewardId]) return { ...prev };

      const newReward = copyReward(prev[rewardId]);

      if (newReward.activeTab === ERewardTabs.WHITELIST || removed)
        return { ...prev };

      const newRewardFields = [...newReward[newReward.activeTab].rewards];
      newRewardFields.pop();

      const newRewardErrors = [...newReward[newReward.activeTab].errors];
      newRewardErrors.pop();

      newReward[newReward.activeTab].rewards = newRewardFields;
      newReward[newReward.activeTab].errors = newRewardErrors;

      removed = true;

      return {
        ...prev,
        [rewardId]: newReward,
      };
    });
  }, []);

  const onRewardFieldEndPlaceChange = useCallback(
    ({
      rewardId,
      rewardFieldIndex,
      endPlaceValue,
    }: {
      rewardId: number;
      rewardFieldIndex: number;
      endPlaceValue: string;
    }) => {
      if (isNaN(Number(endPlaceValue)) || Number(endPlaceValue) < 0) {
        return;
      }

      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        if (newReward.activeTab === ERewardTabs.WHITELIST) return { ...prev };

        const prevRewardFields = [...newReward[newReward.activeTab].rewards];
        const newRewardErrors = [...newReward[newReward.activeTab].errors];

        const isInvalid =
          Number(endPlaceValue) <
          (prevRewardFields[rewardFieldIndex - 1]?.endPlace || 0) + 1;

        if (isInvalid) {
          newRewardErrors[rewardFieldIndex] = true;
        } else {
          newRewardErrors[rewardFieldIndex] = false;
        }

        const newRewardFields = prevRewardFields.reduce(
          (acc, rewardItem, rewardIndex) => {
            if (rewardIndex < rewardFieldIndex) {
              return [...acc, rewardItem];
            }
            if (rewardIndex === rewardFieldIndex) {
              return [
                ...acc,
                {
                  ...rewardItem,
                  endPlace: Number(endPlaceValue),
                },
              ];
            }
            if (
              rewardItem.endPlace <
              (acc[rewardIndex - 1]?.endPlace || 0) + 1
            ) {
              return [
                ...acc,
                {
                  ...rewardItem,
                  endPlace: (acc[rewardIndex - 1]?.endPlace || 0) + 10,
                },
              ];
            }

            return [...acc, rewardItem];
          },
          [] as IRewardPlacementItem[],
        );

        newReward[newReward.activeTab].rewards = newRewardFields;
        newReward[newReward.activeTab].errors = newRewardErrors;

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const onRewardFieldAmountChange = useCallback(
    ({
      rewardId,
      rewardFieldIndex,
      amountValue,
    }: {
      rewardId: number;
      rewardFieldIndex: number;
      amountValue: string;
    }) => {
      if (isNaN(Number(amountValue))) {
        return;
      }

      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        if (newReward.activeTab === ERewardTabs.WHITELIST) return { ...prev };

        const newRewardFields = [...newReward[newReward.activeTab].rewards];
        newRewardFields[rewardFieldIndex].amount = Number(amountValue);

        newReward[newReward.activeTab].rewards = newRewardFields;

        return {
          ...prev,
          [rewardId]: newReward,
        };
      });
    },
    [],
  );

  const removeRewardFieldByIndex = useCallback(
    (rewardId: number, rewardFieldIndex: number) => {
      let removed = false;
      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        if (newReward.activeTab === ERewardTabs.WHITELIST || removed)
          return { ...prev };

        const prevRewardFields = [...newReward[newReward.activeTab].rewards];
        const prevRewardErrors = [...newReward[newReward.activeTab].errors];

        const newRewardFields = prevRewardFields.reduce(
          (acc, rewardItem, rewardIndex) => {
            if (rewardIndex < rewardFieldIndex) {
              return [...acc, rewardItem];
            }
            if (rewardIndex === rewardFieldIndex) {
              return [...acc];
            }
            if (
              rewardItem.endPlace <
              (acc[rewardIndex - 1]?.endPlace || 0) + 1
            ) {
              return [
                ...acc,
                {
                  ...rewardItem,
                  endPlace: (acc[rewardIndex - 1]?.endPlace || 0) + 10,
                },
              ];
            }

            return [...acc, rewardItem];
          },
          [] as IRewardPlacementItem[],
        );

        const newRewardErrors = prevRewardErrors.reduce(
          (errorsAcc, errorsItem, errorsIndex) => {
            if (rewardFieldIndex === errorsIndex) {
              return errorsAcc;
            }
            return [...errorsAcc, errorsItem];
          },
          [],
        );

        newReward[newReward.activeTab].rewards = newRewardFields;
        newReward[newReward.activeTab].errors = newRewardErrors;

        removed = true;

        return {
          ...prev,
          [rewardId]: newReward,
        };
      });
    },
    [],
  );

  const onLuckyDrawAmountChange = useCallback(
    (rewardId: number, luckyDrawAmountValue: string) => {
      if (
        isNaN(Number(luckyDrawAmountValue)) ||
        Number(luckyDrawAmountValue) < 1
      ) {
        return;
      }

      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        if (newReward.activeTab === ERewardTabs.WHITELIST) return { ...prev };

        newReward[newReward.activeTab].luckyDrawAmount =
          Number(luckyDrawAmountValue);

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const setVerified = useCallback((rewardId: number, verified: boolean) => {
    setRewards(prev => {
      if (!prev[rewardId]) return { ...prev };

      const newReward = copyReward(prev[rewardId]);

      newReward.verified = verified;

      return { ...prev, [rewardId]: newReward };
    });
  }, []);

  const setRewardIds = useCallback(
    (data: { id: number; rewardIds: number[] }[]) => {
      setRewards(prev => {
        const newRewards = copyRewards(prev);

        data.forEach(dataItem => {
          if (!prev[dataItem.id]) return { ...prev };

          const rewardItem = copyReward(prev[dataItem.id]);

          if (rewardItem.activeTab === ERewardTabs.WHITELIST) return;

          const newRewardFields: IRewardPlacementItem[] = rewardItem[
            rewardItem.activeTab
          ].rewards.map((rewardFieldItem, index) => ({
            ...rewardFieldItem,
            id: dataItem.rewardIds[index] || rewardFieldItem.id,
          }));

          newRewards[dataItem.id] = {
            ...rewardItem,
            [rewardItem.activeTab]: {
              ...rewardItem[rewardItem.activeTab],
              rewards: newRewardFields,
              luckyDrawRewardId:
                dataItem.rewardIds[0] ||
                newRewards[dataItem.id][rewardItem.activeTab].luckyDrawRewardId,
            },
          };
        });

        return { ...prev, ...newRewards };
      });
    },
    [],
  );

  const setWhitelistRewardIds = useCallback(
    (data: { id: number; rewardId: number }[]) => {
      setRewards(prev => {
        const newRewards = copyRewards(prev);

        data.forEach(dataItem => {
          if (!prev[dataItem.id]) return { ...prev };

          const rewardItem = copyReward(prev[dataItem.id]);

          if (rewardItem.activeTab !== ERewardTabs.WHITELIST) return;

          newRewards[dataItem.id] = {
            ...rewardItem,
            whitelist: {
              ...rewardItem.whitelist,
              rewardId: dataItem.rewardId,
            },
          };
        });

        return { ...prev, ...newRewards };
      });
    },
    [],
  );

  const onWhitelistNameChange = useCallback(
    (rewardId: number, whitelistNameValue: string) => {
      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        newReward.whitelist.name = whitelistNameValue;

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const onWhitelistDescriptionChange = useCallback(
    (rewardId: number, whitelistDescriptionValue: string) => {
      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        newReward.whitelist.description = whitelistDescriptionValue;

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const onWhitelistEndPlaceChange = useCallback(
    (rewardId: number, whitelistEndPlaceChange: string) => {
      if (
        isNaN(Number(whitelistEndPlaceChange)) ||
        Number(whitelistEndPlaceChange) < 0
      ) {
        return;
      }

      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        const isInvalid = Number(whitelistEndPlaceChange) <= 1;

        if (isInvalid) {
          newReward.whitelist.error = '"Place to" must be greater than 1';
        } else {
          newReward.whitelist.error = "";
        }

        newReward.whitelist.endPlace = Number(whitelistEndPlaceChange);

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const setNftImage = useCallback(
    (rewardId: number, imageValue: File | null) => {
      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        newReward.nft.image = imageValue;

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const onNftNameChange = useCallback(
    (rewardId: number, nftNameValue: string) => {
      setRewards(prev => {
        if (!prev[rewardId]) return { ...prev };

        const newReward = copyReward(prev[rewardId]);

        const name = nftNameValue.trim();

        newReward.nft.name = name;

        if (!name) {
          newReward.nft.nameError = "Name is required";
        } else if (name.length > 25) {
          newReward.nft.nameError = "Max length is 25 characters";
        } else {
          newReward.nft.nameError = "";
        }

        return { ...prev, [rewardId]: newReward };
      });
    },
    [],
  );

  const computeAndSetLuckyDrawThresholdByTasksPoints = useCallback(() => {
    const sumOfPoints = tasksData.reduce(
      (acc, currentValue) => acc + currentValue.values.points,
      0,
    );
    setThreshold(sumOfPoints || 0);
  }, [tasksData]);
  const isNotMd = useMediaQuery(`(max-width: ${CBreakpoints}px)`);

  const rewardsLength = useMemo(() => Object.keys(rewards).length, [rewards]);

  const isDisabledAddNewReward = useMemo(() => {
    if (!currentQuest) return true;
    if (currentQuest.questStatus !== QuestStatus.Draft) return true;
    return rewardsLength >= MAX_REWARDS_LENGTH;
  }, [rewardsLength, currentQuest]);

  const isSaveHidden = useMemo(
    () => !Object.keys(rewards).length || !tasksData.length,
    [rewards, tasksData],
  );

  const isLuckyDraw = useMemo(
    () => currentQuest?.projectType === EProjectType.LuckyDraw,
    [currentQuest?.projectType],
  );

  const onSaveAsDraft = useCallback(async () => {
    if (!questId) return;

    setLoading(true);

    for (const reward of Object.values(rewards)) {
      const defaultContract = getDefaultContract({
        reward,
        tokenContracts,
        nftCollections,
      });

      await clearTabs(reward);

      if (reward.activeTab === ERewardTabs.TOKEN) {
        const data = getCreateTokenRewardData({
          reward,
          isLuckyDraw,
          luckyDrawUsersAmount,
          contractId: defaultContract.id,
          questId,
          isDraft: true,
        });

        try {
          const {
            data: { rewardIds_ },
          } = await adminRewardService.createTokenRewards(data);

          setRewardIds([{ id: reward.id, rewardIds: rewardIds_ }]);
        } catch (error) {
          console.log("save token rewards error");
        }
      }

      if (reward.activeTab === ERewardTabs.NFT) {
        const data = getCreateNftRewardData({
          reward,
          isLuckyDraw,
          luckyDrawUsersAmount,
          contractId: defaultContract.id,
          questId,
          isDraft: true,
        });

        try {
          const {
            data: { rewardIds_ },
          } = await adminRewardService.createNftReward(
            typeof reward.nft.image === "string"
              ? { ...data, image: reward.nft.image }
              : data,
            reward.nft.image as File,
          );

          console.log("here", [{ id: reward.id, rewardIds: rewardIds_ }]);

          setRewardIds([{ id: reward.id, rewardIds: rewardIds_ }]);
        } catch (error) {
          console.log("save nft rewards error");
        }
      }
    }

    const data = getCreateWhitelistRewardData({
      rewards: Object.values(rewards),
      questId,
    });

    if (data.data.length) {
      try {
        const { data: whitelistsData } =
          await adminRewardService.createWhitelistRewards(data.data);

        setWhitelistRewardIds(
          data.ids.map((item, index) => ({
            id: item,
            rewardId: whitelistsData[index]?.id,
          })),
        );
      } catch (error) {
        console.log("save whitelist rewards error");
      }
    }

    setLoading(false);
  }, [
    isLuckyDraw,
    luckyDrawUsersAmount,
    nftCollections,
    questId,
    rewards,
    setRewardIds,
    setWhitelistRewardIds,
    tokenContracts,
  ]);

  const onSaveClick = useCallback(async () => {
    if (!currentQuest) {
      setWrongStepPopupOpen(true);
      return;
    }

    if (
      !Object.values(rewards).filter(
        item => !item.verified || item.activeTab === ERewardTabs.WHITELIST,
      ).length
    ) {
      setLoading(false);
      setIsSuccessOpen(true);

      try {
        setLoading(true);
        const { data: newCurrentQuest } = await adminQuestService.updateQuest(
          {
            eligibleUsersCount: luckyDrawUsersAmount,
            threshold,
            questStatus: QuestStatus.Active,
          },
          currentQuest.linkTitle,
        );
        setCurrentQuest(newCurrentQuest);
      } catch (error) {
        console.log("save quest error", error);
      }

      return;
    }

    // await onSaveAsDraft();

    try {
      setLoading(true);
      const { data: newCurrentQuest } = await adminQuestService.updateQuest(
        {
          eligibleUsersCount: luckyDrawUsersAmount,
          threshold,
          questStatus: QuestStatus.Active,
        },
        currentQuest.linkTitle,
      );
      setCurrentQuest(newCurrentQuest);
    } catch (error) {
      console.log("save quest error", error);
    }

    setParsed(true);
    // setPopupOpen(true);
  }, [
    currentQuest,
    luckyDrawUsersAmount,
    onSaveAsDraft,
    rewards,
    setCurrentQuest,
    setIsSuccessOpen,
    setWrongStepPopupOpen,
    threshold,
  ]);

  const computePaddingBottomOfWrapper = useCallback(() => {
    if (
      step === ECreateQuestSteps.Rewards &&
      tasksData.length !== 0 &&
      Object.keys(rewards).length < 2
    )
      return 45; // MUI paddings
    return 5;
  }, [tasksData, rewards, step]);

  // “You must add at least one task. Until then, you can save the quest as a draft.”
  // “You must add at least one reward. Until then, you can save the quest as a draft.”
  // “You must add at least one task and one reward. Until then, you can save the quest as a draft.”
  const computedDraftButtonName = useMemo(() => {
    if (!tasksData.length && !Object.keys(rewards).length)
      return t({
        id: "sdjghu34t-sdvnw-32n",
        message:
          "You must add at least one task and one reward. Until then, you can save the quest as a draft.",
      });

    if (!tasksData.length)
      return t({
        id: "swuebwdbvj-43jksdnv-zdv",
        message:
          "You must add at least one task. Until then, you can save the quest as a draft.",
      });

    if (Object.keys(rewards).length)
      return t({
        id: "xwuebwdbvj-43jksdnv-zdv",
        message:
          "You must add at least one reward. Until then, you can save the quest as a draft.",
      });
  }, [rewards, tasksData]);

  return {
    rewards,
    addReward,
    deleteReward,
    luckyDrawUsersAmount,
    setLuckyDrawUsersAmount,
    threshold,
    setThreshold,
    setContractId,
    setActiveTab,
    addRewardField,
    removeLastRewardField,
    onRewardFieldEndPlaceChange,
    onRewardFieldAmountChange,
    removeRewardFieldByIndex,
    onLuckyDrawAmountChange,
    setVerified,
    setRewardIds,
    setWhitelistRewardIds,
    onWhitelistNameChange,
    onWhitelistDescriptionChange,
    onWhitelistEndPlaceChange,
    setNftImage,
    onNftNameChange,
    isSaveHidden,
    isNotMd,
    isDisabledAddNewReward,
    loading,
    onSaveClick,
    onSaveAsDraft,
    popupOpen,
    setPopupOpen,
    setLoading,
    nftCollections,
    tokenContracts,
    rewardsLength,
    getNftCollections,
    getTokensContracts,
    questId,
    isLuckyDraw,
    setIsSuccessOpen,
    currentQuest,
    computeAndSetLuckyDrawThresholdByTasksPoints,
    computePaddingBottomOfWrapper,
    computedDraftButtonName,
    setCurrentQuest,
    partnerProjectLinkTitle,
  };
};
