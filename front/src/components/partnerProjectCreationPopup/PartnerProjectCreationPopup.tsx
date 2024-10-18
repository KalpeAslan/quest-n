import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./partnerProjectCreationPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { useRouter } from "next/router";
import { ELinks } from "@/models";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getPartnerProjectCreationPopup } from "@/store/slices/system/system.selector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setPartnerProjectCreationPopup } from "@/store/slices/system/system.slice";
import { Trans, t } from "@lingui/macro";
import { getUserPartnerProjectsThunk } from "@modules/account/store/account.thunks";

const PartnerProjectCreationPopup = () => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const { open: isOpen, isUpdate } = useTypedSelector(
    getPartnerProjectCreationPopup,
  );

  const onClose = () => {
    dispatch(
      setPartnerProjectCreationPopup({
        open: false,
        partnerProjectLinkTitle: null,
      }),
    );
    dispatch(getUserPartnerProjectsThunk())
  }

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={onClose}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              {isUpdate
                ? t({
                    id: "dsWUTWNwxSpQfEjujTev2S-partnerCreationPopup",
                    message: "Project updated",
                  })
                : t({
                    id: "gTHxfmXoM9rYB9EKz34RDW-partnerCreationPopup",
                    message: "Project created",
                  })}
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={onClose}
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
                <Trans id="8q6A8Ps7dDwcFp9sNUd39d-partnerProjectCreationPopup">
                  Congrats! 🎉
                </Trans>
              </Box>

              <Box
                component="p"
                className="c-font-16-22 c-font-color"
                textAlign="center"
                mb={3}
              >
                {isUpdate
                  ? t({
                      id: "1Amk95Y3f1JApFDtMmZkd7-partnerCreationPopup",
                      message: "You can create your own quest.",
                    })
                  : t({
                      id: "nAsXuwX11crDtG8MTdR1rE-partnerCreationPopup",
                      message: "Now you can create your own quest.",
                    })}
                <br />
                <br />
                <Trans id="xjjMAq9ERNBwfyX84CAnvh-partnerCreationPopup">
                  To learn how to create a quest,
                  <br />
                  you can watch the{" "}
                  <a
                    href={ELinks.adminPanelTutorial}
                    target="_blank"
                    className="c-font-color-3"
                    rel="noreferrer"
                  >
                    video tutorial
                  </a>
                </Trans>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Button
                  style="colorfull"
                  className="btn c-full-width mr"
                  onClick={() => {
                    push("/admin/projects");
                    onClose();
                  }}
                >
                  <Trans id="avMZoRYdJZmip8fkq687SU-partnerProjectCreationPopup">
                    Create Quest
                  </Trans>
                </Button>

                <Button
                  style="secondary"
                  className="btn c-full-width"
                  onClick={onClose}
                >
                  <Trans id="qxghgd2QmVVuh1XG2L3MRc-partnerProjectCreationPopup">
                    Later
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

export default PartnerProjectCreationPopup;
