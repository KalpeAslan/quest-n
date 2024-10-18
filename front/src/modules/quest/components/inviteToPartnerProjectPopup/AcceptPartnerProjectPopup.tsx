import { BaseInvitePartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/BaseInvitePartnerProjectPopup";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import {
  IAccount,
  IPendingInviteToPartnerProject,
} from "@modules/account/models";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  acceptInviteToPartnerProjectThunk,
  declineInviteToPartnerProjectThunk,
} from "@modules/account/store/account.thunks";
import { InviteToPartnerProjectPopupStyles } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteToPartnerProjectPopup.styles";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const AcceptPartnerProjectPopup = () => {
  const { pathname } = useRouter();
  const accountInfo = useTypedSelector(getAccountInfo) as IAccount;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => setIsOpen(false);

  const project = accountInfo
    .pendingInvitesToPartnerProject[0] as IPendingInviteToPartnerProject;

  useEffect(() => {
    if (
      !(
        pathname === "/inviteToPartnerProjectLogin" ||
        pathname === "/inviteToPartnerProjectSignUp"
      )
    ) {
      setIsOpen(!!accountInfo.pendingInvitesToPartnerProject.length);
    }
  }, [pathname, accountInfo]);

  const dispatch = useAppDispatch();

  const handleAccept = async () => {
    dispatch(
      acceptInviteToPartnerProjectThunk({
        projectId: project.partnerProjectId as number,
      }),
    );
  };
  const handleDecline = async () => {
    dispatch(
      declineInviteToPartnerProjectThunk({
        projectId: project.partnerProjectId as number,
      }),
    );
  };

  return (
    <BaseInvitePartnerProjectPopup isOpen={isOpen} onClose={onClose}>
      {isOpen && project && (
        <Box
          display={"flex"}
          gap={"20px"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <Box>
            <InviteToPartnerProjectPopupStyles.AddUser />
          </Box>
          <div
            className={
              "c-fw-500 c-font-color c-font-24-24 has-text-align-center"
            }
          >
            <Trans id={"5595sc-fjdbnk3-23jnbf-1"}>
              You have been invited to manage the project{" "}
              <span className={"c-font-color"}>{project.partnerProjectId}</span>
            </Trans>
          </div>
          <p
            className={
              "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
            }
          >
            <Trans id={"dkjnvdf-3nsdfjksv-jsn"}>
              Now you can create and manage quests, as well as the profile of
              this project.
            </Trans>
          </p>
          <Box
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
            gap={"20px"}
            justifyContent={"center"}
            sx={{
              button: {
                flex: 1,
              },
            }}
          >
            <Button onClick={handleDecline} style={"error"}>
              <Trans id={"ddvfjbkj340dfvjkb12-fkdjvb"}>Decline</Trans>
            </Button>
            <Button onClick={handleAccept} style={"primary"}>
              <Trans id={"ksdb34-fdbjkn2-vdfkj"}>Accept</Trans>
            </Button>
          </Box>
        </Box>
      )}
    </BaseInvitePartnerProjectPopup>
  );
};
