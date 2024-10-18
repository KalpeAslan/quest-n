import { BaseInvitePartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/BaseInvitePartnerProjectPopup";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { InviteToPartnerProjectPopupStyles } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteToPartnerProjectPopup.styles";
import { adminProjectService } from "@api";
import { LoggerService } from "@services";
import { useRouter } from "next/router";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  projectLinkTitle: string;
}

export const LeaveFromPartnerProjectPopup = ({
  isOpen,
  onClose,
  projectLinkTitle,
}: IProps) => {
  const { push } = useRouter();

  const handleSubmit = async () => {
    try {
      await adminProjectService.leaveFromPartnerProject(projectLinkTitle);
      onClose();
      push("/admin/projects");
    } catch (e) {
      LoggerService.error(`Error while leaving from partner project`, e);
    }
  };

  return (
    <BaseInvitePartnerProjectPopup isOpen={isOpen} onClose={onClose}>
      <Box
        display={"flex"}
        gap={"20px"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <InviteToPartnerProjectPopupStyles.RemoveUser />

        <p className={"c-fw-500 c-font-color c-font-20-22"}>
          <Trans id={"fjdbnk3-23jnbf-1"}>
            Do you really want to leave the project?
          </Trans>
        </p>
        <Box
          component={"p"}
          px={2}
          className={"c-font-color c-font-16-22 c-fw-400 has-text-align-center"}
        >
          <Trans id={"dkjnvdf-3njkdb0l34nsv-jsn"}>
            After this action, you will no longer be able to manage this project
            and its quests.
          </Trans>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"20px"}
          sx={{
            width: "100%",
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
            <Trans id={"kb34-fdbjkn2-vdfkj"}>Leave the project</Trans>
          </Button>
        </Box>
      </Box>
    </BaseInvitePartnerProjectPopup>
  );
};
