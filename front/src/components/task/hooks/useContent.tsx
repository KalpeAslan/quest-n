import { FormikProps } from "formik";
import {
  DailyFormFields,
  EmailFormFields,
  QuizFormFields,
  ImageUploadFormFields,
  SuggestionFormFields,
  WalletFormFields,
  WebhookEmailFormFields,
  WebhookPhoneFormFields,
  WebhookTextFormFields,
} from "./useForms";
import {
  ELoyaltyTasks,
  EWebhookTaskTabs,
  ILoyaltyTask,
  TSocialDataType,
} from "@/models";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Trans, t } from "@lingui/macro";
import { Icon } from "@/components/UI/icon";
import { TwitterLogin } from "@/components/socialsLogin/twitter";
import {
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import { DiscordLogin } from "@/components/socialsLogin/discord";
import { TelegramLogin } from "@/components/socialsLogin/telegram";
import { WatchVideoPopup } from "../watchVideoPopup";
import {
  setIsOnboardingPopupOpen,
  setIsWalletPopupOpen,
} from "@/store/slices/system/system.slice";
import { useTypedSelector } from "@hooks/useTypedSelector";
import {
  getIsLoading,
  getIsWalletConnected,
} from "@store/slices/system/system.selector";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import { SwiperRef } from "swiper/react/swiper-react";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "@/context";
import { isMobile } from "react-device-detect";
import useWebhookTabs from "./useWebhookTabs";
import { Tabs } from "@/components/UI/tabs";
import { PhoneInput } from "@/components/UI/phoneInput";
import { CBreakpoints } from "@styles/variables";
import { shortenAddress } from "@/utils";
import { InviteButton, ReferralLinkButton } from "../task.styles";
import CopyToClipboard from "react-copy-to-clipboard";
import { useWalletConnect } from "@/hooks";
import Image from "next/image";
import taskLoaderImage from "@assets/images/taskLoader.webp";
import { useRouter } from "next/router";

interface Props {
  buttonName: any;
  handleClick: (data?: any) => void;
  isLoaded: boolean;
  status: {
    isBlocked: boolean;
    isExpired: boolean;
    isDone: boolean;
    isActive: boolean;
  };
  isError: boolean;
  isWarning: boolean;
  quizFormik: FormikProps<QuizFormFields>;
  emailFormik: FormikProps<EmailFormFields>;
  walletFormik: FormikProps<WalletFormFields>;
  suggestionFormik: FormikProps<SuggestionFormFields>;
  dailyFormik: FormikProps<DailyFormFields>;
  imageUploadFormik: FormikProps<ImageUploadFormFields>;
  webhookEmailFormik: FormikProps<WebhookEmailFormFields>;
  webhookPhoneFormik: FormikProps<WebhookPhoneFormFields>;
  webhookTextFormik: FormikProps<WebhookTextFormFields>;
  confirmFlow: (callback?: any) => Promise<void>;
  referralLinkPreDone: boolean;
  isSocialAuthLoaded: boolean;
  connectedDiscord?: string;
  connectedTelegram?: string;
  connectedTwitter?: string;
  task: ILoyaltyTask;
  watchVideoPopupOpen: boolean;
  setReferralLinkPreDone: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setWatchVideoPopupOpen: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  activeStatus: number;
  activeStep?: number;
  open?: boolean;
  setIsWarning: (value: boolean) => void;
  isIframe?: true;
  increaseErrorsCount?: () => void;
  quizPreDone: boolean;
  inviteLimitReached?: boolean;
}

const useContent = ({
  buttonName,
  handleClick,
  isLoaded,
  status,
  isError,
  quizFormik,
  emailFormik,
  walletFormik,
  suggestionFormik,
  confirmFlow,
  referralLinkPreDone,
  isSocialAuthLoaded,
  connectedDiscord,
  connectedTelegram,
  connectedTwitter,
  task,
  watchVideoPopupOpen,
  setReferralLinkPreDone,
  setIsError,
  setWatchVideoPopupOpen,
  setErrorMessage,
  activeStatus,
  activeStep,
  dailyFormik,
  webhookEmailFormik,
  webhookPhoneFormik,
  webhookTextFormik,
  imageUploadFormik,
  open,
  isWarning,
  setIsWarning,
  isIframe,
  increaseErrorsCount,
  quizPreDone,
  inviteLimitReached,
}: Props) => {
  const dispatch = useAppDispatch();

  const { query } = useRouter();

  const isWalletConnected = useTypedSelector(getIsWalletConnected);
  const isLoading = useTypedSelector(getIsLoading);
  const accountInfo = useTypedSelector(getAccountInfo);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

  const isXSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.xSm),
  );

  const { handleConnect } = useWalletConnect({
    useBlankWindow: true,
    type: "walletconnect",
  });

  const connectWallet = useContextSelector(
    AppContext,
    state => state.connectWallet,
  );

  const [iosRestrictionPopupOpened, setIosRestrictionPopupOpened] =
    useState<boolean>(false);

  const { tabs, activeTab, setActiveTab } = useWebhookTabs({ task });

  const openIosRestrictionPopup = useCallback(() => {
    if (
      navigator.userAgent.toLowerCase().includes("safari") &&
      navigator.userAgent.toLowerCase().includes("iphone") &&
      !isSocialAuthLoaded &&
      iosRestrictionPopupOpened &&
      !accountInfo?.connected
    ) {
      dispatch(setIsSocialAuthLoaded(true));
      dispatch(
        setIsRestrictionForCreationPopupOpen({
          open: true,
          type: "safari",
          username: "",
        }),
      );
      setIosRestrictionPopupOpened(false);
    }
  }, [
    dispatch,
    iosRestrictionPopupOpened,
    isSocialAuthLoaded,
    accountInfo?.connected,
  ]);

  useEffect(() => {
    openIosRestrictionPopup();
  }, [openIosRestrictionPopup]);

  useEffect(() => {
    if (
      query.flow &&
      (query.flow as string).startsWith("connect_") &&
      task.type === ELoyaltyTasks.SIGN_UP
    ) {
      dispatch(setIsOnboardingPopupOpen(true));
    }
  }, [dispatch, query.flow, task.type]);

  useEffect(() => {
    if (imageUploadFormik.errors && imageUploadFormik.errors.imgSrc) {
      setIsError(true);
      increaseErrorsCount();
      setErrorMessage(
        t({
          id: "axaAGTAbdoa1vrVjievfdgvs-task",
          message: "File is too large, max size: 5MB",
        }),
      );
    }
  }, [imageUploadFormik.errors]);

  const socialsClickInitFunction = useCallback(() => {
    dispatch(setIsSocialAuthLoaded(false));
    setTimeout(() => setIosRestrictionPopupOpened(true), 6000);
    setTimeout(() => dispatch(setIsSocialAuthLoaded(true)), 7000);
  }, [dispatch]);

  const swiperRef = useRef<SwiperRef>();

  useEffect(() => {
    if (swiperRef.current?.swiper?.slideTo) {
      swiperRef.current.swiper.slideTo(activeStep);
    }
  }, [activeStep, swiperRef, open]);

  const handleConnectWallet = useCallback(async () => {
    if (isIframe) {
      await handleConnect();
      return;
    }

    if (!connectWallet) {
      return;
    }

    if (isMobile) {
      connectWallet("WalletConnect");

      return;
    }

    dispatch(setIsWalletPopupOpen({ status: true, chainId: null }));
  }, [connectWallet, dispatch, handleConnect, isIframe]);

  const onChainTaskContent = useCallback(
    () => (
      <>
        {status.isActive || status.isBlocked ? (
          isWalletConnected ? (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="submit"
              onClick={() => handleClick()}
              loading={!isLoaded}
              disabled={!isLoaded || isLoading || status.isBlocked}
            >
              <Trans id="b4786418-e7d4-11ed-a05b-0242ac120003-task">
                Verify task
              </Trans>
            </Button>
          ) : (
            <Button
              onClick={handleConnectWallet}
              className="buttonContent"
              style="task"
              size="task"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
            >
              <Trans id="b4786742-e7d4-11ed-a05b-0242ac120003-task">
                Connect Wallet
              </Trans>
            </Button>
          )
        ) : (
          <>
            {(task.body.wallet || status.isExpired) && !status.isBlocked && (
              <p
                className="c-font-14-20 c-fw-700 c-font-color"
                style={{ marginTop: "4px" }}
              >
                <Trans id="b47868a0-e7d4-11ed-a05b-0242ac120003-task">
                  Wallet:
                </Trans>{" "}
                {status.isExpired
                  ? "-"
                  : isXSm
                  ? shortenAddress(task.body.wallet)
                  : task.body.wallet}
              </p>
            )}
          </>
        )}
      </>
    ),
    [
      status.isActive,
      status.isBlocked,
      status.isExpired,
      isWalletConnected,
      isLoaded,
      isLoading,
      handleConnectWallet,
      task.body.wallet,
      isXSm,
      handleClick,
    ],
  );

  const contents = useMemo(
    () => ({
      quiz: (
        <>
          {task.body?.answers?.length && !status?.isDone && (
            <Box
              sx={{
                padding: 0,
                margin: 0,
                listStyle: "none",
                mb: status?.isExpired ? 0 : 2,
              }}
              component="ul"
            >
              {(Array.isArray(task.body.answers)
                ? task.body.answers
                : task.body.answers.split(",")
              ).map((item, index) => {
                if (typeof item === "string") return null;

                return (
                  <li key={item.id} className="c-font-14-26">
                    <Trans id="8ZVPMatg5Laf2oCzsr1pwZ-task">
                      Attempt {index + 1}: {item.answer}
                    </Trans>
                  </li>
                );
              })}
            </Box>
          )}

          {(status.isActive || status.isBlocked) && (
            <Box
              component="form"
              className="form"
              mt={1.5}
              autoComplete="off"
              onSubmit={(e: any) => {
                e.preventDefault();
                quizFormik.handleSubmit();
              }}
            >
              <Box mb={1}>
                <Input
                  className="c-full-width quizInput"
                  classnames={{ error: "quizError" }}
                  placeholder={t({
                    id: "hHZEUpKeY3jT5UUTtt7A69-task",
                    message: "Your answer",
                  })}
                  name="answer"
                  styles="secondary"
                  value={quizFormik.values.answer}
                  error={
                    quizFormik.touched.answer &&
                    Boolean(quizFormik.errors.answer)
                  }
                  errortext={quizFormik.errors.answer}
                  onChange={e => {
                    if (isError) {
                      setIsError(false);
                    }

                    if (isWarning) setIsWarning(false);

                    quizFormik.setTouched({
                      ...quizFormik.touched,
                      answer: true,
                    });
                    quizFormik.handleChange(e);
                  }}
                  isDisabled={!isLoaded || status.isBlocked}
                />
              </Box>

              <Button
                className="buttonContent"
                style="task"
                size="task"
                type="submit"
                disabled={
                  status.isBlocked ||
                  !quizFormik.isValid ||
                  quizFormik.values.answer === "" ||
                  !isLoaded
                }
              >
                <>
                  {isLoaded && !quizPreDone && (
                    <Trans id="1PY7Funz9phnYYdWUnWEjF-task">Send answer</Trans>
                  )}
                  {(!isLoaded || quizPreDone) && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box mr={1}>
                        {quizPreDone ? (
                          <Trans id="gM3xfxjqEZCxBPd6ExERdj-task">
                            Answer is correct
                          </Trans>
                        ) : (
                          <Trans id="mtEwg1sbv6aNGjy34sQPDX-task">
                            Sending answer
                          </Trans>
                        )}
                      </Box>

                      {quizPreDone ? (
                        <Icon name="checkmark" size="16" />
                      ) : (
                        <Image
                          src={taskLoaderImage}
                          alt="loader"
                          className="buttonLoader"
                        />
                      )}
                    </Box>
                  )}
                </>
              </Button>
            </Box>
          )}

          {status.isDone && (
            <p
              className="c-font-14-20 c-fw-700 c-font-color"
              style={{ marginTop: "4px" }}
            >
              <Trans id="97e4LjRpmiEog71ZXsPrBy-task">Answer:</Trans>{" "}
              {task.body?.answers?.find(item => item.status === "completed")
                ?.answer || "-"}
            </p>
          )}
        </>
      ),
      visitLink: (
        <>
          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              onClick={confirmFlow}
              href={task.body.link}
              target="_blank"
            >
              <>
                <Icon className="icon" name="web" size="16" />
                <Trans id="v1eiz4aCYiLtRdnrxwDfzW-task">Visit Site</Trans>
              </>
            </Button>
          )}
        </>
      ),
      referralLink: (
        <>
          {(status.isActive || status.isBlocked) && (
            <CopyToClipboard
              text={"test"}
              onCopy={() => {
                setReferralLinkPreDone(true);

                setTimeout(() => {
                  setReferralLinkPreDone(false);
                }, 5000);
              }}
            >
              <ReferralLinkButton className="buttonContent">
                <Icon
                  className="icon"
                  name={!referralLinkPreDone ? "link" : "check-mark"}
                  size={!referralLinkPreDone ? "16" : "12"}
                />
                {referralLinkPreDone
                  ? t({
                      id: "2SVFRRMEKrmUNsNKj8nUSE-task",
                      message: "Copied",
                    })
                  : t({
                      id: "3LPMpPtXbqP2eysJ8ZsXDy-task",
                      message: "Copy link",
                    })}
              </ReferralLinkButton>
            </CopyToClipboard>
          )}
        </>
      ),
      suggestion: (
        <>
          {status.isActive || status.isBlocked ? (
            <Box
              component="form"
              className="form"
              mt={1}
              autoComplete="off"
              onSubmit={(e: any) => {
                e.preventDefault();
                suggestionFormik.handleSubmit();
              }}
            >
              <Box mb={1}>
                <Input
                  className="c-full-width"
                  placeholder={t({
                    id: "ccnwiTsPwZ7t2t6yDFNrvN-task",
                    message: "Your answer",
                  })}
                  name="description"
                  styles="secondary"
                  value={suggestionFormik.values.description}
                  error={
                    suggestionFormik.touched.description &&
                    Boolean(suggestionFormik.errors.description)
                  }
                  errortext={""}
                  onChange={e => {
                    suggestionFormik.setTouched({
                      ...suggestionFormik.touched,
                      description: true,
                    });
                    suggestionFormik.handleChange(e);
                  }}
                  isDisabled={!isLoaded || status.isBlocked}
                />
              </Box>

              <Button
                className="buttonContent"
                style="task"
                size="task"
                type="submit"
                loading={!isLoaded}
                disabled={!isLoaded || status.isBlocked}
              >
                <Trans id="nBaikuNia3KqysHSL8PP6j-task">Send answer</Trans>
              </Button>
            </Box>
          ) : (
            <>
              {(task.body.suggestionDescription || status.isExpired) &&
                !status.isBlocked && (
                  <p
                    className="c-font-14-20 c-fw-700 c-font-color"
                    style={{ marginTop: "4px" }}
                  >
                    <Trans id="owBBWvka6Jb6co6Adwz8wc-task">Answer:</Trans>{" "}
                    {task.body.suggestionDescription || "-"}
                  </p>
                )}
            </>
          )}
        </>
      ),
      followTwitter: (
        <>
          {connectedTwitter && status.isActive && (
            <Button
              className="buttonContent twitter"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              onClick={handleClick}
            >
              <>
                <Icon name="twitter" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedTwitter && (status.isActive || status.isBlocked) && (
            <TwitterLogin
              className="buttonContent twitter"
              text={buttonName}
              handleData={(data: TSocialDataType) => {
                handleClick(data);
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={status.isBlocked || !isLoaded}
            />
          )}
        </>
      ),
      mentionTwitter: (
        <>
          {connectedTwitter &&
            status.isActive &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <Button
                className="buttonContent twitter"
                style="task"
                size="task"
                type="button"
                loading={!isLoaded}
                disabled={status.isBlocked || !isLoaded}
                onClick={handleClick}
              >
                <>
                  <Icon name="twitter" size="16" className="icon" />
                  {buttonName}
                </>
              </Button>
            )}

          {/* {connectedTwitter &&
            status.isActive &&
            task.body?.taskCompletedTweetId && (
              <Box mt={1}>
                <Button
                  className="buttonContent twitter"
                  style="task"
                  size="task"
                  type="button"
                  href={`https://twitter.com/twitter/status/${task.body.taskCompletedTweetId}`}
                  target="_blank"
                >
                  <>
                    <Icon name="twitter" size="16" className="icon" />
                    {buttonName}
                  </>
                </Button>
              </Box>
            )} */}

          {!connectedTwitter &&
            (status.isActive || status.isBlocked) &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <TwitterLogin
                className="buttonContent twitter"
                text={buttonName}
                handleData={(data: TSocialDataType) => {
                  handleClick(data);
                }}
                iconSize="16"
                isSocialLoaded={isLoaded && isSocialAuthLoaded}
                clickInitFn={socialsClickInitFunction}
                isDisabled={status.isBlocked || !isLoaded}
              />
            )}
        </>
      ),
      tweetTwitter: (
        <>
          {connectedTwitter && status.isActive && (
            <Button
              className="buttonContent twitter"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              onClick={handleClick}
            >
              <>
                <Icon name="twitter" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedTwitter && (status.isActive || status.isBlocked) && (
            <TwitterLogin
              className="buttonContent twitter"
              text={buttonName}
              handleData={(data: TSocialDataType) => {
                handleClick(data);
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={status.isBlocked || !isLoaded}
            />
          )}
        </>
      ),
      reTweetTwitter: (
        <>
          {connectedTwitter && status.isActive && (
            <Button
              className="buttonContent twitter"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
              onClick={handleClick}
            >
              <>
                <Icon name="twitter" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedTwitter && (status.isActive || status.isBlocked) && (
            <TwitterLogin
              className="buttonContent twitter"
              text={buttonName}
              handleData={(data: TSocialDataType) => {
                handleClick(data);
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={!isLoaded || status.isBlocked}
            />
          )}
        </>
      ),
      reTweetQuoteTwitter: (
        <>
          {connectedTwitter &&
            status.isActive &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <Button
                className="buttonContent twitter"
                style="task"
                size="task"
                type="button"
                loading={!isLoaded}
                disabled={status.isBlocked || !isLoaded}
                onClick={handleClick}
              >
                <>
                  <Icon name="twitter" size="16" className="icon" />
                  {buttonName}
                </>
              </Button>
            )}

          {/* {connectedTwitter &&
            status.isActive &&
            task.body?.taskCompletedTweetId && (
              <Box mt={1}>
                <Button
                  className="buttonContent twitter"
                  style="task"
                  size="task"
                  type="button"
                  href={`https://twitter.com/twitter/status/${task.body.taskCompletedTweetId}`}
                  target="_blank"
                >
                  <>
                    <Icon name="twitter" size="16" className="icon" />
                    {buttonName}
                  </>
                </Button>
              </Box>
            )} */}

          {!connectedTwitter &&
            (status.isActive || status.isBlocked) &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <TwitterLogin
                className="buttonContent twitter"
                text={buttonName}
                handleData={(data: TSocialDataType) => {
                  handleClick(data);
                }}
                iconSize="16"
                isSocialLoaded={isLoaded && isSocialAuthLoaded}
                clickInitFn={socialsClickInitFunction}
                isDisabled={status.isBlocked || !isLoaded}
              />
            )}
        </>
      ),
      likeTweetTwitter: (
        <>
          {connectedTwitter &&
            status.isActive &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <Button
                className="buttonContent twitter"
                style="task"
                size="task"
                type="button"
                loading={!isLoaded}
                disabled={status.isBlocked || !isLoaded}
                onClick={handleClick}
              >
                <>
                  <Icon name="twitter" size="16" className="icon" />
                  {buttonName}
                </>
              </Button>
            )}

          {!connectedTwitter &&
            (status.isActive || status.isBlocked) &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <TwitterLogin
                className="buttonContent twitter"
                text={buttonName}
                handleData={(data: TSocialDataType) => {
                  handleClick(data);
                }}
                iconSize="16"
                isSocialLoaded={isLoaded && isSocialAuthLoaded}
                clickInitFn={socialsClickInitFunction}
                isDisabled={status.isBlocked || !isLoaded}
              />
            )}
        </>
      ),
      commentTweetTwitter: (
        <>
          {connectedTwitter &&
            status.isActive &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <Button
                className="buttonContent twitter"
                style="task"
                size="task"
                type="button"
                loading={!isLoaded}
                disabled={status.isBlocked || !isLoaded}
                onClick={handleClick}
              >
                <>
                  <Icon name="twitter" size="16" className="icon" />
                  {buttonName}
                </>
              </Button>
            )}

          {!connectedTwitter &&
            (status.isActive || status.isBlocked) &&
            !task.body?.additionalProgram?.additionalProgramEndAt && (
              <TwitterLogin
                className="buttonContent twitter"
                text={buttonName}
                handleData={(data: TSocialDataType) => {
                  handleClick(data);
                }}
                iconSize="16"
                isSocialLoaded={isLoaded && isSocialAuthLoaded}
                clickInitFn={socialsClickInitFunction}
                isDisabled={status.isBlocked || !isLoaded}
              />
            )}
        </>
      ),
      checkSpaceTwitter: (
        <>
          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent twitter"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
              onClick={handleClick}
            >
              <>
                <Icon name="twitter" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}
        </>
      ),
      joinDiscord: (
        <>
          {connectedDiscord && status.isActive && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              onClick={handleClick}
            >
              <>
                <Icon name="discord" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedDiscord && (status.isActive || status.isBlocked) && (
            <DiscordLogin
              className="buttonContent"
              text={buttonName}
              handleData={(data: TSocialDataType) => {
                handleClick(data);
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={status.isBlocked || !isLoaded}
            />
          )}
        </>
      ),
      roleDiscord: (
        <>
          {connectedDiscord && status.isActive && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              onClick={handleClick}
            >
              <>
                <Icon name="discord" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedDiscord && (status.isActive || status.isBlocked) && (
            <DiscordLogin
              className="buttonContent"
              text={buttonName}
              handleData={(data: TSocialDataType) => {
                handleClick(data);
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={status.isBlocked || !isLoaded}
            />
          )}
        </>
      ),
      joinTelegram: (
        <>
          {connectedTelegram && status.isActive && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
              onClick={handleClick}
            >
              <>
                <Icon name="telegram" size="16" className="icon" />
                {buttonName}
              </>
            </Button>
          )}

          {!connectedTelegram && (status.isActive || status.isBlocked) && (
            <TelegramLogin
              className="buttonContent"
              text={buttonName}
              handleData={() => {
                handleClick();
              }}
              iconSize="16"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={socialsClickInitFunction}
              isDisabled={status.isBlocked || !isLoaded}
            />
          )}
        </>
      ),
      medium: (
        <>
          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked}
              onClick={handleClick}
              href={task.body.link}
              target="_blank"
            >
              <>
                <Icon name="web" size="16" className="icon" />
                <Trans id="qyabwSKtBaGtXzacjJraHz-task">Visit Site</Trans>
              </>
            </Button>
          )}
        </>
      ),
      email: (
        <>
          {status.isActive || status.isBlocked ? (
            <Box
              component="form"
              className="form"
              mt={1}
              autoComplete="off"
              onSubmit={(e: any) => {
                e.preventDefault();
                emailFormik.handleSubmit();
              }}
            >
              <Box mb={1}>
                <Input
                  className="c-full-width"
                  placeholder={t({
                    id: "i3pxDZ8Ax4175vEa33BjSs-task",
                    message: "Your email",
                  })}
                  name="email"
                  styles="secondary"
                  value={emailFormik.values.email}
                  error={
                    emailFormik.touched.email &&
                    Boolean(emailFormik.errors.email)
                  }
                  errortext={""}
                  onChange={e => {
                    emailFormik.setTouched({
                      ...emailFormik.touched,
                      email: true,
                    });
                    emailFormik.handleChange(e);
                  }}
                  isDisabled={!isLoaded || status.isBlocked}
                />
              </Box>

              <Button
                className="buttonContent"
                style="task"
                size="task"
                type="submit"
                loading={!isLoaded}
                disabled={!isLoaded || status.isBlocked}
              >
                <Trans id="h19Pjyeu4Kyq7f1dviWHfF-task">Send answer</Trans>
              </Button>
            </Box>
          ) : (
            <>
              {(task.body.email || status.isExpired) && !status.isBlocked && (
                <p
                  className="c-font-14-20 c-fw-700 c-font-color"
                  style={{ marginTop: "4px" }}
                >
                  <Trans id="wkC2hEaJbY3XS474wHZbkE-task">Email:</Trans>{" "}
                  {task.body.email || "-"}
                </p>
              )}
            </>
          )}
        </>
      ),
      partner: (
        <>
          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked}
              onClick={handleClick}
            >
              <>
                {activeStatus === 1 && (
                  <Icon name="partner-button" size="16" className="icon" />
                )}
                {buttonName}
              </>
            </Button>
          )}
        </>
      ),
      // not done
      multipleSuggestion: <></>,
      // outdated
      sequence: <></>,
      watchVideo: (
        <>
          <WatchVideoPopup
            isPopupOpened={watchVideoPopupOpen}
            watchVideoTask={task}
            isLoaded={isLoaded}
            setIsPopupOpened={setWatchVideoPopupOpen}
            confirmFlow={confirmFlow}
            title={task.title}
          />

          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
              onClick={() => {
                setIsError(false);
                setErrorMessage("");
                setWatchVideoPopupOpen(true);
              }}
            >
              <>
                <Icon name="play-video" size="16" className="icon" />
                <Trans id="wm1fXwdAieWzGQD5WRs3Nn-task">Play</Trans>
              </>
            </Button>
          )}
        </>
      ),
      signUp: (
        <>
          {status.isActive && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded}
              onClick={() => {
                dispatch(setIsOnboardingPopupOpen(true));
              }}
            >
              <Trans id="kX7eoadmStH5EMphLhHkxZ-task">Sign Up or Login</Trans>
            </Button>
          )}
        </>
      ),
      token: onChainTaskContent(),
      nft: onChainTaskContent(),
      blockchainUser: onChainTaskContent(),
      valueHolder: onChainTaskContent(),
      nativeHolder: onChainTaskContent(),
      dexLiquidityProvider: onChainTaskContent(),
      allBridge: onChainTaskContent(),
      daily: task.body.subTasks && (
        <Box
          sx={{
            ".swiper": {
              paddingLeft: "1px",
              maxWidth: 500,
              marginLeft: "0",
              marginRight: "0",
              "@media (max-width: 1400px)": {
                maxWidth: 300,
              },
            },
            ".swiper-slide": {
              width: "100% !important",
            },
            ".swiper-slide-active": {
              height: "100% !important",
            },
          }}
        >
          <Swiper
            ref={swiperRef}
            preventInteractionOnTransition={false}
            spaceBetween={50}
            slidesPerView={1}
            simulateTouch={true}
            allowTouchMove={false}
            noSwiping={true}
          >
            {task.body.subTasks.map((slide, index) => (
              <SwiperSlide
                style={{ width: "100% !important" }}
                key={`${slide.title}${index}`}
              >
                {slide.status === "active" ? (
                  <Box
                    component="form"
                    className="form"
                    mt={1}
                    pl="5px"
                    autoComplete="off"
                    onSubmit={(e: any) => {
                      e.preventDefault();
                      dailyFormik.handleSubmit();
                    }}
                  >
                    <Box mb={1}>
                      <Input
                        className="c-full-width"
                        placeholder={"Your Link"}
                        name="answer"
                        styles="secondary"
                        value={dailyFormik.values.answer}
                        error={
                          dailyFormik.touched.answer &&
                          Boolean(dailyFormik.errors.answer)
                        }
                        errortext={""}
                        onChange={e => {
                          dailyFormik.setTouched({
                            ...dailyFormik.touched,
                            answer: true,
                          });
                          dailyFormik.handleChange(e);
                        }}
                        isDisabled={!isLoaded || status.isBlocked}
                      />
                    </Box>

                    <Button
                      className="buttonContent"
                      style="task"
                      size="task"
                      type="submit"
                      loading={!isLoaded}
                      disabled={!isLoaded || status.isBlocked}
                    >
                      <Trans id="nBaikuNia3KqysHSL8PP6j-task">
                        Send answer
                      </Trans>
                    </Button>
                  </Box>
                ) : (
                  <>
                    <p
                      className="c-font-14-20 c-fw-700 c-font-color"
                      style={{
                        marginTop: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Trans id="owBBWvka6Jb6co6Adwz8wc-task">Answer:</Trans>{" "}
                      {slide.answer}
                    </p>
                  </>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ),
      customWebhook: (
        <>
          {(status.isActive || status.isBlocked) && (
            <>
              {tabs.length > 1 && (
                <Tabs
                  type="secondary"
                  activeTab={activeTab}
                  tabs={tabs}
                  changeFn={setActiveTab as (value: string) => void}
                />
              )}
              {activeTab !== EWebhookTaskTabs.WALLET && (
                <Box
                  component="form"
                  className="form"
                  mt={1.5}
                  autoComplete="off"
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    activeTab === EWebhookTaskTabs.EMAIL &&
                      webhookEmailFormik.handleSubmit();
                    activeTab === EWebhookTaskTabs.PHONE &&
                      webhookPhoneFormik.handleSubmit();
                    activeTab === EWebhookTaskTabs.TEXT &&
                      webhookTextFormik.handleSubmit();
                  }}
                >
                  <Box mb={1}>
                    {activeTab === EWebhookTaskTabs.EMAIL && (
                      <Input
                        className="c-full-width"
                        placeholder={t({
                          id: "uyd3NE9evCG4QkitdZzAPF-task",
                          message: "Your email",
                        })}
                        name="email"
                        styles="secondary"
                        value={webhookEmailFormik.values.email}
                        error={
                          webhookEmailFormik.touched.email &&
                          Boolean(webhookEmailFormik.errors.email)
                        }
                        errortext={""}
                        onChange={e => {
                          if (isError) {
                            setIsError(false);
                          }

                          webhookEmailFormik.setTouched({
                            ...webhookEmailFormik.touched,
                            email: true,
                          });
                          webhookEmailFormik.handleChange(e);
                        }}
                        isDisabled={!isLoaded || status.isBlocked}
                      />
                    )}

                    {activeTab === EWebhookTaskTabs.PHONE && (
                      <PhoneInput
                        className="c-full-width"
                        placeholder={t({
                          id: "d7H3ejdsWJvopAnNhX76p3-task",
                          message: "Your phone",
                        })}
                        name="phone"
                        value={webhookPhoneFormik.values.phone}
                        setValue={data =>
                          webhookPhoneFormik.setFieldValue("phone", data)
                        }
                        isPhoneInvalid={Boolean(
                          webhookPhoneFormik.errors.phone,
                        )}
                        setPhoneError={(value: string) =>
                          webhookPhoneFormik.setFieldError("phone", value)
                        }
                        noPlaceholder
                      />
                    )}

                    {activeTab === EWebhookTaskTabs.TEXT && (
                      <Input
                        className="c-full-width"
                        placeholder={t({
                          id: "ww2cQjFRjHCGQXjWE1NN3n-task",
                          message: "Your answer",
                        })}
                        name="text"
                        styles="secondary"
                        value={webhookTextFormik.values.text}
                        error={
                          webhookTextFormik.touched.text &&
                          Boolean(webhookTextFormik.errors.text)
                        }
                        errortext={""}
                        onChange={e => {
                          if (isError) {
                            setIsError(false);
                          }

                          webhookTextFormik.setTouched({
                            ...webhookEmailFormik.touched,
                            text: true,
                          });
                          webhookTextFormik.handleChange(e);
                        }}
                        isDisabled={!isLoaded || status.isBlocked}
                      />
                    )}
                  </Box>

                  <Button
                    className="buttonContent"
                    style="task"
                    size="task"
                    type="submit"
                    loading={!isLoaded}
                    disabled={
                      status.isBlocked ||
                      (activeTab === EWebhookTaskTabs.EMAIL &&
                        (!webhookEmailFormik.isValid ||
                          webhookEmailFormik.values.email === "")) ||
                      (activeTab === EWebhookTaskTabs.PHONE &&
                        (!webhookPhoneFormik.isValid ||
                          webhookPhoneFormik.values.phone === "")) ||
                      (activeTab === EWebhookTaskTabs.TEXT &&
                        (!webhookTextFormik.isValid ||
                          webhookTextFormik.values.text === "")) ||
                      !isLoaded
                    }
                  >
                    <Trans id="9LrvVNWu1ySKVSgAs1k5Ca-task">Send answer</Trans>
                  </Button>
                </Box>
              )}

              {activeTab === EWebhookTaskTabs.WALLET && onChainTaskContent()}
            </>
          )}
        </>
      ),
      imageUpload: (
        <>
          <input
            id={`imgUpload_${task.id}`}
            type="file"
            name={"imgSrc"}
            style={{ display: "none" }}
            onChange={e => {
              setIsError(false);
              setErrorMessage(null);
              imageUploadFormik.setFieldValue("imgSrc", e.target.files[0]);
              setTimeout(() => {
                imageUploadFormik.handleSubmit();
              }, 500);
            }}
            accept="image/*"
          />
          {(status.isActive || status.isBlocked) && (
            <Button
              as="label"
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={status.isBlocked || !isLoaded}
              href={task.body.link}
              target="_blank"
              htmlFor={`imgUpload_${task.id}`}
            >
              <>
                <Icon className="icon" name="imageUploadPhoto" size="16" />
                <Trans id="ae60c9d6-10d7-11ee-be56-0242ac120002-task">
                  Upload Image
                </Trans>
              </>
            </Button>
          )}
        </>
      ),
      invite: (() => {
        const computeRefLink = () =>
          `${window.location.origin}/referral-invite?questCode=${task.body.inviteCode}`;

        const disabled = status.isExpired;

        return (
          <Box mt={1.5}>
            {activeStatus > 1 ? (
              <div className={"c-flex-items-center"}>
                {task.body?.inviteCode && !inviteLimitReached && (
                  <>
                    <CopyToClipboard
                      text={computeRefLink()}
                      onCopy={() => setIsLinkCopied(true)}
                    >
                      <InviteButton>
                        <Icon
                          name={isLinkCopied ? "check-mark" : "account-copy"}
                          size={"16"}
                        />
                      </InviteButton>
                    </CopyToClipboard>
                    <Box
                      component={"p"}
                      ml={1}
                      className={"c-font-color c-font-14-20"}
                    >
                      {computeRefLink()}
                    </Box>
                  </>
                )}

                {inviteLimitReached && (
                  <Box className="c-font-16-18 c-fw-500" color="#A9A9A9">
                    <Trans id="sVGY9BEbc9BU5oDVNTnzDy-task">
                      Invite limit reached
                    </Trans>
                  </Box>
                )}

                {!task.body?.inviteCode && (
                  <Button style={"secondary"} loading />
                )}
              </div>
            ) : (
              <Button
                disabled={disabled}
                onClick={handleClick}
                style={"secondary"}
                size={"small"}
              >
                Generate Referral Link
              </Button>
            )}
          </Box>
        );
      })(),
      gitCoin: onChainTaskContent(),
      // shouldn't be visible
      completedOnboarding: (
        <>
          {(status.isActive || status.isBlocked) && (
            <Button
              className="buttonContent"
              style="task"
              size="task"
              type="button"
              loading={!isLoaded}
              disabled={!isLoaded || status.isBlocked}
              onClick={handleClick}
            >
              Complete
            </Button>
          )}
        </>
      ),
    }),
    [
      task,
      status.isDone,
      status.isExpired,
      status.isActive,
      status.isBlocked,
      quizFormik,
      isLoaded,
      quizPreDone,
      confirmFlow,
      referralLinkPreDone,
      suggestionFormik,
      connectedTwitter,
      handleClick,
      buttonName,
      isSocialAuthLoaded,
      socialsClickInitFunction,
      connectedDiscord,
      connectedTelegram,
      emailFormik,
      activeStatus,
      watchVideoPopupOpen,
      setWatchVideoPopupOpen,
      onChainTaskContent,
      tabs,
      activeTab,
      setActiveTab,
      webhookEmailFormik,
      webhookPhoneFormik,
      webhookTextFormik,
      isError,
      isWarning,
      setIsWarning,
      setIsError,
      setReferralLinkPreDone,
      setErrorMessage,
      dispatch,
      dailyFormik,
      imageUploadFormik,
      inviteLimitReached,
      isLinkCopied,
    ],
  );

  const content = useMemo(() => contents[task.type], [contents, task.type]);

  return content;
};

export default useContent;
