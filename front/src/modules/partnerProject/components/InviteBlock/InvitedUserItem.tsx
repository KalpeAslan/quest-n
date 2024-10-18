import { Box } from "@mui/material";
import Icon from "../../../../components/UI/icon/Icon";
import { IInvitedUser } from "@models";
import { useState } from "react";
import { RemoveUserFromPartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/RemoveUserFromPartnerProjectPopup";
import { LoggerService } from "@services";
import { adminProjectService } from "@api";

interface IProps {
  user: IInvitedUser;
  projectLink: string;
  onDelete: () => Promise<void>;
}

export const InvitedUserItem = ({ user, projectLink, onDelete }: IProps) => {
  const [showDenyPopup, setShowDenyPopup] = useState<boolean>(false);

  const handleRemoveUser = async () => {
    try {
      await adminProjectService.removeInvitedUserFromPartnerProject(
        projectLink,
        user.email,
      );
      await onDelete();
      setShowDenyPopup(false);
    } catch (e) {
      LoggerService.error(`Error in handleRemoveUser`, e);
    }
  };

  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"left"}
      gap={"15px"}
      key={user.investorId}
      sx={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
        paddingBottom: 2.5,
        "&:last-child": {
          borderBottom: "none",
          paddingBottom: 0,
        },
      }}
    >
      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius={"10px"}
        height={48}
        border={"1px solid rgba(255, 255, 255, 0.10)"}
      >
        {user.email}
        {user.status === "pending" && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            ml={1}
          >
            <Icon name={"time"} size={"19"} />
          </Box>
        )}
        {user.status === "accepted" && (
          <Box
            ml={1}
            width={9}
            height={9}
            className={"c-font-color-3"}
            bgcolor={"var(--color-gr2)"}
            borderRadius={"50%"}
          />
        )}
      </Box>
      <Box
        height={48}
        width={48}
        display={"flex"}
        alignItems={"center"}
        onClick={() => setShowDenyPopup(true)}
        className={"c-pointer"}
        justifyContent={"center"}
        sx={{
          background: "var(--button-secondary-background-color)",
          borderRadius: 2,
        }}
      >
        <Icon name={"menu-close"} size={"24"} />
      </Box>
      <RemoveUserFromPartnerProjectPopup
        isOpen={showDenyPopup}
        handleSubmit={handleRemoveUser}
        onClose={() => setShowDenyPopup(false)}
      />
    </Box>
  );
};
