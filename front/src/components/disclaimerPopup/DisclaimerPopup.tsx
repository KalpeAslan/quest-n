import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getDisclaimerPopupOpen } from "@/store/slices/system/system.selector";
import { Modal } from "../UI/modal";
import { Wrapper } from "./disclaimerPopup.styles";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useCallback, useState } from "react";
import { LocalStorageService } from "@/services";
import { setDisclaimerPopupOpen } from "@/store/slices/system/system.slice";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";

const DisclaimerPopup = () => {
  const [dontShow, setDontShow] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const isOpen = useTypedSelector(getDisclaimerPopupOpen);

  const handleClose = useCallback(() => {
    if (dontShow) {
      LocalStorageService.setItem("dp", true);
    }

    dispatch(setDisclaimerPopupOpen(false));
  }, [dispatch, dontShow]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color c-font-24-24">
              <Trans id="6WBK4FhEvuJyV6vRgWpvZU-disclaimerPopup">
                Disclaimer
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
              p={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                textAlign="center"
                className="c-fw-500 c-font-color c-font-20-24"
                mb={2}
              >
                <Trans id="2e7ckKwv5C7r8Z4ayDVQp6-disclaimerPopup">
                  Please note that AlphaGuilty is an open Quest platform and we
                  only do preliminary verification of spaces.
                </Trans>
              </Box>

              <Box
                textAlign="center"
                className="c-fw-400 c-font-color c-font-16-22"
                mb={2}
              >
                <Trans id="sE7PbdK22m5pxxjnjfqgcY-disclaimerPopup">
                  AlphaQuest will not be liable for losses caused by third
                  parties. Please take caution when authorizing wallets on
                  external websites and be alert for phishing traps.
                </Trans>
              </Box>

              <Button
                style="link"
                className="mbButton"
                disableTouchStart
                href="terms-and-condition"
                target="_self"
                onClick={handleClose}
              >
                <Trans id="e88dw56y8RpVuaJdRR4iQB-disclaimerPopup">
                  View more
                </Trans>
              </Button>

              <Button
                style="colorfull"
                className="mbButton gotBtn"
                onClick={handleClose}
                disableTouchStart
              >
                <Trans id="o2cmVqovidX7gqPiNFDuEQ-disclaimerPopup">
                  Got it
                </Trans>
              </Button>

              <Box
                className="checkboxContainer"
                onClick={() => setDontShow(prev => !prev)}
              >
                <Box className="checkbox">
                  {dontShow && (
                    <Icon name="checkmark" size="22" className="checkboxIcon" />
                  )}
                </Box>

                <Box className="c-fw-400 c-font-color c-font-14-20">
                  <Trans id="c4PBZErav733M4JbUgEtkP-disclaimerPopup">
                    Don&apos;t show it again
                  </Trans>
                </Box>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default DisclaimerPopup;
