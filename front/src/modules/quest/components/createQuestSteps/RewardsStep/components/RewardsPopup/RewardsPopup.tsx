import { Modal } from "@/components/UI/modal";
import { Dispatch, FC, SetStateAction } from "react";
import { Wrapper } from "./rewardsPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { ERewardTabs, IContract, TCreateRewards } from "@/models";
import classNames from "classnames";
import { useCreateRewardsPopup } from "@/modules/quest/hooks/useCreateRewardsPopup";
import { ConnectWalletPopup } from "@/components/ConnectWalletPopup";
import { ILoyaltyProject } from "@modules/quest/models";
import { Trans, t } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  rewards: TCreateRewards;
  nftCollections: IContract[];
  tokenContracts: IContract[];
  setIsSuccessOpen: Dispatch<SetStateAction<boolean>>;
  questId: number;
  isLuckyDraw: boolean;
  luckyDrawUsersAmount: number;
  setVerified: (rewardId: number, verified: boolean) => void;
  setRewardIds: (
    data: {
      id: number;
      rewardIds: number[];
    }[],
  ) => void;
  setWhitelistRewardIds: (
    data: {
      id: number;
      rewardId: number;
    }[],
  ) => void;
  onCompleteConfirmation: (quest: ILoyaltyProject) => void;
  questTitle: string;
  setCurrentQuest: (value: SetStateAction<ILoyaltyProject>) => void;
}

const RewardsPopup: FC<Props> = ({
  isOpen,
  handleClose,
  rewards,
  nftCollections,
  tokenContracts,
  setIsSuccessOpen,
  questId,
  isLuckyDraw,
  luckyDrawUsersAmount,
  setVerified,
  setRewardIds,
  setWhitelistRewardIds,
  onCompleteConfirmation,
  questTitle,
  setCurrentQuest,
}) => {
  const {
    currentStep,
    onConfirmClick,
    rewardsVerified,
    confirmLoading,
    isNetworkLoading,
    isConnectLoading,
    whitelistNames,
    steps,
    currentStepIndex,
    completeConfirmation,
    onClose,
    chainToConnect,
    isWalletPopupOpen,
    setIsWalletPopupOpen,
    needConnect,
    getNeedSwitchChain,
    tokenRewards,
    nftRewards,
    getContract,
    getTotalRewardAmount,
    getButtonName,
    verifiedRewards,
  } = useCreateRewardsPopup({
    rewards,
    tokenContracts,
    nftCollections,
    questId,
    handleClose,
    setIsSuccessOpen,
    isLuckyDraw,
    luckyDrawUsersAmount,
    setVerified,
    setRewardIds,
    setWhitelistRewardIds,
    isOpen,
    questTitle,
    setCurrentQuest,
  });

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={true}
          handleClose={() => onClose(onCompleteConfirmation)}
        >
          <Wrapper>
            <Box onClick={() => onClose(onCompleteConfirmation)} className="header c-font-24-24 c-fw-500 c-font-color">
              Confirm Reward
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className="content">
              <Box
                textAlign="left"
                className="c-font-color c-font-16-22"
                mb="30px"
                component="p"
              >
                <Trans id="bEoY8iJntEf6YhjfcnVica-quest">
                  Please confirm the reward information, this action is
                  irreversible. After the quest ends, eligible participants will
                  be able to claim their rewards.
                </Trans>
              </Box>

              <Box className="divider" mb={3} />

              {currentStep !== ERewardTabs.WHITELIST &&
                (currentStep === ERewardTabs.TOKEN
                  ? tokenRewards
                  : nftRewards
                ).map(item => {
                  const contract = getContract(item);

                  const totalRewardAmount = getTotalRewardAmount(item.id);

                  const buttonName = getButtonName(contract.chainId);

                  return (
                    <Box className="tokenContainer" mb={3} key={item.id}>
                      <Box
                        display="flex"
                        alignItems="center"
                        className={classNames("tokenNameContainer")}
                      >
                        {contract?.logo && (
                          <Image
                            width={25}
                            height={25}
                            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${contract.logo}`}
                            alt={contract.name}
                            className="tokenLogo"
                          />
                        )}

                        <Box className="c-font-color c-font-16-20 c-sm-font-20-24">
                          {currentStep === ERewardTabs.TOKEN &&
                            t({
                              id: "5E4kPj3QenDdZeAzuHz9Aw-quest",
                              message: "Token Reward:",
                            })}
                          {currentStep === ERewardTabs.NFT &&
                            t({
                              id: "7MwpuVyLDg2NqznJXt7Frd-quest",
                              message: "NFT Reward:",
                            })}{" "}
                          <Box component="span" className="c-font-color-3">
                            {totalRewardAmount} {contract?.symbol}
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        style="primary"
                        onClick={() => onConfirmClick(item.id)}
                        className="confirmButton"
                        disabled={
                          verifiedRewards.includes(item.id) ||
                          confirmLoading ||
                          isNetworkLoading ||
                          isConnectLoading
                        }
                        loading={
                          confirmLoading || isNetworkLoading || isConnectLoading
                        }
                      >
                        {buttonName}
                      </Button>
                    </Box>
                  );
                })}

              {currentStep === ERewardTabs.WHITELIST && (
                <Box mb="14px" alignSelf="flex-start">
                  {whitelistNames.map((item, index, arr) => (
                    <Box
                      mb={index === arr.length - 1 ? 0 : "10px"}
                      display="flex"
                      alignItems="center"
                      key={item}
                    >
                      <Icon
                        name="whitelistItem"
                        size="23"
                        className="c-font-color-3"
                      />
                      <Box
                        ml="5px"
                        className="c-font-color c-font-16-20 c-sm-font-20-24"
                      >
                        <Trans id="caCigDwocJDA4bYojS8Ky5-quest">
                          White List:
                        </Trans>{" "}
                        <Box component="span" className="c-font-color-3">
                          {item}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Box className="divider" mb="30px" />

              {steps.length > 1 && (
                <Box className="steps">
                  {steps.map((item, index, arr) =>
                    index === arr.length - 1 ? (
                      <>
                        <Box
                          className={classNames("dot", {
                            active: currentStepIndex >= index,
                          })}
                          mr={1}
                        />
                        <Box
                          className={classNames("text mobile", {
                            active: currentStepIndex >= index,
                            current: currentStepIndex === index,
                          })}
                          component="p"
                          mr={currentStepIndex === index ? 1 : 0}
                        >
                          {index + 1}
                        </Box>
                        <Box
                          className={classNames("text desktop", {
                            active: currentStepIndex >= index,
                            current: currentStepIndex === index,
                          })}
                          component="p"
                          mr={1}
                        >
                          {item === ERewardTabs.TOKEN &&
                            t({
                              id: "5i14aov9sybfipmusFd4K1-quest",
                              message: "Token Reward",
                            })}
                          {item === ERewardTabs.NFT &&
                            t({
                              id: "hnXWoHnZDh9sivy2f3niJX-quest",
                              message: "NFT Reward",
                            })}
                          {item === ERewardTabs.WHITELIST &&
                            t({
                              id: "w5RiVumjFFYCAQoAqGksSi-quest",
                              message: "White List",
                            })}
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          className={classNames("dot", {
                            active: currentStepIndex >= index,
                          })}
                          mr={1}
                        />
                        <Box
                          className={classNames("text mobile", {
                            active: currentStepIndex >= index,
                            current: currentStepIndex === index,
                          })}
                          component="p"
                          mr={1}
                        >
                          {index + 1}
                        </Box>
                        <Box
                          className={classNames("text desktop", {
                            active: currentStepIndex >= index,
                            current: currentStepIndex === index,
                          })}
                          component="p"
                          mr={1}
                        >
                          {item === ERewardTabs.TOKEN &&
                            t({
                              id: "3thpHAm1itMWdYUYDM8PiS-quest",
                              message: "Token Reward",
                            })}
                          {item === ERewardTabs.NFT &&
                            t({
                              id: "rFZBcF2rghdTRga4BRGpXh-quest",
                              message: "NFT Reward",
                            })}
                          {item === ERewardTabs.WHITELIST &&
                            t({
                              id: "5uuJ5wevdupFgvy7uzaPji-quest",
                              message: "White List",
                            })}
                        </Box>

                        <Box
                          className={classNames("stepsDivider", {
                            active: currentStepIndex > index,
                          })}
                          mr={1}
                        />
                      </>
                    ),
                  )}
                </Box>
              )}

              {(rewardsVerified || currentStep === ERewardTabs.WHITELIST) && (
                <Button
                  style="primary"
                  onClick={() => completeConfirmation(onCompleteConfirmation)}
                  className="completeButton"
                >
                  <Trans id="twkCVcrMD2aVxaDKvk5pXb-quest">
                    Complete the quest
                  </Trans>
                </Button>
              )}
            </Box>
          </Wrapper>
        </Modal>
      )}

      <ConnectWalletPopup
        isOpen={
          isWalletPopupOpen &&
          (needConnect || getNeedSwitchChain(chainToConnect))
        }
        handleClose={() => setIsWalletPopupOpen(false)}
        chainToConnect={chainToConnect}
        needConnect={needConnect}
        needSwitchChain={getNeedSwitchChain(chainToConnect)}
        actionName={t({
          id: "tXtPsbZ33MHcAmSPSrDyxt-quest",
          message: "distribute rewards",
        })}
      />
    </>
  );
};

export default RewardsPopup;
