import { FC } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const BootstrapDialog = styled(Dialog)(() => ({
  zIndex: 9000000000,
  "& .MuiPaper-root": {
    margin: "0",
    borderRadius: "0",
    backgroundColor: "transparent",
  },
  "& .MuiDialogContent-root": {
    padding: "0px",
  },
}));

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  closeByOutsideClick?: boolean;
  handleClose: () => void;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  children,
  closeByOutsideClick = true,
  handleClose,
}) => {
  return (
    <BootstrapDialog
      onClose={handleClose}
      open={Boolean(isOpen)}
      onClick={() => {
        if (closeByOutsideClick) {
          handleClose();
        }
      }}
    >
      <DialogContent onClick={e => e.stopPropagation()}>
        {children}
      </DialogContent>
    </BootstrapDialog>
  );
};

export default Modal;
