import { useMemo } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { HelperService } from "@services";
import {
  RestrictionForCreationStylesButt,
  RestrictionForCreationStylesFooter,
  RestrictionForCreationStylesHeader,
  RestrictionForCreationStylesSoc,
  RestrictionForCreationStylesContent,
  RestrictionForCreationStylesTitle,
  RestrictionForCreationStylesWrapper,
} from "./restrictionForWallet.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsRestrictionForWalletPopupOpen } from "@store/slices/system/system.slice";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getSystemState } from "@store/slices/system/system.selector";

const RestrictionForWalletPopup = () => {
  const { isRestrictionForWalletPopupOpen } = useTypedSelector(getSystemState);
  const dispatch = useAppDispatch();

  const walletLogo = useMemo(() => {
    if (
      isRestrictionForWalletPopupOpen?.type &&
      isRestrictionForWalletPopupOpen.type === "MetaMask"
    ) {
      return "metamask-logo";
    }

    if (isRestrictionForWalletPopupOpen?.type) {
      return "wallet-connect";
    }
  }, [isRestrictionForWalletPopupOpen]);

  const shortAddress = useMemo(() => {
    if (
      isRestrictionForWalletPopupOpen &&
      isRestrictionForWalletPopupOpen.address
    ) {
      return HelperService.getShortAddress(
        isRestrictionForWalletPopupOpen.address,
        4,
      ).toLocaleLowerCase();
    }

    return "";
  }, [isRestrictionForWalletPopupOpen]);

  return (
    <>
      {isRestrictionForWalletPopupOpen &&
        isRestrictionForWalletPopupOpen.open && (
          <Modal
            isOpen={true}
            handleClose={() => {
              dispatch(setIsRestrictionForWalletPopupOpen(null));
            }}
          >
            <RestrictionForCreationStylesWrapper>
              <RestrictionForCreationStylesHeader>
                <RestrictionForCreationStylesTitle
                  className={"c-font-24-26 c-fw-500 c-font-color"}
                  component="p"
                >
                  <Trans id="wggvoP9kZfKvRiEzohJruF-restrictionForWalletPopup">
                    Restriction for connection
                  </Trans>
                </RestrictionForCreationStylesTitle>

                <Button
                  className="c-font-color"
                  style="icon"
                  type="button"
                  onClick={() => {
                    dispatch(setIsRestrictionForWalletPopupOpen(null));
                  }}
                  disableTouchStart
                >
                  <Icon name="menu-close" size="24" />
                </Button>
              </RestrictionForCreationStylesHeader>

              <RestrictionForCreationStylesContent>
                <RestrictionForCreationStylesSoc mb={3}>
                  <Icon name={walletLogo} size="24" />

                  <Box
                    className="c-font-16-22 c-fw-500 c-font-color"
                    component="p"
                    ml={1.25}
                  >
                    {shortAddress}
                  </Box>
                </RestrictionForCreationStylesSoc>

                <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                  <Trans id="aHnudZXFjpBdVZsmPNvqPR-restrictionForWalletPopup">
                    This wallet is already used in another account on Platform.
                    Please disconnect it first, to use it here.
                  </Trans>
                </Box>

                <RestrictionForCreationStylesFooter>
                  <RestrictionForCreationStylesButt
                    className={"c-font-color"}
                    style="colorfull"
                    size="medium"
                    type="button"
                    onClick={() => {
                      dispatch(setIsRestrictionForWalletPopupOpen(null));
                    }}
                    disableTouchStart
                  >
                    <Box className="c-font-16-20 c-fw-500">
                      <Trans id="cJxbTvEBzgqkc2zqhwoR8B-restrictionForWalletPopup">
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

export default RestrictionForWalletPopup;
