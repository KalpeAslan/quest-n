import { Modal } from "@components/UI/modal";
import { FC } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { Trans } from "@lingui/macro";
import Icon from "@components/UI/icon/Icon";
import Button from "@components/UI/button/Button";
import { CBreakpoints } from "@styles/variables";
import { setLoginPrevLocation } from "@store/slices/system/system.slice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useRouter } from "next/router";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpiredQuestPopup: FC<IProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const onClick = () => {
    push("/sign-up");
    dispatch(setLoginPrevLocation("/"));
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={onClose}>
          <Box
            sx={theme => ({
              [theme.breakpoints.down(CBreakpoints.sm)]: {
                px: 3,
              },
              p: {
                fontWeight: 500,
              },
            })}
          >
            <Box
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              maxWidth={450}
              minHeight={395}
              p={3}
              position={"relative"}
              borderRadius={2}
              bgcolor={"var(--color-b0)"}
            >
              <Box
                top={16}
                right={16}
                position={"absolute"}
                className={"c-pointer c-font-color"}
                onClick={onClose}
              >
                <Icon name={"menu-close"} size={"24"} />
              </Box>
              <p className={"c-font-color t-align-center c-font-24-24"}>
                <Trans id={"jskdfjsdjfhvnoqpwurqw-quest"}>
                  Missed the quest?
                </Trans>
              </p>
              <Box my={2}>
                <Image
                  width={214}
                  height={138}
                  src={"/images/quest/missed_quest.webp"}
                  alt={"Missed Quest"}
                />
              </Box>
              <p className={"c-font-18-20 t-align-center c-font-color"}>
                <Trans id={"jskdfjnoqpwurqw-quest"}>
                  No worries, new quests are available on AlphaGuilty every day!
                </Trans>
              </p>
              <Box
                mt={4}
                sx={{
                  button: {
                    width: 250,
                  },
                }}
              >
                <Button onClick={onClick} size={"medium"} style={"primary"}>
                  <Trans id={"bjdhj-noqpwurqw-quest"}>Start earning</Trans>
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};
