import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { Modal } from "../UI/modal";
import { setIsDisconnectWalletPopupOpen } from "@/modules/account/store/account.slice";
import {
  DisconnectWalletPopupStylesContent,
  DisconnectWalletPopupStylesHeader,
  DisconnectWalletPopupStylesTitle,
  DisconnectWalletPopupStylesWrapper,
} from "./disconnectWalletPopup.styles";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { Box } from "@mui/material";
import { disconnectAccountThunk } from "@/modules/account/store/account.thunks";
import { Trans } from "@lingui/macro";
import { useWalletConnect } from "@/hooks";

const DisconnectWalletPopup = () => {
  const isDisconnectWalletPopupOpen = useTypedSelector(
    state => state.account.isDisconnectWalletPopupOpen,
  );

  const dispatch = useAppDispatch();

  const { disconnect: disconnectWallet } = useWalletConnect();

  return (
    <>
      {isDisconnectWalletPopupOpen && (
        <Modal
          isOpen={true}
          handleClose={() => dispatch(setIsDisconnectWalletPopupOpen(false))}
        >
          <DisconnectWalletPopupStylesWrapper>
            <DisconnectWalletPopupStylesHeader>
              <DisconnectWalletPopupStylesTitle
                className="c-font-24-26 c-fw-500 c-font-color"
                component="p"
              >
                <Trans id="jWTK2Tx2JiBS7bYCGmv43E-disconnectWalletPopup">
                  Disconnect wallet
                </Trans>
              </DisconnectWalletPopupStylesTitle>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={() => {
                  dispatch(setIsDisconnectWalletPopupOpen(false));
                }}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </DisconnectWalletPopupStylesHeader>

            <DisconnectWalletPopupStylesContent>
              <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                <Trans id="5cjVhG2jwwgRxvghi2um4G-disconnectWalletPopup">
                  Your account is created via wallet, if you disconnect it you
                  will be logged out from account
                </Trans>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                className="c-full-width"
              >
                <Button
                  style="error"
                  onClick={async () => {
                    await disconnectWallet();
                    await dispatch(disconnectAccountThunk());
                    dispatch(setIsDisconnectWalletPopupOpen(false));
                  }}
                >
                  <Trans id="tKdqjSU6h3uUyvjLJyPKsc-disconnectWalletPopup">
                    Log out
                  </Trans>
                </Button>

                <Button
                  style="secondary"
                  onClick={() => {
                    dispatch(setIsDisconnectWalletPopupOpen(false));
                  }}
                >
                  <Trans id="ekmXKceiRSbGN86EKs7f3Q-disconnectWalletPopup">
                    Cancel
                  </Trans>
                </Button>
              </Box>
            </DisconnectWalletPopupStylesContent>
          </DisconnectWalletPopupStylesWrapper>
        </Modal>
      )}
    </>
  );
};

export default DisconnectWalletPopup;
