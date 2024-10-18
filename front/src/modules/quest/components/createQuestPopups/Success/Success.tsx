import { Modal } from "@/components/UI/modal";
import { FC, useMemo } from "react";
import { Wrapper } from "./success.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";
import { appConfig } from "@/app.config";

interface Props {
  isOpen: boolean;
  setIsOpen: (data: boolean) => void;
  partnerProjectLinkTitle: string;
  isUpdate: boolean;
  questId: string | undefined;
}

const Success: FC<Props> = ({
  isOpen,
  setIsOpen,
  partnerProjectLinkTitle,
  isUpdate,
  questId,
}) => {
  const { push } = useRouter();

  const splitTgLink = useMemo(
    () => (appConfig.NEXT_PUBLIC_ADMIN_PANEL_TELEGRAM as string).split("/"),
    [],
  );

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={() => setIsOpen(false)}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              {isUpdate
                ? t({
                    id: "bTGsdgyckFLcLbjCxbjwGQ-quest",
                    message: "Quest updated",
                  })
                : t({
                    id: "hvshyAPeuCK3g5YRrp4RqM-quest",
                    message: "Quest created",
                  })}
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={() => setIsOpen(false)}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box p={3}>
              <Box
                component="p"
                className="c-font-20-24 c-fw-500 c-font-color"
                textAlign="center"
                mb={3}
              >
                {isUpdate
                  ? t({
                      id: "uX6qSoSduMBAC2VPwQE7xa-quest",
                      message: "Updated! 🎉",
                    })
                  : t({
                      id: "4ZLuJqPDCDqXJfETdyTJnb-quest",
                      message: "Congrats! 🎉",
                    })}
              </Box>

              <Box
                component="p"
                className="c-font-16-22 c-font-color"
                textAlign="center"
                mb={3}
              >
                {isUpdate
                  ? t({
                      id: "b4wymmENt5ghhMH56Bokzx-quest",
                      message: `To complete the setup of the quest, you need to Contact our Customer Manager`,
                    })
                  : t({
                      id: "c7W8WNd2PzsodMD8ZAKfe2-quest",
                      message: `To complete the setup of the quest, you need to Contact our Customer Manager`,
                    })}
              </Box>

              <Box className="buttonsWrapper" mb={3}>
                <Button
                  style="secondary"
                  href={appConfig.NEXT_PUBLIC_ADMIN_PANEL_TELEGRAM}
                  target="_blank"
                  className="btn iconBtn"
                >
                  <>
                    <Icon name="telegram" size="24" className="icon tg" />
                    <>@{splitTgLink[splitTgLink.length - 1]}</>
                  </>
                </Button>

                <Button
                  style="secondary"
                  href={`mailto:${appConfig.NEXT_PUBLIC_ADMIN_PANEL_EMAIL}`}
                  target="_blank"
                  className="btn iconBtn mb"
                >
                  <>
                    <Icon name="email" size="24" className="icon" />
                    {appConfig.NEXT_PUBLIC_ADMIN_PANEL_EMAIL}
                  </>
                </Button>
              </Box>

              <Box className="buttonsWrapper">
                <Button
                  style="colorfull"
                  className="btn"
                  onClick={() => {
                    push(
                      `/admin/project/${partnerProjectLinkTitle}/quest/${questId}/preview`,
                    );
                  }}
                >
                  View your Quest
                </Button>
                <Button
                  style="secondary"
                  className="btn"
                  onClick={() => {
                    push(`/admin/project/${partnerProjectLinkTitle}`);
                  }}
                >
                  Go to Quest Control Panel
                </Button>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default Success;
