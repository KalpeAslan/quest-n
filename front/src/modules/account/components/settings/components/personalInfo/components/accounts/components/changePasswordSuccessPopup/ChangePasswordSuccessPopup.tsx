import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./changePasswordSuccessPopup.styles";
import { FC, useCallback } from "react";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ChangePasswordSuccessPopup: FC<Props> = ({ isOpen, setIsOpen }) => {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Button
              className="c-font-color closeBtn"
              style="icon"
              type="button"
              onClick={handleClose}
            >
              <Icon name="menu-close" size="24" />
            </Button>

            <Box
              textAlign="center"
              className="c-font-color c-font-24-24 c-fw-500"
              mb="15px"
            >
              <Trans id="eA8NbJ3DtWWqNFQYkUGxPZ-changePasswordSuccessPopup">
                Password Changed
              </Trans>
            </Box>

            <Box
              textAlign="center"
              className="c-font-color c-font-16-20 c-fw-500"
              mb="25px"
            >
              <Trans id="wTESDhfMbJi3TaRy8bK38x-changePasswordSuccessPopup">
                This will be your new password to login on AlphaGuilty.
              </Trans>
            </Box>

            <Button style="primary" onClick={handleClose} className="button">
              <Trans id="xxDCTAttw8XEmoeP8uzajY-changePasswordSuccessPopup">
                Continue
              </Trans>
            </Button>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default ChangePasswordSuccessPopup;
