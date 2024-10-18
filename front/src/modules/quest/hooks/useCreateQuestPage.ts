import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ECreateQuestSteps,
  EProjectType,
  EQuestAdminStep,
  ILoyaltyProject,
  IQuestForPreview,
  QuestRewards,
  QuestStatus,
} from "../models";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountState,
  getCurrentPartnerProject,
  getPartnerProject,
} from "@/modules/account/store/account.selector";
import { getPreviewOpen } from "@/store/slices/system/system.selector";
import { ELoyaltyTasks, ILoyaltyTask } from "@/models";
import { ITaskFormData } from "../components/createQuestSteps/CreateTasksStep/CreateTasksStep";
import {
  setIsAdminCreatePageOpened,
  setIsAdminPanelOpened,
  setPartnerProjectSettingsLinkTitle,
} from "@/store/slices/system/system.slice";
import { adminQuestService, loyaltyService } from "@/api";
import {
  getDefaultValue,
  getEndDate,
  getFormattedText,
  getStartDate,
} from "../helpers/tasks";
import { useTaskTypes } from "./useTaskTypes";
import { Theme, useMediaQuery } from "@mui/material";
import { CBreakpoints } from "@/styles/variables";
import { SetupStepFormFields } from "./useSetupStep";
import { getPrevLocation } from "@store/slices/analytics/analytics.selector";

export const useCreateQuestPage = () => {
  const { query, push, pathname, beforePopState } = useRouter();
  const {
    quest,
    step: queryStep,
    linkTitle: partnerLinkTitle,
  } = query as {
    quest?: string;
    step?: any;
    linkTitle?: string;
  };

  const [step, setStep] = useState<ECreateQuestSteps>(ECreateQuestSteps.Setup);
  const [questInited, setQuestInited] = useState<boolean>(false);
  const [adminStep, setStepAdmin] = useState<EQuestAdminStep>(
    pathname === EQuestAdminStep.edit
      ? EQuestAdminStep.edit
      : EQuestAdminStep.create,
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
  const [backStep, setBackStep] = useState<ECreateQuestSteps | null>(null);
  const [wrongStepPopupOpen, setWrongStepPopupOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { accountInfo, isPartnerProjectsLoaded } =
    useTypedSelector(getAccountState);
  const project = useTypedSelector(
    getPartnerProject(partnerLinkTitle as string),
  );

  const previewOpen = useTypedSelector(getPreviewOpen);

  const [currentQuest, setCurrentQuest] = useState<ILoyaltyProject | null>(
    null,
  );

  const [currentQuestForPreview, setCurrentQuestForPreview] =
    useState<IQuestForPreview | null>(currentQuest);

  const [selectedTaskTypes, setSelectedTaskTypes] = useState<ELoyaltyTasks[]>(
    [],
  );
  const [tasksData, setTasksData] = useState<ITaskFormData[]>([]);

  const [shouldSave, setShouldSave] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const [settings, setSettings] = useState<{
    limit: number;
    tgBotLink: string;
    questsCount: number;
  }>(null);

  const id = useMemo(() => project?.linkTitle as string, [project?.linkTitle]);

  const setQueryStep = useCallback(
    (step: ECreateQuestSteps) =>
      push(
        `/admin/project/${partnerLinkTitle}/quest/${
          !!quest
            ? `${quest}/${
                adminStep === EQuestAdminStep.create ? "create" : "edit"
              }`
            : "create"
        }/${step}`,
      ),
    [quest, push],
  );

  useEffect(() => {
    if (queryStep !== step && queryStep !== "init") {
      const newStep =
        !queryStep || !Object.values(ECreateQuestSteps).includes(queryStep)
          ? ECreateQuestSteps.Setup
          : queryStep;

      setStep(newStep);
      setQueryStep(newStep);
    }
  }, [queryStep, setQueryStep, step]);

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsAdminCreatePageOpened(true));

    return () => {
      dispatch(setIsAdminCreatePageOpened(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (accountInfo?.connected === null || !isPartnerProjectsLoaded || !id)
      return;

    if (!accountInfo?.connected || !project) {
      push("/");
    }

    return () => {
      if (!accountInfo?.connected || !project) {
        push("/");
      }
    };
  }, [accountInfo?.connected, push, isPartnerProjectsLoaded, id]);

  useEffect(() => {
    dispatch(setPartnerProjectSettingsLinkTitle(id));

    return () => {
      dispatch(setPartnerProjectSettingsLinkTitle(null));
    };
  }, [id, dispatch]);

  const getCurrentQuestInfo = useCallback(async () => {
    try {
      const { data: result } = await loyaltyService.getLoyaltyProjectData(
        quest,
      );
      setCurrentQuest(result);
      setCurrentQuestForPreview(result);
    } catch (error) {
      console.log("Error", error);
    }
  }, [quest]);

  useEffect(() => {
    if (quest) {
      getCurrentQuestInfo();
    }
  }, [quest, getCurrentQuestInfo]);

  const prevLocation: string = useTypedSelector(getPrevLocation);

  const isPrevStepQuestCreatePage = () =>
    prevLocation ? prevLocation.endsWith("create/setup") : true;
  const hasAdminQuestServiceBeenCalled = useRef(false);

  useEffect(() => {
    if (
      pathname === EQuestAdminStep.init &&
      query.step === "init" &&
      project &&
      !isPrevStepQuestCreatePage() &&
      !questInited &&
      !hasAdminQuestServiceBeenCalled.current
    ) {
      const title = project.name;
      const linkTitle = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]+/g, "");
      hasAdminQuestServiceBeenCalled.current = true;

      adminQuestService
        .createQuest({
          partnerLinkTitle: project.linkTitle,
          socialDescription: project.socialDescription,
          title,
          previewImage: null,
          projectType: questType,
          projectName: title,
          description: "",
          linkTitle: linkTitle.toLowerCase(),
          startAt: getStartDate(new Date()).toISOString(),
          endAt: getEndDate(new Date()).toISOString(),
          questStatus: QuestStatus.Draft,
        })
        .then(res => {
          push(
            `/admin/project/${partnerLinkTitle}/quest/${res.data.linkTitle}/create/setup`,
          ).then(() => {
            setQuestInited(true);
            setStepAdmin(EQuestAdminStep.create);
          });
        });
    }
  }, [pathname, project, questInited, prevLocation]);

  useEffect(() => {
    beforePopState(({ as: newPath }) => {
      if (newPath.endsWith("init")) {
        push(`/admin/project/${partnerLinkTitle}`);

        return false;
      }

      return true;
    });

    return () => {
      beforePopState(() => true);
    };
  }, [beforePopState, partnerLinkTitle, push]);

  const partnerProjects = useTypedSelector(getCurrentPartnerProject);

  const [questType, setQuestType] = useState<EProjectType>(
    EProjectType.Scoreboard,
  );

  const [showPreview, setShowPreview] = useState(false);

  const setQuestRewardsForPreview = (quest: ILoyaltyProject) => {
    const computeRewards = () => {
      if (quest && quest.fullRewards) {
        return Array.isArray((quest.fullRewards as any).rewards)
          ? (quest.fullRewards as any).rewards
          : quest.fullRewards;
      }
      return [
        {
          amount: "-",
          isClaimable: true,
          description: "",
          startPlace: 0,
          endPlace: 0,
          loyaltyProjectId: 0,
          contractId: 0,
          tokenType: "token",
          rewards: [],
          contract: {
            symbol: "",
            amount: 0,
            logo: "",
            type: "token",
          },
        } as QuestRewards,
      ];
    };

    setCurrentQuestForPreview(prevState => ({
      ...prevState,
      fullRewards: {
        rewards: computeRewards(),
      },
    }));
  };

  useEffect(() => {
    setCurrentQuestForPreview(prevState => {
      const computeRewards = () => {
        if (prevState && prevState.fullRewards) {
          return Array.isArray((prevState.fullRewards as any).rewards)
            ? (prevState.fullRewards as any).rewards
            : prevState.fullRewards;
        }
        return [
          {
            amount: "-",
            isClaimable: true,
            description: "",
            startPlace: 0,
            endPlace: 0,
            loyaltyProjectId: 0,
            contractId: 0,
            tokenType: "token",
            rewards: [],
            contract: {
              symbol: "",
              amount: 0,
              logo: "",
              type: "token",
            },
          } as QuestRewards,
        ];
      };

      const computeSocialDescription = (value: IQuestForPreview) => {
        if (!value) return ":abbr[]";
        if (value.socialDescription !== ":abbr[]")
          return value.socialDescription;
        return partnerProjects
          ? partnerProjects.socialDescription
          : value.socialDescription;
      };

      return {
        ...prevState,
        rewards:
          prevState && prevState.rewards
            ? prevState.rewards
            : {
                tokens: [],
                whitelisting: false,
              },
        partnerProjects:
          prevState && prevState.partnerProjects
            ? prevState.partnerProjects
            : partnerProjects
            ? [partnerProjects]
            : [],
        title: prevState && prevState.title ? prevState.title : "",
        description:
          prevState && prevState.description
            ? prevState.description
            : "Description",
        fullRewards: {
          rewards: computeRewards(),
        },
        projectType:
          prevState && prevState.projectType
            ? prevState.projectType
            : EProjectType.Scoreboard,
        loyaltyTasks: tasksData.map(item => {
          const currentTask = prevState.loyaltyTasks.find(
            task => task.id === item.id,
          );
          return {
            id: item.id,
            title: getFormattedText({
              text: item.values.title,
              taskData: item,
            }),
            type: item.taskType,
            startAt: item.values.startAt,
            endAt: item.values.endAt,
            status: "active",
            multipleStatus: "active",
            sortOrder: currentTask ? currentTask.sortOrder : 0,
            body: {
              description: item.values.description
                ? getFormattedText({
                    text: item.values.description,
                    taskData: item,
                  })
                : null,
              chainId: item.values.chainId,
            },
            required: currentTask ? currentTask.required : false,
            points: item.values.points,
          } as any;
        }),
        projectInvestorInfo: {
          earnedPoints: 0,
          claimingTransactions: {},
          isAqClaimed: false,
          scoreboard: {
            rewardsTable: [
              {
                place: "1",
                placeRewards: "",
                startPlace: 1,
                endPlace: 1,
                rewards: [],
              },
            ],
            currentPrizePool: {
              points: 0,
              rewards: [],
            },
            place: 0,
            nextPrizePool: {
              points: 0,
              rewards: [],
            },
            nftOrder: {},
          },
          luckyDraw: {
            isWinner: false,
            eligibleUsersCount: 0,
          },
        },
        eligibleUsersCount: prevState
          ? (prevState.eligibleUsersCount as number)
          : 0,
        threshold: prevState ? (prevState.threshold as number) : 0,
        socialDescription: computeSocialDescription(prevState),
        startAt: getStartDate(
          prevState && prevState.startAt ? prevState.startAt : new Date(),
        ).toISOString(),
        endAt:
          prevState && prevState.endAt
            ? new Date(prevState.endAt).toISOString()
            : getEndDate(new Date()).toISOString(),
        claimingStartAt: getStartDate(
          prevState && prevState.claimingStartAt
            ? prevState.claimingStartAt
            : new Date(),
        ).toISOString(),
        claimingEndAt:
          prevState && prevState.claimingEndAt
            ? new Date(prevState.claimingEndAt).toISOString()
            : getEndDate(new Date()).toISOString(),
      };
    });

    if (!tasksData.length) setShowPreview(false);
  }, [tasksData, partnerProjects, questType]);

  const goBack = useCallback(() => {
    if (step === ECreateQuestSteps.SelectTasks)
      setBackStep(ECreateQuestSteps.Setup);
    if (step === ECreateQuestSteps.Rewards)
      setBackStep(ECreateQuestSteps.SelectTasks);
  }, [step]);

  const {
    allTasksTypesAsObject,
    pointsForCompletion,
    defaultTitleAndDescription,
  } = useTaskTypes();

  const handleAddTask = (typeItem: ELoyaltyTasks) => {
    const commonValues = {
      typeItem,
      startAt: null,
      endAt: null,
      ...allTasksTypesAsObject[typeItem].additionalFields.reduce(
        (fieldAcc, fieldItem) => {
          if (fieldItem.name === "title") {
            let title =
              defaultTitleAndDescription[typeItem].title ||
              allTasksTypesAsObject[typeItem].title;
            if (typeItem === ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER) title = "";
            return {
              ...fieldAcc,
              [fieldItem.name]: title,
            };
          }

          if (fieldItem.name === "description") {
            return {
              ...fieldAcc,
              [fieldItem.name]:
                defaultTitleAndDescription[typeItem].description ||
                allTasksTypesAsObject[typeItem].description,
            };
          }

          return {
            ...fieldAcc,
            [fieldItem.name]: getDefaultValue({
              fieldItem,
              taskType: typeItem,
            }),
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
                allTasksTypesAsObject[typeItem].title ||
                defaultTitleAndDescription[typeItem].title,
            };

          if (fieldItem.name === "description") {
            let description =
              allTasksTypesAsObject[typeItem].description ||
              defaultTitleAndDescription[typeItem].description;

            if (
              [ELoyaltyTasks.SUGGESTION, ELoyaltyTasks.IMAGE_UPLOAD].includes(
                typeItem as any,
              )
            )
              description = "";

            return {
              ...fieldAcc,
              [fieldItem.name]: description,
            };
          }

          return {
            ...fieldAcc,
            [fieldItem.name]: getDefaultValue({
              fieldItem,
              taskType: typeItem,
            }),
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
    const isOnChainTask = [
      ELoyaltyTasks.TOKEN,
      ELoyaltyTasks.NFT,
      ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
      ELoyaltyTasks.NATIVE_HOLDER,
      ELoyaltyTasks.VALUE_HOLDER,
    ].includes(typeItem as any);

    if (isOnChainTask) {
      commonValues.selectedTab = "link";
    }

    return setTasksData(prevState => [
      ...prevState,
      {
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
                points: pointsForCompletion[typeItem] || 10,
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
      } as any,
    ]);
  };

  const updateQuest = async (data: SetupStepFormFields) => {
    return await adminQuestService
      .updateQuest(
        {
          ...data,
          title: data.projectName,
          projectType: questType,
          socialDescription: project.socialDescription,
        } as any,
        currentQuest.linkTitle,
      )
      .then(res => {
        if (res.data.linkTitle !== currentQuest.linkTitle) {
          push(
            `/admin/project/${partnerLinkTitle}/quest/${res.data.linkTitle}/edit/tasks`,
          );
        }
        return res.data;
      });
  };

  const savedTasksAsObject: ILoyaltyTask[] = useMemo(() => {
    if (!currentQuest?.loyaltyTasks) return [];
    return currentQuest.loyaltyTasks.map(item => {
      if (item.type === "quiz" && Array.isArray(item.body.answers)) {
        item.body.answers = item.body.answers.join(",");
      }
      return item;
    });
  }, [currentQuest]);

  useEffect(() => {
    adminQuestService
      .getAdminSettings(partnerLinkTitle)
      .then(res => setSettings(res.data))
      .catch(err => console.log(err));
  }, []);

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const isXLG = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.xLg),
  );

  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.tablet),
  );

  return {
    previewOpen,
    currentQuest,
    project,
    step,
    isXLG,
    goBack,
    setStep: setQueryStep,
    setShowPreview,
    currentQuestForPreview,
    previewLoading,
    showPreview,
    setShouldSave,
    isSuccessOpen,
    setIsSuccessOpen,
    backStep,
    id,
    setBackStep,
    setCurrentQuest,
    shouldSave,
    setPreviewLoading,
    setCurrentQuestForPreview,
    setQuestType,
    questType,
    selectedTaskTypes,
    handleAddTask,
    settings,
    savedTasksAsObject,
    setTasksData,
    tasksData,
    setWrongStepPopupOpen,
    wrongStepPopupOpen,
    isMd,
    setQuestRewardsForPreview,
    isTablet,
    adminStep,
    updateQuest,
  };
};
