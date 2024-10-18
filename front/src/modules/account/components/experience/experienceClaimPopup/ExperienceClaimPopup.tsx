import { Box } from "@mui/material";
import Modal from "@components/UI/modal/Modal";
import { CBreakpoints } from "@styles/variables";
import { LevelExp } from "@modules/account/models";
import Icon from "@components/UI/icon/Icon";
import Button from "@components/UI/button/Button";
import Image from "next/image";
import { appConfig } from "@/app.config";

interface IProps {
  isOpen: boolean;
  handleClose: () => void;
  exp: LevelExp;
}

export const ExperienceClaimPopup = ({ isOpen, handleClose, exp }: IProps) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <Box
        width={"100%"}
        sx={theme => ({
          [".modal"]: {
            width: 420,
            pb: 3,
          },
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            px: 3,
            [".modal"]: {
              width: "100%",
            },
          },
        })}
      >
        <Box
          className={"modal"}
          width={"100%"}
          bgcolor={"#101313"}
          borderRadius={2}
        >
          <Box textAlign={"end"}>
            <Box position={"relative"} top={16} right={16}>
              <Icon
                name={"menu-close"}
                size={"20"}
                className={"c-font-color c-pointer"}
                onClick={handleClose}
              />
            </Box>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"center"}
            gap={"30px"}
          >
            <Box>
              <Image
                style={{ borderRadius: "50%" }}
                src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${exp.image}`}
                alt={exp.name}
                width={190}
                height={190}
              />
            </Box>
            <Box
              component={"div"}
              textAlign={"center"}
              className={"c-font-27-27 c-fw-500 c-font-color"}
            >
              <Box lineHeight={"35px"} component={"span"}>
                Congratulations! <br /> {"You've"}reached the <br />
              </Box>
              <span
                className={"c-font-color-3"}
                style={{ whiteSpace: "nowrap" }}
              >
                {exp.name} level
              </span>
            </Box>

            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
              justifyContent={"center"}
              bgcolor={"#1C1E1E"}
              py={2}
              borderRadius={2}
              px={2.5}
              maxWidth={340}
            >
              <Box
                component={"p"}
                className={"c-font-18-20 c-fw-500 c-font-color"}
              >
                Your bonuses:
              </Box>

              <Box
                display={"flex"}
                alignItems={"start"}
                justifyContent={"left"}
                flexDirection={"column"}
                gap={1}
                mt={2}
              >
                {exp.benefits.map((benefit, index) => (
                  <Box display={"flex"} gap={1} key={index}>
                    <Icon
                      name={"star"}
                      size={"16"}
                      className={"c-font-color-3"}
                    />
                    <Box
                      component={"p"}
                      className={"c-font-16-22 c-fw-400 c-font-color"}
                    >
                      {benefit}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Button style={"primary"} onClick={handleClose}>
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
