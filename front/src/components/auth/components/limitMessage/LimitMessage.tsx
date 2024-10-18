import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import {
  LimitMessageStylesButtons,
  LimitMessageStylesLink,
  LimitMessageStylesSoc,
} from "./limitMessage.styles";

const LimitMessage = () => {
  return (
    <>
      <Box
        className="c-font-24-26 c-sm-font-32-38 c-fw-500 c-font-color"
        component="h3"
        mb={{ xs: 1 }}
      >
        <Trans id="3n6iX9MWU5DUse7vkPgr3e-auth">
          Please enter your authentication code
        </Trans>
      </Box>

      <Box className="c-font-20-24 c-fw-500 c-font-color" component="p">
        <Trans id="6wpNXf3s9h9CwMMS3CQtgb-auth">
          You have reached login attempt limit.
        </Trans>
      </Box>

      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={{ xs: 2, md: 3 }}
      >
        <Trans id="5rNtWHFStAqFggdQmi3cun-auth">
          Please try again in 24 hours
        </Trans>
      </Box>

      <LimitMessageStylesSoc mb={{ xs: 2, md: 3 }}>
        <Icon name="menu-close" size="40" />
      </LimitMessageStylesSoc>

      <LimitMessageStylesButtons>
        <LimitMessageStylesLink
          type="button"
          style="icon"
          href="/"
          target="_self"
        >
          <Trans id="dJ59NztUfEGVtQ6frYpadk-auth">To Home Page</Trans>
        </LimitMessageStylesLink>
      </LimitMessageStylesButtons>
    </>
  );
};

export default LimitMessage;
