import { FC } from "react";

import { Box } from "@mui/material";
import { InviteToProjectCreateAccountEmailForm } from "@components/auth/components/InviteToProjectCreateAccountEmailForm/InviteToProjectCreateAccountEmailForm";
import { InviteToProjectLoginAccountEmailForm } from "@components/auth/components/InviteToProjectLoginAccountEmailForm/InviteToProjectLoginAccountEmailForm";

interface AuthProps {
  authFlow?: "login" | "sign-up";
  email: string;
}

export const InviteToPartnerProjectAuth: FC<AuthProps> = ({
  authFlow,
  email,
}) => {
  console.log("authFlow", authFlow);
  return (
    <>
      <Box>
        {authFlow === "login" ? (
          <InviteToProjectLoginAccountEmailForm email={email} />
        ) : (
          <InviteToProjectCreateAccountEmailForm email={email} />
        )}
      </Box>
    </>
  );
};
