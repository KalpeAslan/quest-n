import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Footer } from "./activeTwoFactorAuth.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

type Props = {
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const ActiveTwoFactorAuth = ({ setActiveFlow }: Props) => {
  const accountInfo = useTypedSelector(getAccountInfo);

  return (
    <>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={{ xs: accountInfo?.security?.phoneNumber ? 0.5 : 3 }}
      >
        <Trans id="mNfzGtFRbkDfGS6Knox6td-account">
          Two-Factor Authentication has been activated
        </Trans>
      </Box>

      {accountInfo?.security?.phoneNumber && (
        <Box className="c-font-14-20 c-font-color" component="p" mb={3}>
          {accountInfo.security.phoneNumber}
        </Box>
      )}

      <Footer>
        <Box mb={1.2}>
          <Button
            className="link"
            type="submit"
            style="icon"
            onClick={() => {
              setActiveFlow("Change number");
            }}
          >
            <Trans id="5gCTb8KYsVZr5TSWab36AS-account">
              Activate on new number
            </Trans>
          </Button>
        </Box>

        <Button
          className="link"
          type="submit"
          style="icon"
          onClick={() => {
            setActiveFlow("Remove 2fa");
          }}
        >
          <Trans id="bH3HKMs7u3sxbWKHAjzr2X-account">
            Disable two-factor authentication
          </Trans>
        </Button>
      </Footer>
    </>
  );
};

export default ActiveTwoFactorAuth;
