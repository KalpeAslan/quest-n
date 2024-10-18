import { Modal } from "@/components/UI/modal";
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react";
import { Wrapper } from "./deployCollectionSuccessPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import Image from "next/image";
import { CHAINS } from "@/models";
import { Trans } from "@lingui/macro";

interface Props {
  setPopupData: Dispatch<
    SetStateAction<{
      id: number;
      address: string;
      image: string;
      chain: string;
    }>
  >;
  popupData: {
    id: number;
    address: string;
    image: string;
    chain: string;
  };
  onContinue: () => Promise<void>;
}

const DeployCollectionSuccessPopup: FC<Props> = ({
  setPopupData,
  popupData,
  onContinue,
}) => {
  const isOpen = useMemo(
    () =>
      (popupData?.id || popupData?.id === 0) &&
      popupData?.address &&
      popupData?.image &&
      popupData?.chain,
    [popupData],
  );

  const handleClose = useCallback(() => setPopupData(null), [setPopupData]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              <Trans id="dvHZ7DJD8hr67mxrWGCvYQ-quest">Congratulations!</Trans>
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
              <Image
                src={popupData.image}
                width={154}
                height={154}
                alt="Nft Collection"
              />

              <Box
                className="c-font-color c-font-20-24 c-fw-500"
                mt="10px"
                mb="10px"
              >
                <Trans id="gjoV7dBQ76ecvyMevtPFRB-quest">
                  Successful transaction!
                </Trans>
              </Box>

              <Box className="c-font-color c-font-16-24" mb="5px">
                <Trans id="t1RgB2ydmfX4oYMWCFfRYc-quest">
                  You created a new NFT collection
                </Trans>
              </Box>

              <Box
                component="a"
                href={`${CHAINS[popupData.chain].scanLink}address/${
                  popupData.address
                }`}
                target="_blank"
                className="c-font-color-3 c-font-16-24 c-fw-500"
                sx={{ textDecoration: "none" }}
                mb="30px"
              >
                <Trans id="8XS1HgsKanZcp6DKx8otvb-quest">
                  View on Blockchain Explorer
                </Trans>
              </Box>

              <Button
                style="colorfull"
                className="button c-full-width"
                onClick={onContinue}
              >
                <Trans id="nd62vipXmT7HN9R77Af8bQ-quest">Continue</Trans>
              </Button>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default DeployCollectionSuccessPopup;
