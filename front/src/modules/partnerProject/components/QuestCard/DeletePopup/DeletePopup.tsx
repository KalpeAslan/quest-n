import { adminQuestService } from "@/api";
import { Modal } from "@/components/UI/modal";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { Wrapper } from "./deletePopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Trans } from "@lingui/macro";

interface Props {
  deleteLinkTitle: string | null;
  setDeleteLinkTitle: Dispatch<SetStateAction<string | null>>;
  getQuests: () => void;
}

const DeletePopup: FC<Props> = ({
  deleteLinkTitle,
  setDeleteLinkTitle,
  getQuests,
}) => {
  const onDelete = useCallback(async () => {
    try {
      await adminQuestService.deleteQuest(deleteLinkTitle);
      getQuests();
      setDeleteLinkTitle(null);
    } catch (error) {
      console.log("Error", error);
    }
  }, [deleteLinkTitle, setDeleteLinkTitle, getQuests]);

  return (
    <>
      {Boolean(deleteLinkTitle) && (
        <Modal isOpen={true} handleClose={() => setDeleteLinkTitle(null)}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              <Trans id="megJr4SokAaprL8SZputGc-partnerProject">
                Delete quest
              </Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={() => setDeleteLinkTitle(null)}
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
                <Trans id="nPLQi31dKPfVNVrmj6Jisv-partnerProject">
                  Are you sure to delete this quest?
                </Trans>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Button
                  style="error"
                  className="c-full-width btn"
                  onClick={() => {
                    onDelete();
                    setDeleteLinkTitle(null);
                  }}
                >
                  <Trans id="rsonWtw6rKALVnvutpHBCG-partnerProject">
                    Delete
                  </Trans>
                </Button>

                <Button
                  style="colorfull"
                  className="c-full-width btn"
                  onClick={() => setDeleteLinkTitle(null)}
                >
                  <Trans id="wCdPnQ2RTD7hfaqysKfrGv-partnerProject">
                    Cancel
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

export default DeletePopup;
