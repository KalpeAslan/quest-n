import { BaseInvitePartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/BaseInvitePartnerProjectPopup";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { InviteToPartnerProjectPopupStyles } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteToPartnerProjectPopup.styles";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: () => void;
}

export const RemoveUserFromPartnerProjectPopup = ({
  isOpen,
  onClose,
  handleSubmit,
}: IProps) => {
  return (
    <BaseInvitePartnerProjectPopup isOpen={isOpen} onClose={onClose}>
      <Box>
        <InviteToPartnerProjectPopupStyles.RemoveUser />
      </Box>
      <Box
        display={"flex"}
        gap={"20px"}
        mt={3}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <p
          className={"c-fw-500 c-font-color c-font-20-22 has-text-align-center"}
        >
          <Trans id={"fxxjdbnk3-23jnbf-1"}>
            Do you want to deny this user access to quest management?
          </Trans>
        </p>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"20px"}
          width={"100%"}
          sx={{
            button: {
              flex: 1,
            },
          }}
          justifyContent={"center"}
        >
          <Button onClick={onClose} style={"secondary"}>
            <Trans id={"dfjbkj340dfvjkb12-fkdjvb"}>Cancel</Trans>
          </Button>
          <Button onClick={handleSubmit} style={"error"}>
            <Trans id={"asdkb34-fdbjkn2-vdfkj"}>Deny access</Trans>
          </Button>
        </Box>
      </Box>
    </BaseInvitePartnerProjectPopup>
  );
};
