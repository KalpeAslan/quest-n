import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./dailyExpPopup.styles";
import { FC, useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/UI/icon";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { loyaltyService } from "@/api";
import { useRouter } from "next/router";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const DailyExpPopup: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [onboardingLinkTitle, setOnboardingLinkTitle] = useState<string | null>(
    null,
  );

  const { push } = useRouter();

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const getOnboardingQuestLinkTitle = useCallback(async () => {
    const {
      data: { linkTitle },
    } = await loyaltyService.getOnboardingQuestLinkTitle();

    setOnboardingLinkTitle(linkTitle);

    return linkTitle;
  }, []);

  const onClick = useCallback(async () => {
    if (!onboardingLinkTitle) {
      const linkTitle = await getOnboardingQuestLinkTitle();

      push(`/quest/${linkTitle}`);
      handleClose();
      return;
    }

    push(`/quest/${onboardingLinkTitle}`);
    handleClose();
  }, [getOnboardingQuestLinkTitle, handleClose, onboardingLinkTitle, push]);

  useEffect(() => {
    getOnboardingQuestLinkTitle();
  }, [getOnboardingQuestLinkTitle]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper className="c-font-color">
            <Button
              className="c-font-color closeBtn"
              style="icon"
              type="button"
              onClick={handleClose}
            >
              <Icon name="menu-close" size="24" />
            </Button>

            <Icon
              name="alphaExp"
              width={135}
              height={104}
              className="icon c-font-color-3"
            />

            <Box className="c-font-24-28 c-fw-500" mb="15px" textAlign="center">
              <Trans id="7G8S9g8UKTEP6A2549r5f6-dailyExpPopup">
                A couple of steps before you start
              </Trans>
            </Box>

            <Box
              className="c-font-18-22"
              maxWidth="313px"
              mb="30px"
              textAlign="center"
            >
              <Trans id="c3vFULRwknqB331YpsioRy-dailyExpPopup">
                To get daily experience, you need to complete the onboarding
                quest and mint NFT
              </Trans>
            </Box>

            <Box className="buttons">
              <Button
                style="secondary"
                className="button left"
                onClick={handleClose}
              >
                <Trans id="qcGsghMtkgrJN2GAszN7UB-dailyExpPopup">Later</Trans>
              </Button>
              <Button
                style="primary"
                className="button right"
                onClick={onClick}
              >
                <Trans id="hipVtEXdiDrUMDjDLA5ZgY-dailyExpPopup">
                  Start quest
                </Trans>
              </Button>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default DailyExpPopup;
