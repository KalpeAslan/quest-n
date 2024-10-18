import { FC, useCallback } from "react";
import { Modal } from "../UI/modal";
import { Wrapper } from "./walletWarningPopup.styles";
import { Box } from "@mui/material";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { saveWalletThunk } from "@/modules/account/store/account.thunks";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  address: string;
  signature: string;
  prevAddress: string;
}

const WalletWarningPopup: FC<Props> = ({
  isOpen,
  handleClose,
  address,
  signature,
  prevAddress,
}) => {
  const dispatch = useAppDispatch();

  const confirmWalletConnection = useCallback(async () => {
    await dispatch(
      sendAnalyticsDataThunk({ type: "wallet_connect_done", options: {} }),
    );

    await dispatch(
      saveWalletThunk({
        address,
        signature,
        type: "MetaMask",
      }),
    );

    await dispatch(
      sendAnalyticsDataThunk({ type: "wallet_verify_done", options: {} }),
    );

    handleClose();
  }, [address, dispatch, handleClose, signature]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              Are you sure?
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className="content">
              <Icon name="warning" size="107" color="#FC5B3F" />

              <Box
                className="c-font-color c-font-18-22 c-fw-500"
                mt="15px"
                mb="10px"
                maxWidth="356px"
                textAlign="center"
              >
                The wallet you connected does not match the previously connected
                wallet:
              </Box>

              <Box className="prevWallet c-font-color-3 c-font-14-22">
                {prevAddress}
              </Box>

              <Box
                className="c-font-color c-font-16-22"
                mb="4px"
                maxWidth="366px"
                textAlign="center"
              >
                Changing the connected wallet will reset progress on on-chain
                tasks in all active quests.
              </Box>

              <Box
                className="c-font-color c-font-16-22"
                mb="30px"
                textAlign="center"
              >
                Are you sure you want to change your wallet?
              </Box>

              <Box className="buttonsContainer">
                <Button
                  style="secondary"
                  className="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button
                  style="error"
                  className="button"
                  onClick={confirmWalletConnection}
                >
                  <>
                    Connect<span className="desktop"> new e-wallet</span>
                  </>
                </Button>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default WalletWarningPopup;
