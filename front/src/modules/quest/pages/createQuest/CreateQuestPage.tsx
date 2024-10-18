import { Wrapper } from "./createQuest.styles";
import { Box, Theme, useMediaQuery } from "@mui/material";
import {
  ECreateQuestSteps,
  EProjectType,
  EQuestAdminStep,
  QuestStatus,
} from "../../models";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import classNames from "classnames";
import { SetupStep } from "../../components/createQuestSteps/SetupStep";
import { SelectTasksStep } from "../../components/createQuestSteps/SelectTasksStep";
import { CreateTasksStep } from "../../components/createQuestSteps/CreateTasksStep";
import { Success } from "../../components/createQuestPopups/Success";
import { BackPopup } from "../../components/createQuestPopups/BackPopup";
import { t, Trans } from "@lingui/macro";
import { CreateQuestPreview } from "../../components/createQuestPreview";
import { PageLoader } from "@/components/pageLoader";
import QuestComponent from "@modules/quest/components/questComponent/QuestComponent";
import { RewardsStep } from "../../components/createQuestSteps/RewardsStep";
import { WrongStepPopup } from "../../components/createQuestPopups/WrongStepPopup";
import { useCreateQuestPage } from "../../hooks/useCreateQuestPage";
import { useCreateRewards } from "../../hooks/useCreateRewards";
import useCreateTasks from "../../hooks/useCreateTasks";
import { useCallback, useMemo, useState } from "react";
import useSetupStep from "../../hooks/useSetupStep";
import { ChangesWarningPopup } from "@/components/ChangesWarningPopup";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getChangesWarningPopupPath } from "@/store/slices/system/system.selector";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setChangesWarningPopupPath } from "@/store/slices/system/system.slice";
import { useWalletConnect } from "@/hooks";
import { disconnectAccountThunk } from "@/modules/account/store/account.thunks";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import Image from "next/image";
import { CBreakpoints } from "@styles/variables";

const CreateQuestPage = () => {
  const [changesWarningPopupExitStep, setChangesWarningPopupExitStep] =
    useState<ECreateQuestSteps | null>(null);

  const dispatch = useAppDispatch();

  const changesWarningPopupPath = useTypedSelector(getChangesWarningPopupPath);

  const { push } = useRouter();

  const { disconnect: disconnectWallet } = useWalletConnect();

  const {
    previewOpen,
    currentQuest,
    project,
    step,
    isXLG,
    adminStep,
    setStep,
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
    updateQuest,
  } = useCreateQuestPage();

  const setupHookData = useSetupStep({
    partnerProject: project,
    setStep,
    currentQuest,
    adminStep,
    updateQuest,
    setCurrentQuest,
    shouldSave,
    questType,
    setQuestType,
    setCurrentQuestForPreview,
    setPreviewLoading,
    setShouldSave,
  });

  const rewardsHookData = useCreateRewards({
    currentQuest,
    setWrongStepPopupOpen,
    setIsSuccessOpen,
    setCurrentQuest,
    tasksData: tasksData || [],
    step,
  });

  const tasksHookData = useCreateTasks({
    setTasksData,
    savedTasksAsObject,
    selectedTaskTypes,
    tasksData,
    currentQuest,
    setWrongStepPopupOpen,
    setStep,
    isUpdate: adminStep === EQuestAdminStep.edit,
    setCurrentQuest,
    shouldSave,
    setPreviewLoading,
    setShouldSave,
  });

  const isChangesWarningPopupOpen = useMemo(
    () => Boolean(changesWarningPopupExitStep || changesWarningPopupPath),
    [changesWarningPopupExitStep, changesWarningPopupPath],
  );

  const logout = useCallback(async () => {
    await disconnectWallet();
    await dispatch(disconnectAccountThunk());
  }, [disconnectWallet, dispatch]);

  const handleExit = useCallback(() => {
    if (changesWarningPopupExitStep) {
      setStep(changesWarningPopupExitStep);
      setChangesWarningPopupExitStep(null);
    } else if (changesWarningPopupPath === "logout") {
      logout();
    } else if (changesWarningPopupPath) {
      push(changesWarningPopupPath);
      dispatch(setChangesWarningPopupPath(null));
    }
  }, [
    changesWarningPopupExitStep,
    logout,
    changesWarningPopupPath,
    push,
    setStep,
    dispatch,
  ]);

  const handleClose = useCallback(() => {
    dispatch(setChangesWarningPopupPath(null));
    setChangesWarningPopupExitStep(null);
  }, [dispatch]);

  const handleSave = useMemo(() => {
    if (step === ECreateQuestSteps.SelectTasks) {
      return () => void 0;
    }
    if (step === ECreateQuestSteps.Rewards) {
      return rewardsHookData.onSaveAsDraft;
    }

    return setupHookData.saveData(
      setupHookData.formik.values,
      setupHookData.formik.setFieldError,
      true,
    );
  }, [rewardsHookData.onSaveAsDraft, setupHookData, step]);

  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  return (
    <div className="background-other" style={{ position: "relative" }}>
      {previewOpen && currentQuest && (
        <CreateQuestPreview currentQuest={currentQuest} />
      )}

      {!previewOpen &&
        (!project ? (
          <PageLoader />
        ) : (
          <Wrapper
            step={step}
            className="c-font-color"
            display={previewOpen && currentQuest ? "none" : "block"}
          >
            {isLg && (
              <div className={"create-quest__sidebar"}>
                <Box p={2}>
                  <PartnerProjectsDropdown />
                </Box>
                <Image
                  width={50}
                  className={"create-quest__sidebar__image"}
                  height={150}
                  src={"/images/project/sidebar__gradient.png"}
                  alt={"sidebar"}
                />
              </div>
            )}
            <Box pt={5} pb={5} className="create-quest__content">
              <Box
                mb={3.5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  padding: !isXLG && "0px !important",
                }}
                className={"create-quest__header c-wrap"}
              >
                <Box className={"create-quest__header__container"}>
                  <Box
                    display="flex"
                    justifyContent={isMd && "space-between"}
                    sx={{
                      ".previewButton": {
                        minHeight: "38px !important",
                        minWidth: "38px !important",
                      },
                    }}
                    mb={isMd && 2}
                  >
                    <Box
                      component="h1"
                      className="c-font-32-38 c-fw-500"
                      mb={1.5}
                    >
                      {adminStep === EQuestAdminStep.edit
                        ? t({
                            id: "51VisotSMPvnpfoJ7J4TM1-quest",
                            message: "Quests Edit",
                          })
                        : t({
                            id: "esB2u2k2y6Aq1DcJZJxMEK-quest",
                            message: "Quests Creating",
                          })}
                    </Box>
                    {isMd && (
                      <Button
                        disabled={
                          !currentQuestForPreview ||
                          (!!currentQuestForPreview &&
                            !currentQuestForPreview.title)
                        }
                        size={"small"}
                        style={"secondary"}
                        onClick={() => setShouldSave(true)}
                        className="previewButton c-fw-500 c-font-16-22"
                      >
                        <Icon name="show" size={"24"} className="previewIcon" />
                      </Button>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Button
                      onClick={() => {
                        if (step !== ECreateQuestSteps.Setup) {
                          setChangesWarningPopupExitStep(
                            ECreateQuestSteps.Setup,
                          );
                        }
                      }}
                      style={
                        step === ECreateQuestSteps.Setup
                          ? "colorfull"
                          : "secondary"
                      }
                      size={"small"}
                    >
                      <Trans id="4Wqyu6ZtTutMxS6yHXqLT3-quest">Set Up</Trans>
                    </Button>

                    <Box className={"line"} />
                    <Button
                      style={
                        step === ECreateQuestSteps.SelectTasks
                          ? "colorfull"
                          : "secondary"
                      }
                      onClick={() => {
                        if (step !== ECreateQuestSteps.SelectTasks) {
                          setChangesWarningPopupExitStep(
                            ECreateQuestSteps.SelectTasks,
                          );
                        }
                      }}
                      size={"small"}
                    >
                      <Trans id="v7Gf5sF44rWBDmRvcd9gQ3-quest">Tasks</Trans>
                    </Button>

                    <Box className={"line"} />

                    <Button
                      onClick={() => {
                        if (step !== ECreateQuestSteps.Rewards) {
                          setChangesWarningPopupExitStep(
                            ECreateQuestSteps.Rewards,
                          );
                        }
                      }}
                      style={
                        step === ECreateQuestSteps.Rewards
                          ? "colorfull"
                          : "secondary"
                      }
                      size={"small"}
                    >
                      <Trans id="6gvXwvDxc9Yp5AisyT7Kfn-quest">Rewards</Trans>
                    </Button>
                  </Box>
                </Box>

                {step !== ECreateQuestSteps.Setup && !isMd && (
                  <div className={"c-flex aligncenter"}>
                    {!isTablet && (
                      <Button
                        style="secondary"
                        className="previewButton c-fw-500 c-font-16-22"
                        onClick={() => {
                          setShowPreview(prevState => !prevState);
                        }}
                        disabled={
                          !currentQuestForPreview ||
                          (!!currentQuestForPreview &&
                            !currentQuestForPreview.title)
                        }
                        loading={previewLoading}
                      >
                        <>
                          <Icon
                            name="show"
                            size={isMd ? "24" : "18"}
                            className="previewIcon"
                          />
                          <Box className="previewText">
                            {showPreview ? (
                              <Trans id={"sdhwet-qwuryv-quest"}>
                                Hide Preview Quest
                              </Trans>
                            ) : (
                              <Trans id="g1fHFT7rUF732UWUkxs8fwdk-quest">
                                Show Preview Quest
                              </Trans>
                            )}
                          </Box>
                        </>
                      </Button>
                    )}
                    <Box ml={!isMd && 2}>
                      <Button
                        disabled={
                          !currentQuestForPreview ||
                          (!!currentQuestForPreview &&
                            !currentQuestForPreview.title)
                        }
                        size={"small"}
                        style={"secondary"}
                        onClick={() => setShouldSave(true)}
                        className="previewButton c-fw-500 c-font-16-22"
                      >
                        <>
                          <Icon
                            size={"24"}
                            name={"showFullPreviewQuest"}
                            className="previewIcon"
                          />
                          <Trans id="aNADJLTXV7ueQDTCcEt8vN-quest">
                            Fullscreen View
                          </Trans>
                        </>
                      </Button>
                    </Box>
                  </div>
                )}
              </Box>
              <div className="c-wrap">
                <Box
                  className={classNames({
                    "c-flex c-flex-column": step !== ECreateQuestSteps.Setup,
                  })}
                  sx={{
                    alignItems: "start",
                    padding:
                      step === ECreateQuestSteps.Rewards && showPreview
                        ? "0 0 100px 0"
                        : "0 !important",
                    maxWidth:
                      !isTablet &&
                      !isMd &&
                      currentQuestForPreview &&
                      currentQuestForPreview.rewards &&
                      [
                        ECreateQuestSteps.SelectTasks,
                        ECreateQuestSteps.Rewards,
                      ].includes(step as any)
                        ? "calc(100% - 400px)"
                        : "none",
                  }}
                >
                  <Success
                    isOpen={isSuccessOpen}
                    setIsOpen={setIsSuccessOpen}
                    partnerProjectLinkTitle={id}
                    isUpdate={adminStep === EQuestAdminStep.edit}
                    questId={currentQuest?.linkTitle}
                  />

                  <BackPopup
                    backStep={backStep}
                    setBackStep={setBackStep}
                    setStep={setStep}
                  />

                  {step === ECreateQuestSteps.Setup && (
                    <SetupStep setupHookData={setupHookData} />
                  )}

                  {step === ECreateQuestSteps.SelectTasks && (
                    <SelectTasksStep
                      selectedTasks={tasksData
                        .filter(task => task.id)
                        .map(task => task.taskType)}
                      selectedTaskIndex={tasksHookData.selectedTaskIndex}
                      setSelectedTaskIndex={tasksHookData.setSelectedTaskIndex}
                      currentQuest={currentQuest}
                      isLuckyDraw={questType === EProjectType.LuckyDraw}
                      setShouldSave={setShouldSave}
                      shouldSave={shouldSave}
                      setPreviewLoading={setPreviewLoading}
                      onAdd={handleAddTask}
                      adminTasksLimit={settings ? settings.limit : 20}
                      currentQuestForPreview={currentQuestForPreview}
                      onDelete={tasksHookData.onDeleteTask}
                    />
                  )}

                  {step === ECreateQuestSteps.SelectTasks && (
                    <CreateTasksStep
                      setBackStep={setBackStep}
                      tgBotLink={settings ? settings.tgBotLink : ""}
                      hookData={tasksHookData}
                    />
                  )}

                  {step === ECreateQuestSteps.Rewards && (
                    <RewardsStep
                      isDraft={
                        currentQuest
                          ? currentQuest.questStatus === QuestStatus.Draft
                          : false
                      }
                      setBackStep={setBackStep}
                      hookData={rewardsHookData}
                      onCompleteConfirmation={setQuestRewardsForPreview}
                      onInit={() => {
                        if (questType === EProjectType.LuckyDraw) {
                          rewardsHookData.computeAndSetLuckyDrawThresholdByTasksPoints();
                        }
                      }}
                    />
                  )}
                </Box>

                {!isTablet && (
                  <div
                    style={{
                      display: showPreview ? "block" : "none",
                      position: "absolute",
                      top: "168px",
                      right: "50px",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      maxHeight: "calc(100% - 208px)",
                    }}
                  >
                    {!isMd &&
                      currentQuestForPreview &&
                      currentQuestForPreview.rewards &&
                      [
                        ECreateQuestSteps.SelectTasks,
                        ECreateQuestSteps.Rewards,
                      ].includes(step as any) && (
                        <QuestComponent
                          quest={currentQuestForPreview}
                          maxWidth={"350px"}
                          preview={true}
                          projectLinkTitle={currentQuestForPreview.title.toLowerCase()}
                          setProjectName={() => {}}
                          step={step}
                        />
                      )}
                  </div>
                )}
              </div>
            </Box>
          </Wrapper>
        ))}

      <WrongStepPopup
        isOpen={wrongStepPopupOpen}
        onClose={() => setWrongStepPopupOpen(false)}
        returnToSetup={() => {
          setStep(ECreateQuestSteps.Setup);
          setWrongStepPopupOpen(false);
        }}
      />

      <ChangesWarningPopup
        isOpen={isChangesWarningPopupOpen}
        handleClose={handleClose}
        handleSave={handleSave}
        handleExit={handleExit}
      />
    </div>
  );
};

export default CreateQuestPage;
