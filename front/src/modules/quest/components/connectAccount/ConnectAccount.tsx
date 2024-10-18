import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Account } from "@components/account";

import { Wrapper } from "./connectAccount.styles";
import Link from "next/link";

type Props = {
  title: string;
  redirectUrl?: string;
};

const ConnectAccount = ({ title, redirectUrl }: Props) => {
  return (
    <Wrapper>
      {title && (
        <Box component="p" className="c-font-16-22 c-font-color" mb={2}>
          {title}
        </Box>
      )}

      <Account redirectUrl={redirectUrl ? redirectUrl : "/profile/experience"} />

      <Box component="p" className={classnames("text", "c-font-12-16")} mt={2}>
        <Trans id="wtS8MiCLohCEXAubo3B3YD-quest">
          By login, you agree to the{" "}
          <Link
            href="/terms-and-condition"
            className={classnames("link", "c-font-12-16")}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className={classnames("link", "c-font-12-16")}
          >
            Privacy Policy
          </Link>
          .
        </Trans>
      </Box>
    </Wrapper>
  );
};

export default ConnectAccount;
