import { Modal } from "@/components/UI/modal";
import { FC } from "react";
import { Wrapper } from "./wrongStepPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  returnToSetup: () => void;
}

const WrongStepPopup: FC<Props> = ({ isOpen, onClose, returnToSetup }) => {
  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={onClose}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              <Trans id="gLghjNMvgZuaY9fmvKYsN2-wrongStepPopup">Sorry</Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={onClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className="content">
              <Icon name="info" size="107" className="icon" />

              <Box
                component="h2"
                className="c-font-18-22 c-font-color c-fw-500"
                textAlign="center"
                mb="10px"
              >
                <Trans id="uakXKAYDNsD8hAPf1sgwNJ-wrongStepPopup">
                  You can&apos;t save the quest
                </Trans>
              </Box>
              <Box
                component="p"
                className="c-font-16-22 c-font-color"
                textAlign="center"
                mb="30px"
              >
                <Trans id="uqH6TGqnMPfyGG9BVviA4c-wrongStepPopup">
                  You need to fill out basic information about the quest at the
                  setup stage before saving it.
                </Trans>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                className="c-full-width"
              >
                <Button
                  style="colorfull"
                  className="c-full-width btn mr"
                  onClick={returnToSetup}
                >
                  <Trans id="fHf1fPjaGSUeyqiVtDWHcB-wrongStepPopup">
                    Return to setup stage
                  </Trans>
                </Button>

                <Button
                  style="error"
                  className="c-full-width btn"
                  onClick={onClose}
                >
                  <Trans id="hcnbV6FxprazAiqCmR4VW7-wrongStepPopup">
                    Exit without saving
                  </Trans>
                </Button>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default WrongStepPopup;
