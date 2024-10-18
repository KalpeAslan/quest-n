import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useAccount } from "wagmi";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";

import {
  RestrictionForCreationStylesWrapper,
  RestrictionForCreationStylesHeader,
  RestrictionForCreationStylesTitle,
  RestrictionForCreationStylesContent,
  RestrictionForCreationStylesSoc,
  RestrictionForCreationStylesFooter,
  RestrictionForCreationStylesButt,
  RestrictionForCreationStylesType,
} from "./restrictionForCreation.styles";
import { setIsRestrictionForCreationPopupOpen } from "@/modules/account/store/account.slice";
import { useMemo } from "react";

const RestrictionForCreationPopup = () => {
  const isRestrictionForCreationPopupOpen = useTypedSelector(
    state => state.account.isRestrictionForCreationPopupOpen,
  );
  const dispatch = useAppDispatch();

  const { connector } = useAccount();

  const walletLogo = useMemo(() => {
    if (connector?.name && connector.name === "MetaMask") {
      return "metamask-logo";
    }

    return "wallet-connect";
  }, [connector]);

  return (
    <>
      {isRestrictionForCreationPopupOpen &&
        isRestrictionForCreationPopupOpen.open && (
          <Modal
            isOpen={true}
            handleClose={() => {
              dispatch(setIsRestrictionForCreationPopupOpen(null));
            }}
          >
            <RestrictionForCreationStylesWrapper>
              <RestrictionForCreationStylesHeader>
                <RestrictionForCreationStylesTitle
                  className={"c-font-24-26 c-fw-500 c-font-color"}
                  component="p"
                >
                  {["in-app", "safari", "discord-disconnected"].includes(
                    isRestrictionForCreationPopupOpen.type,
                  ) ? (
                    ""
                  ) : (
                    <Trans id="aq6s9wXEAArn5VV2VZCtFS-restrictionForCreationPopup">
                      Restriction for connection
                    </Trans>
                  )}
                </RestrictionForCreationStylesTitle>

                <Button
                  className="c-font-color"
                  style="icon"
                  type="button"
                  onClick={() => {
                    dispatch(setIsRestrictionForCreationPopupOpen(null));
                  }}
                  disableTouchStart
                >
                  <Icon name="menu-close" size="24" />
                </Button>
              </RestrictionForCreationStylesHeader>

              <RestrictionForCreationStylesContent>
                {![
                  "phone",
                  "email",
                  "in-app",
                  "safari",
                  "discord-disconnected",
                ].includes(isRestrictionForCreationPopupOpen.type) &&
                  !isRestrictionForCreationPopupOpen.type.includes("login") && (
                    <RestrictionForCreationStylesSoc
                      type={isRestrictionForCreationPopupOpen.type}
                      mb={3}
                    >
                      <Icon
                        name={
                          isRestrictionForCreationPopupOpen.type === "wallet"
                            ? walletLogo
                            : isRestrictionForCreationPopupOpen.type
                        }
                        size="24"
                      />

                      <Box
                        className="c-font-16-22 c-fw-500 c-font-color"
                        component="p"
                        ml={1.25}
                      >
                        {isRestrictionForCreationPopupOpen.username}
                      </Box>
                    </RestrictionForCreationStylesSoc>
                  )}

                <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                  {isRestrictionForCreationPopupOpen.type ===
                    "discord-disconnected" && (
                    <Trans id="eMxp1jHwyZ7xRCixgfg7Fd-restrictionForCreationPopup">
                      We have disconnected your discord account due to
                      inactivity, please reconnect it
                    </Trans>
                  )}

                  {isRestrictionForCreationPopupOpen.type === "in-app" && (
                    <Trans id="2Wjiu7ReFo7QoRh9iGygQ9-restrictionForCreationPopup">
                      Please, open <span>alphaguilty.io</span> in your system
                      browser. We can&apos;t guarantee the proper functioning
                      while you&apos;re using in-app browser.
                    </Trans>
                  )}

                  {isRestrictionForCreationPopupOpen.type === "safari" && (
                    <Trans id="qGdWuT8e11AfTFWdEcdKfT-restrictionForCreationPopup">
                      On some iOS devices pop-ups are blocked by default. To
                      unblock them, go to Settings {">"} Safari {">"} turn the
                      “Block Pop-ups” off and reload the page
                    </Trans>
                  )}
                  {!["in-app", "safari", "discord-disconnected"].includes(
                    isRestrictionForCreationPopupOpen.type,
                  ) &&
                    (isRestrictionForCreationPopupOpen.type.includes(
                      "login",
                    ) ? (
                      <Trans id="aNg1Bt3F9FJMj7LsrJtFmX-restrictionForCreationPopup">
                        Incorrect{" "}
                        {isRestrictionForCreationPopupOpen.type.split("/")[1]}{" "}
                        or password. Note that they are case sensitive.
                      </Trans>
                    ) : (
                      <Trans id="w3qXa5bQK9YCtBHqoYsknh-restrictionForCreationPopup">
                        This{" "}
                        <RestrictionForCreationStylesType>
                          {isRestrictionForCreationPopupOpen.type}
                        </RestrictionForCreationStylesType>{" "}
                        account is already used in another account on Platform.
                        To use, disable it in another account.
                      </Trans>
                    ))}
                </Box>

                <RestrictionForCreationStylesFooter>
                  <RestrictionForCreationStylesButt
                    className={"c-font-color"}
                    style="colorfull"
                    size="medium"
                    type="button"
                    onClick={() => {
                      dispatch(setIsRestrictionForCreationPopupOpen(null));
                    }}
                    disableTouchStart
                  >
                    <Box className="c-font-16-20 c-fw-500">
                      <Trans id="vabryUfAn9ezgWmC6gCNet-restrictionForCreationPopup">
                        OK
                      </Trans>
                    </Box>
                  </RestrictionForCreationStylesButt>
                </RestrictionForCreationStylesFooter>
              </RestrictionForCreationStylesContent>
            </RestrictionForCreationStylesWrapper>
          </Modal>
        )}
    </>
  );
};

export default RestrictionForCreationPopup;
