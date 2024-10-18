import { FC, useMemo } from "react";
import { Modal } from "../UI/modal";
import { Wrapper } from "./changesWarningPopup.styles";
import { Box } from "@mui/material";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getCurrentPartnerProject } from "@/modules/account/store/account.selector";
import { Trans, t } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSave: () => void;
  handleExit: () => void;
}

const ChangesWarningPopup: FC<Props> = ({
  isOpen,
  handleClose,
  handleSave,
  handleExit,
}) => {
  const { pathname } = useRouter();

  const currentProject = useTypedSelector(getCurrentPartnerProject);

  const isQuest = useMemo(() => pathname.includes("quest"), [pathname]);

  const isEditing = useMemo(() => {
    if (isQuest) {
      return pathname.includes("edit");
    }

    return Boolean(currentProject);
  }, [currentProject, isQuest, pathname]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              <Trans id="kVqSGmGytVWk5B3V7jtkew-changesWarningPopup">
                Are you sure?
              </Trans>
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
                <Trans id="fc7gHfhgHXERWfpyRjGENn-changesWarningPopup">
                  You haven&apos;t finished{" "}
                  {isEditing
                    ? t({
                        id: "6v4q1HeMouuhVLQnbTpG5V-changesWarningPopup",
                        message: "editing",
                      })
                    : t({
                        id: "8ajh2K69bNibHB1oG9xZAh-changesWarningPopup",
                        message: "creating",
                      })}{" "}
                  the{" "}
                  {isQuest
                    ? t({
                        id: "wCmesVWzwUvjkN3vhaNvg4-changesWarningPopup",
                        message: "quest",
                      })
                    : t({
                        id: "9L6K9QaaWeN2tAwTNj3MQa-changesWarningPopup",
                        message: "project",
                      })}
                  .
                </Trans>
              </Box>

              <Box
                className="c-font-color c-font-16-22"
                mb="30px"
                maxWidth="366px"
                textAlign="center"
              >
                <Trans id="3CUdALfvSw2ysnnvHwXgK7-changesWarningPopup">
                  If you leave this page, your changes won&apos;t be saved.
                </Trans>
              </Box>

              <Box className="buttonsContainer">
                <Button style="error" className="button" onClick={() => {
                  handleExit();
                  handleClose();
                }}>
                  <Trans id="wQxRWtzSzZ4CxnXx3tctQ4-changesWarningPopup">
                    Exit
                  </Trans>
                </Button>

                <Button
                  style="secondary"
                  className="button"
                  onClick={handleClose}
                >
                  <Trans id="oWFeqc7V1SiEayWGAWFa32-changesWarningPopup">
                    Cancel
                  </Trans>
                </Button>

                <Button
                  style="primary"
                  className="button"
                  onClick={async () => {
                    await handleSave();
                    handleExit();
                    handleClose();
                  }}
                >
                  <Trans id="jMpKps1BHRNpbe987pqZ2o-changesWarningPopup">
                    Save & Exit
                  </Trans>
                </Button>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default ChangesWarningPopup;
