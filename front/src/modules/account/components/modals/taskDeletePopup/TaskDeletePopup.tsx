import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import { Trans } from "@lingui/macro";
import Icon from "../../../../../components/UI/icon/Icon";
import { Button } from "@components/UI/button";
import Modal from "../../../../../components/UI/modal/Modal";
import { FC } from "react";

interface IProps {
  onClose: () => void;
  open: boolean;
  onSubmit: () => void;
}

export const TaskDeletePopup: FC<IProps> = ({ open, onClose, onSubmit }) => {
  return (
    <Modal closeByOutsideClick isOpen={open} handleClose={onClose}>
      <Box
        textAlign={"center"}
        sx={theme => ({
          width: 400,
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            px: 3,
            width: "100%",
          },
        })}
      >
        <Box
          borderRadius={2}
          px={3}
          pt={2}
          pb={4}
          bgcolor={"var(--color-b0)"}
          position={"relative"}
        >
          <Box className={"c-font-color"}>
            <Box className={"c-font-20-24 c-font-color"} component={"p"}>
              <Trans id={"cccygjnbv-weruigb-3248ykbdg"}>Are you sure?</Trans>
            </Box>
            <Box
              className={"c-pointer"}
              onClick={onClose}
              position={"absolute"}
              right={16}
              top={16}
            >
              <Icon name={"menu-close"} size={"24"} />
            </Box>
          </Box>
          <Box mt={"20px"}>
            <Box className={"c-font-color"}>
              <p className={"c-font-20-22 c-fw-500"}>
                <Trans id={"bdw-2fjdvbskb823"}>
                  Are you want to delete the task?
                </Trans>
              </p>
              <Box component={"p"} className={"c-font-16-18 c-fw-400"} mt={2.5}>
                <Trans id={"sdjvb-2elnmasc-dfvfm"}>
                  This action is irreversible.
                </Trans>
              </Box>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={"20px"}
              mt={4}
              sx={{
                button: {
                  flex: 1,
                },
              }}
            >
              <Button onClick={onClose} style={"secondary"}>
                <Trans id={"svtdkjghk-3hbsv-23r"}>Cancel</Trans>
              </Button>
              <Button onClick={onSubmit} style={"error"}>
                <Trans id={"htrhjdhjk-wlhgkjw-34oihr"}>Delete</Trans>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
