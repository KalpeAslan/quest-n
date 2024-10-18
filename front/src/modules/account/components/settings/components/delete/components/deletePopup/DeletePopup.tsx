import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { DeletePopupWrapper } from "./deletePopup.styles";

type Props = {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  handleCancelDelete: () => void;
};

const DeletePopup = ({
  isPopupOpen,
  setIsPopupOpen,
  handleDelete,
  handleCancelDelete,
}: Props) => {
  return (
    <>
      {isPopupOpen && (
        <Modal
          isOpen={true}
          handleClose={() => {
            setIsPopupOpen(false);
          }}
        >
          <DeletePopupWrapper>
            <header className="header">
              <Box
                className={classnames(
                  "title",
                  "c-font-24-26 c-fw-500 c-font-color",
                )}
                component="p"
              >
                <Trans id="5bBkDcetvnWT99n1LSqxo6-account">
                  Delete account
                </Trans>
              </Box>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={() => {
                  setIsPopupOpen(false);
                }}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </header>

            <div className="content">
              <Box className="soc" mb={3}>
                <Icon name="loyalty-delete-user" size="40" />

                <div className="decor" />
              </Box>

              <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                <Trans id="se8j4HPotHvYNgKkLyB4k7-account">
                  Are you sure you want to delete your account? All your data
                  and achievements will be lost!
                </Trans>
              </Box>

              <footer className="footer">
                <Button
                  className="butt"
                  style="colorfull-error"
                  size="medium"
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);

                    handleDelete();
                  }}
                >
                  <Box className="c-font-16-20 c-fw-500" component="p">
                    <Trans id="wbPKY6qsqz1oPFhha9EaNz-account">Delete</Trans>
                  </Box>
                </Button>

                <Button
                  className="butt"
                  style="colorfull"
                  size="medium"
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    handleCancelDelete();
                  }}
                >
                  <Box className="c-font-16-20 c-fw-500 c-font-color">
                    <Trans id="eHCQnqPjPTxujHTn1yoVdy-account">Cancel</Trans>
                  </Box>
                </Button>
              </footer>
            </div>
          </DeletePopupWrapper>
        </Modal>
      )}
    </>
  );
};

export default DeletePopup;
