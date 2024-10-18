import Modal from "@components/UI/modal/Modal";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import Icon from "../../../../../components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import Button from "../../../../../components/UI/button/Button";
import { loyaltyService } from "@api";
import { useRouter } from "next/router";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getIsFinishPopupOpen } from "@store/slices/system/system.selector";
import { setFinishTourPopupOpen } from "@store/slices/system/system.slice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useState } from "react";
import { LoggerService } from "@services";
import { isMobile } from "react-device-detect";

export const ExperienceFinishTourModal = () => {
  const { push } = useRouter();
  const isOpen = useTypedSelector(getIsFinishPopupOpen);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(setFinishTourPopupOpen(false));
    window.location.reload();
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStartQuest = async () => {
    setIsLoading(true);
    try {
      const { data } = await loyaltyService.getOnboardingQuestLinkTitle();
      push(`/quest/${data.linkTitle}`).then(() => {
        if (isMobile) {
          window.location.reload();
        }
      });
    } catch (e) {
      LoggerService.error("ExperienceFinishTourModal", e);
    }
  };

  return (
    isOpen && (
      <Modal isOpen={true} handleClose={handleClose}>
        <Box
          width={"100%"}
          sx={theme => ({
            [".experience-tour-modal"]: {
              width: 540,
            },
            [theme.breakpoints.down(CBreakpoints.sm)]: {
              px: 3,
              py: 3,
              [".experience-tour-modal"]: {
                width: "100%",
                boxShadow: "0px 0px 34px 0px rgba(135, 246, 150, 0.30)",
              },
              [".exp-finish-modal__description"]: {
                padding: "0 30px",
              },
            },
          })}
        >
          <Box
            borderRadius={"16px"}
            className={"experience-tour-modal"}
            bgcolor={"var(--color-b0)"}
            pb={4}
          >
            <Box
              position={"relative"}
              className={"c-flex c-flex-items-center items-justified-center"}
              p={2}
            >
              <Box
                style={{ cursor: "pointer" }}
                position={"absolute"}
                top={14}
                right={24}
                color={"white"}
                onClick={handleClose}
              >
                <Icon name={"menu-close"} size={"24"} />
              </Box>
            </Box>

            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"start"}
              textAlign={"center"}
            >
              <Box>
                <Icon name={"alphaGuiltyLogo"} size={"190"} />
              </Box>
              <p className={"c-font-27-27 c-font-color c-fw-500"}>
                <Trans id={"ssd-43njkjdhv-4jkhbf7g-dfbnn"}>
                  {"Let's start your journey!"}
                </Trans>
              </p>
              <Box
                maxWidth={500}
                mt={2}
                className={
                  "c-font-18-20 c-fw-400 c-font-color exp-finish-modal__description"
                }
              >
                <Trans id={"ssdv-2dv-fddvjndf-23ljf-dfzjbnd"}>
                  Complete your Onboarding quest and get your first experience
                  points!
                </Trans>
              </Box>

              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mt={2.5}
                gap={3}
              >
                <Button style={"secondary"} onClick={handleClose}>
                  <Trans id={"sdg4jbkdjb-2jkbeh4-bdbk2"}>Later</Trans>
                </Button>
                <Button
                  loading={isLoading}
                  onClick={handleStartQuest}
                  style={"primary"}
                >
                  <Trans id={"xplkmijnbgv-fghuytfvbnj"}>Start quest</Trans>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    )
  );
};
