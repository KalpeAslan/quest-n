import { useMemo } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { TSocialAuthType, IAccount, TAuthType } from "@modules/account/models";
import { DisconnectPopupWrapper } from "./disconnectPopup.styles";

type Props = {
  isPopupOpen: boolean;
  accountInfo: IAccount | undefined;
  removeType: TSocialAuthType | TAuthType | "";
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemove: (type: TSocialAuthType | TAuthType) => Promise<void>;
  setRemoveType: React.Dispatch<React.SetStateAction<"" | TSocialAuthType>>;
};

const DisconnectPopup = ({
  isPopupOpen,
  accountInfo,
  removeType,
  setIsPopupOpen,
  handleRemove,
  setRemoveType,
}: Props) => {
  const username = useMemo(() => {
    return (accountInfo?.connectedAccounts as any)[removeType];
  }, [accountInfo, removeType]);

  return (
    <>
      {isPopupOpen && (
        <Modal
          isOpen={true}
          handleClose={() => {
            setRemoveType("");
            setIsPopupOpen(false);
          }}
        >
          <DisconnectPopupWrapper>
            <header className="header">
              <Box
                className={classnames(
                  "title",
                  "c-font-24-26 c-fw-500 c-font-color",
                )}
                component="p"
              >
                <Trans id="eboAAQHhzUykskMcdGqBkg-account">
                  Disconnect account
                </Trans>
              </Box>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={() => {
                  setRemoveType("");
                  setIsPopupOpen(false);
                }}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </header>

            <div className="content">
              <Box className={classnames("soc", `button-${removeType}`)} mb={3}>
                <Icon name={removeType} size="24" />

                <Box
                  className="c-font-16-22 c-fw-500 c-font-color"
                  component="p"
                  ml={1.25}
                >
                  {username}
                </Box>
              </Box>

              <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                <Trans id="hKYJqE1kgGA8sFJUJXKdwj-account">
                  Are you sure? If you&apos;ll disconnect an account, all
                  progress in the ongoing tasks will be deleted.
                </Trans>
              </Box>

              <footer className="footer">
                <Button
                  className="butt"
                  style="colorfull-error"
                  size="medium"
                  type="button"
                  onClick={() => {
                    setRemoveType("");
                    setIsPopupOpen(false);

                    if (
                      removeType === "discord" ||
                      removeType === "telegram" ||
                      removeType === "twitter" ||
                      removeType === "google" ||
                      removeType === "email" ||
                      removeType === "phone"
                    ) {
                      handleRemove(removeType);
                    }
                  }}
                >
                  <Box className="c-font-16-20 c-fw-500" component="p">
                    <Trans id="9hnCkBb16xNE7BmHtAZEXB-account">
                      Disconnect
                    </Trans>
                  </Box>
                </Button>

                <Button
                  className="butt"
                  style="colorfull"
                  size="medium"
                  type="button"
                  onClick={() => {
                    setRemoveType("");
                    setIsPopupOpen(false);
                  }}
                >
                  <Box className="c-font-16-20 c-fw-500 c-font-color">
                    <Trans id="pfnaureCHcuMfaaewbrhZp-account">Cancel</Trans>
                  </Box>
                </Button>
              </footer>
            </div>
          </DisconnectPopupWrapper>
        </Modal>
      )}
    </>
  );
};

export default DisconnectPopup;
