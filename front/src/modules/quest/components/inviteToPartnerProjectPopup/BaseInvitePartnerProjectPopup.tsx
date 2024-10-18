import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import Modal from "../../../../components/UI/modal/Modal";
import { ReactNode } from "react";
import Icon from "@components/UI/icon/Icon";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const BaseInvitePartnerProjectPopup = ({
  isOpen,
  onClose,
  children,
  title,
}: IProps) => {
  return (
    <Modal isOpen={isOpen} handleClose={onClose} closeByOutsideClick>
      <Box
        width={"100%"}
        sx={theme => ({
          [".modal"]: {
            width: 480,
          },
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            px: 3,
            [".modal"]: {
              width: "100%",
            },
          },
        })}
      >
        <Box borderRadius={"16px"} className={"modal"} bgcolor={"#101313"}>
          <Box
            py={2}
            position={"relative"}
            borderBottom={title && "1px solid rgba(255, 255, 255, 0.10)"}
            className={
              "c-font-color c-font-24-24 c-fw-500 has-text-align-center"
            }
          >
            <p>{title}</p>
            <Box position={"absolute"} right={22} top={16}>
              <Icon
                name={"menu-close"}
                size={"24"}
                onClick={onClose}
                className={"c-pointer"}
              />
            </Box>
          </Box>
          <Box
            p={"20px 24px 30px 24px"}
            flexDirection={"column"}
            className={
              "c-flex c-flex-items-center items-justified-center c-font-color"
            }
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
