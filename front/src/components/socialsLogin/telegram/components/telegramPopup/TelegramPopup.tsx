import { Modal } from "@/components/UI/modal";
import { FC, useCallback, useState } from "react";
import { Wrapper } from "./telegramPopup.styles";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import CopyToClipboard from "react-copy-to-clipboard";
import { entryService } from "@/api";
import { appConfig } from "@/app.config";
import { Box } from "@mui/material";
import classNames from "classnames";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  authCode: string;
  handleData: any;
}

enum EConnectTgStatus {
  CODE = "code",
  VERIFY = "verify",
  SUCCESS = "success",
  ERROR = "error",
}

const TelegramPopup: FC<Props> = ({
  isOpen,
  setIsOpen,
  authCode,
  handleData,
}) => {
  const [status, setStatus] = useState<EConnectTgStatus>(EConnectTgStatus.CODE);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setStatus(EConnectTgStatus.CODE);
    if (status === EConnectTgStatus.SUCCESS) {
      handleData();
    }
  }, [setIsOpen, handleData, status]);

  const onCopy = useCallback(() => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, []);

  const onGoToBot = useCallback(() => setStatus(EConnectTgStatus.VERIFY), []);

  const onVerify = useCallback(async () => {
    setLoading(true);
    try {
      await entryService.verifyTelegram();
      setStatus(EConnectTgStatus.SUCCESS);
    } catch (error) {
      setStatus(EConnectTgStatus.ERROR);
    } finally {
      setLoading(true);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper className="c-font-color">
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              <Trans id="bKELB8jy2gDR9Wg6xAYV72-telegramPopup">
                Verify your Telegram
              </Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box
              className={classNames("content", {
                pt:
                  status === EConnectTgStatus.SUCCESS ||
                  status === EConnectTgStatus.ERROR,
              })}
            >
              {status === EConnectTgStatus.CODE && (
                <>
                  <Box
                    className="c-font-20-24 c-fw-500"
                    mb="29px"
                    textAlign="center"
                  >
                    <Trans id="1Tgn5gZRAC9ssJS8DUKCCo-telegramPopup">
                      DM our bot and Verify your Account
                    </Trans>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="fit-content"
                    ml="auto"
                    mr="auto"
                    mb="20px"
                  >
                    <CopyToClipboard text={authCode} onCopy={onCopy}>
                      <Button style="secondary" className="copyButton">
                        <Icon
                          name={!copied ? "account-copy" : "check-mark"}
                          size="16"
                          color={!copied ? "#fafafa" : "#87f696"}
                        />
                      </Button>
                    </CopyToClipboard>

                    <Box className="c-font-16-18 c-fw-500">{authCode}</Box>
                  </Box>

                  <Button
                    style="colorfull"
                    className="botButton"
                    target="_blank"
                    onClick={onGoToBot}
                    href={`https://t.me/${appConfig.NEXT_PUBLIC_TG_AUTH_BOT}`}
                  >
                    <Trans id="qhuXK33Je1DG9Z4JMAnUuF-telegramPopup">
                      Message to Bot
                    </Trans>
                  </Button>
                </>
              )}

              {status === EConnectTgStatus.VERIFY && (
                <>
                  <Box
                    className="c-font-20-24 c-fw-500"
                    textAlign="center"
                    mb="20px"
                  >
                    <Trans id="oKnPdKDbGX5iVci57wrXbp-telegramPopup">
                      Verify and bind
                      <br />
                      your Telegram Account
                    </Trans>
                  </Box>

                  <Button
                    style="colorfull"
                    className="botButton"
                    onClick={onVerify}
                    loading={loading}
                    disabled={loading}
                  >
                    <Trans id="uzmHhgkKm9fhw4k51rgTzo-telegramPopup">
                      Verify
                    </Trans>
                  </Button>
                </>
              )}

              {status === EConnectTgStatus.SUCCESS && (
                <>
                  <Icon
                    name="tgSuccess"
                    width={115}
                    height={76}
                    className="icon"
                  />

                  <Box className="c-font-28-26 c-fw-500" textAlign="center">
                    <Trans id="sVQNS2dvgwqTCLXZ7j8JXA-telegramPopup">
                      Your Telegram connected successfully!
                    </Trans>
                  </Box>
                </>
              )}

              {status === EConnectTgStatus.ERROR && (
                <>
                  <Icon
                    name="tgError"
                    width={115}
                    height={76}
                    className="icon"
                  />

                  <Box className="c-font-28-26 c-fw-500" textAlign="center">
                    <Trans id="72t4BC9jvgAYmamrLckyYg-telegramPopup">
                      Your Telegram is not verified
                    </Trans>
                  </Box>
                </>
              )}

              <Box className="steps">
                <Box
                  className="dot active"
                  mr={1}
                  onClick={() => setStatus(EConnectTgStatus.CODE)}
                />

                <Box
                  className="c-font-14-20 stepText active"
                  onClick={() => setStatus(EConnectTgStatus.CODE)}
                  mr={1}
                >
                  <Trans id="k6Wo4yhuh1S4dgeHg1LRZo-telegramPopup">
                    DM our Bot
                  </Trans>
                </Box>

                <Box
                  className={classNames("divider", {
                    active: status !== EConnectTgStatus.CODE,
                  })}
                  mr={1}
                />

                <Box
                  className={classNames("dot", {
                    active: status !== EConnectTgStatus.CODE,
                  })}
                  onClick={() => setStatus(EConnectTgStatus.VERIFY)}
                  mr={1}
                />

                <Box
                  className={classNames("c-font-14-20 stepText", {
                    active: status !== EConnectTgStatus.CODE,
                  })}
                  onClick={() => setStatus(EConnectTgStatus.VERIFY)}
                  mr={1}
                >
                  <Trans id="6MJnLNyLFtfF4H2rHJE4xx-telegramPopup">
                    Verify & connect
                  </Trans>
                </Box>

                <Box
                  className={classNames("divider", {
                    active: status === EConnectTgStatus.SUCCESS,
                    error: status === EConnectTgStatus.ERROR,
                  })}
                  mr={1}
                />

                <Box
                  className={classNames("c-font-28-26 stepText", {
                    active: status === EConnectTgStatus.SUCCESS,
                    error: status === EConnectTgStatus.ERROR,
                  })}
                >
                  {status === EConnectTgStatus.ERROR ? (
                    <>!</>
                  ) : (
                    <Icon name="check-mark" size="24" />
                  )}
                </Box>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default TelegramPopup;
