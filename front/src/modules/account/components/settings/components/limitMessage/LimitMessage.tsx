import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { LimitMessageWrapper } from "./limitMessage.styles";

const LimitMessage = () => {
  return (
    <LimitMessageWrapper>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="h3"
        mb={{ xs: 1 }}
      >
        <Trans id="2tvr1ot8bEmgtfTiDaZwGw-account">
          Please enter your authentication code
        </Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p">
        <Trans id="4cHgjF6SeuoHK8dQHdYjCt-account">
          You have reached login attempt limit.
        </Trans>
      </Box>

      <Box
        className="c-font-14-20 c-font-color"
        component="p"
        mb={{ xs: 2, md: 3 }}
      >
        <Trans id="hgZxibAHsagRWnHmmfroHw-account">
          Please try again in 24 hours
        </Trans>
      </Box>

      <div className="icon-wrapper">
        <Box className="soc">
          <Icon name="menu-close" size="40" />
        </Box>
      </div>
    </LimitMessageWrapper>
  );
};

export default LimitMessage;
