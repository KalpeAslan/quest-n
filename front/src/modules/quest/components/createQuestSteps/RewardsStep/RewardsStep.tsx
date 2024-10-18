import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { Wrapper } from "./rewardsStep.styles";
import { ECreateQuestSteps, ILoyaltyProject } from "@/modules/quest/models";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { t, Trans } from "@lingui/macro";
import { RewardBlock } from "@/modules/quest/components/createQuestSteps/RewardsStep/components/RewardBlock";
import { Tooltip } from "@components/UI/tooltip";
import classNames from "classnames";
import { LuckyDrawAmountAndThreshold } from "@/modules/quest/components/createQuestSteps/RewardsStep/components/LuckyDrawAmount";
import { RewardsPopup } from "./components/RewardsPopup";
import { ICreateRewardsHookData } from "@/modules/quest/hooks/useCreateRewards";
import { InfoBadge } from "@components/UI/infoBadge/InfoBadge";
import { useRouter } from "next/router";

interface Props {
  setBackStep: Dispatch<SetStateAction<ECreateQuestSteps>>;
  hookData: ICreateRewardsHookData;
  onCompleteConfirmation: (quest: ILoyaltyProject) => void;
  onInit: () => void;
  isDraft: boolean;
}

const RewardsStep: FC<Props> = ({
  setBackStep,
  hookData,
  onCompleteConfirmation,
  onInit,
  isDraft,
}) => {
  const {
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
    computedDraftButtonName,
    setCurrentQuest,
    partnerProjectLinkTitle
  } = useMemo(() => hookData, [hookData]);

  useEffect(() => {
    onInit();
  }, []);
  const { push } = useRouter();

  const handleOnSaveAsDraft = async () => {
    await onSaveAsDraft();
    push(`/admin/project/${partnerProjectLinkTitle}/quests`);
  };

  const rewardStepUI = useMemo(() => {
    return Object.values(rewards).map(reward => {
      return (
        <Fragment key={reward.id}>
          <RewardBlock
            showDelete={rewardsLength > 1}
            isLuckyDraw={isLuckyDraw}
            nftCollections={nftCollections}
            getNftCollections={getNftCollections}
            getTokensContracts={getTokensContracts}
            reward={reward}
            tokenContracts={tokenContracts}
            setActiveTab={value => setActiveTab(reward.id, value)}
            onRewardDelete={() => deleteReward(reward.id)}
            onWhitelistNameChange={value =>
              onWhitelistNameChange(reward.id, value)
            }
            onWhitelistDescriptionChange={value =>
              onWhitelistDescriptionChange(reward.id, value)
            }
            onWhitelistEndPlaceChange={value =>
              onWhitelistEndPlaceChange(reward.id, value)
            }
            onRewardFieldAmountChange={(index, value) =>
              onRewardFieldAmountChange({
                rewardId: reward.id,
                rewardFieldIndex: index,
                amountValue: value,
              })
            }
            onRewardFieldEndPlaceChange={(index, value) =>
              onRewardFieldEndPlaceChange({
                rewardId: reward.id,
                rewardFieldIndex: index,
                endPlaceValue: value,
              })
            }
            onLuckyDrawAmountChange={value =>
              onLuckyDrawAmountChange(reward.id, value)
            }
            removeRewardFieldByIndex={index =>
              removeRewardFieldByIndex(reward.id, index)
            }
            removeLastRewardField={() => removeLastRewardField(reward.id)}
            addRewardField={() => addRewardField(reward.id)}
            setContractId={value => setContractId(reward.id, value)}
            setNftImage={value => setNftImage(reward.id, value)}
            onNftNameChange={value => onNftNameChange(reward.id, value)}
            isDraft={isDraft}
          />
        </Fragment>
      );
    });
  }, [
    rewards,
    rewardsLength,
    isLuckyDraw,
    nftCollections,
    getNftCollections,
    getTokensContracts,
    tokenContracts,
    isDraft,
    setActiveTab,
    deleteReward,
    onWhitelistNameChange,
    onWhitelistDescriptionChange,
    onWhitelistEndPlaceChange,
    onRewardFieldAmountChange,
    onRewardFieldEndPlaceChange,
    onLuckyDrawAmountChange,
    removeRewardFieldByIndex,
    removeLastRewardField,
    addRewardField,
    setContractId,
    setNftImage,
    onNftNameChange,
  ]);

  return (
    <>
      <Wrapper style={{ padding: 0 }}>
        <Box
          maxWidth={680}
          component="p"
          className="c-font-20-24 c-fw-500"
          mb={3.5}
        >
          <Trans id="nQPoPxMZGLVEnQabYPAb4y-quest">
            In order to add your rewards choose preferable rewards and connect
            with our customer success manager to finish setup of a project
          </Trans>
        </Box>
        {isNotMd && (
          <Box
            component="h1"
            className="c-font-20-24 c-fw-500"
            mb={2.5}
            display="flex"
            alignItems="center"
          >
            <Trans id="rMGRhsWr2bz5BfUc8eRrbG-quest">
              Quest reward management
            </Trans>
            <Tooltip
              value={t({
                id: "co3bK6CCwq3EgtpzPUgE5f-quest",
                message:
                  "You can choose the types of prizes and set the amount for each type",
              })}
              placement="top"
              followCursor
            >
              <Box
                className={classNames("tooltip", "c-font-10-10 c-font-color-2")}
                component="span"
                ml={1}
              >
                ?
              </Box>
            </Tooltip>
          </Box>
        )}
        {isLuckyDraw && (
          <LuckyDrawAmountAndThreshold
            setLuckyDrawUsersAmount={setLuckyDrawUsersAmount}
            luckyDrawUsersAmount={luckyDrawUsersAmount}
            setThreshold={setThreshold}
            threshold={threshold}
            currentQuest={currentQuest}
          />
        )}
        {rewardStepUI}
        <Button
          onClick={() => {
            addReward();
          }}
          disabled={isDisabledAddNewReward}
          className={"c-full-width add-new-reward-button"}
          style={"colorfull"}
        >
          <Trans id="9t2gh2v6UNm7C74rMqg2ra-quest">+Add New Reward</Trans>
        </Button>

        {computedDraftButtonName && (
          <InfoBadge style={{ marginTop: 30 }} text={computedDraftButtonName} />
        )}
        <Box display="flex" mt={2} gap={2}>
          <Button
            style="secondary"
            onClick={() => setBackStep(ECreateQuestSteps.SelectTasks)}
            loading={loading}
          >
            <Trans id="bDgbeSqatS7FCxuu9eJ3qm-quest">Back</Trans>
          </Button>

          {isDraft && (
            <Button
              style={isSaveHidden ? "primary" : "secondary"}
              loading={loading}
              onClick={handleOnSaveAsDraft}
            >
              <Trans id={"dkfgbhk-24lh2e-24glnrj"}>Save as Draft</Trans>
            </Button>
          )}
          {!isSaveHidden && isDraft && (
            <Button
              style="primary"
              className="btnSave"
              loading={loading}
              onClick={() => onSaveClick()}
            >
              {t({
                id: "xfrn8iwGDk8Yx7QYVTR6BB-quest",
                message: "Start Quest",
              })}
            </Button>
          )}
        </Box>
      </Wrapper>

      {Object.keys(rewards).length && (questId || questId === 0) && (
        <RewardsPopup
          isOpen={popupOpen}
          handleClose={() => {
            setPopupOpen(false);
            setLoading(false);
          }}
          setVerified={setVerified}
          setRewardIds={setRewardIds}
          setWhitelistRewardIds={setWhitelistRewardIds}
          rewards={rewards}
          nftCollections={nftCollections}
          tokenContracts={tokenContracts}
          setIsSuccessOpen={setIsSuccessOpen}
          questId={questId}
          isLuckyDraw={isLuckyDraw}
          luckyDrawUsersAmount={luckyDrawUsersAmount}
          onCompleteConfirmation={onCompleteConfirmation}
          questTitle={currentQuest?.linkTitle}
          setCurrentQuest={setCurrentQuest}
        />
      )}
    </>
  );
};

export default RewardsStep;
