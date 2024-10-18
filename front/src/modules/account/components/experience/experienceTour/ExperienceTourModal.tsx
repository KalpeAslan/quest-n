import Modal from "@components/UI/modal/Modal";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import Icon from "../../../../../components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import Button from "../../../../../components/UI/button/Button";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  handleShowTour: () => void;
  handleSkip: () => void;
}
export const ExperienceTourModal = ({
  isOpen,
  handleClose,
  handleShowTour,
  handleSkip,
}: IProps) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <Box
        width={"100%"}
        sx={theme => ({
          [".experience-tour-modal"]: {
            width: 450,
          },
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            px: 3,
            py: 3,
            [".experience-tour-modal"]: {
              width: "100%",
              px: 2,
              boxShadow: "0px 0px 34px 0px rgba(135, 246, 150, 0.30)",
              ".alphaGuiltyLogo": {
                width: "150px !important",
                height: "150px !important",
              }
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
              <Icon className={"alphaGuiltyLogo"} name={"alphaGuiltyLogo"} size={"190"} />
            </Box>
            <p className={"c-font-27-27 c-font-color c-fw-500"}>
              <Trans id={"sjdhv-4jkhbf7g-dfbnn"}>Welcome to AlphaGuilty</Trans>
            </p>
            <Box
              component={"p"}
              mt={2}
              mb={4}
              className={"c-font-27-27 c-font-color c-fw-500"}
            >
              <Trans id={"sjd-4ljenfbs-fsdbb"}>Experience System!</Trans>
            </Box>
            <p className={"c-font-18-20 c-fw-400 c-font-color"}>
              <Trans id={"sdvjndf-23ljf-dfzjbnd"}>
                Here you can track your progress and gain new benefits from
                interacting with the platform.
              </Trans>
            </p>

            <Box
              mt={4}
              pt={2}
              px={2.5}
              pb={2.5}
              maxWidth={375}
              borderRadius={"16px"}
              bgcolor={"var(--color-b25)"}
            >
              <p className={"c-font-18-20 c-fw-500 c-text-center c-font-color"}>
                <Trans id="syit57UKyEEKWSyxmnVM7B-experienceTourModal">
                  Learn how to gain experience with our tutorial!
                </Trans>
              </p>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mt={2.5}
              >
                <Button style={"secondary"} onClick={handleSkip}>
                  <Trans id={"sjbkdjb-2jkbeh4-bdbk2"}>Skip</Trans>
                </Button>
                <Button style={"primary"} onClick={handleShowTour}>
                  <Trans id={"plkmijnbgv-fghuytfvbnj"}>Start tutorial</Trans>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
