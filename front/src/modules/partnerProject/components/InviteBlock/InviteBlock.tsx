import { Box } from "@mui/material";
import Button from "@components/UI/button/Button";
import { useEffect, useState } from "react";
import { InviteForPartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteForPartnerProjectPopup";
import { adminProjectService } from "@api";
import { LoggerService } from "@services";
import { IInvitedUser } from "@models";
import { InvitedUserItem } from "@modules/partnerProject/components/InviteBlock/InvitedUserItem";
import { CBreakpoints } from "@styles/variables";

interface IProps {
  projectLink: string;
}

export const InviteBlock = ({ projectLink }: IProps) => {
  const [showAcceptPartnerProjectPopup, setShowAcceptPartnerProjectPopup] =
    useState<boolean>(false);

  const [invitedUsers, setInvitedUsers] = useState<IInvitedUser[]>([]);

  const getInvitedUsers = async () => {
    try {
      adminProjectService
        .getInvitedUsersOfPartnerProject(projectLink)
        .then(res => setInvitedUsers(res.data));
    } catch (e) {
      LoggerService.error(`Error in InviteBlock`, e);
    }
  };

  useEffect(() => {
    getInvitedUsers();
  }, []);

  return (
    <Box
      position={"relative"}
      sx={theme => ({
        [theme.breakpoints.up(CBreakpoints.md)]: {
          pl: 3,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "1px",
            height: "100%",
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.10)",
            opacity: 0.5,
          },
        },
      })}
    >
      <p className={"c-font-color c-fw-500 c-font-20-22"}>
        Admin Access Sharing
      </p>
      <Box
        mt={1.2}
        mb={3}
        component={"p"}
        className={"c-font-color c-fw-400 c-font-16-18"}
      >
        You can add users to manage quests
      </Box>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
      >
        <Button
          onClick={() => setShowAcceptPartnerProjectPopup(true)}
          style={"secondary"}
        >
          Add users
        </Button>
        <Box
          component={"p"}
          className={"c-font-color c-font-14-16 c-fw-400"}
          sx={{
            textDecoration: "underline",
            opacity: 0.5,
          }}
        >
          Learn more
        </Box>
      </Box>

      {invitedUsers.length ? (
        <Box mt={4}>
          {invitedUsers.map(invitedUser => (
            <InvitedUserItem
              projectLink={projectLink}
              key={invitedUser.investorId}
              user={invitedUser}
              onDelete={getInvitedUsers}
            />
          ))}
        </Box>
      ) : null}

      <InviteForPartnerProjectPopup
        isOpen={showAcceptPartnerProjectPopup}
        onClose={() => setShowAcceptPartnerProjectPopup(false)}
        projectLink={projectLink}
        onSubmit={getInvitedUsers}
      />
    </Box>
  );
};
