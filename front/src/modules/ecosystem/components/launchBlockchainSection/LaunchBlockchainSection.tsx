import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { ELinks } from "@models";

import classnames from "classnames";
import { Wrapper } from "./launchBlockchainSection.styles";

const LaunchBlockchain = () => {
  return (
    <Wrapper mb={{ xs: 7, sm: 10 }}>
      <div className={classnames("wrapper", "c-wrap")}>
        <div className="content">
          <Box
            className={classnames(
              "title",
              "c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color",
            )}
            component="h3"
            mb={{ xs: 0, md: 2 }}
          >
            <Trans id="tTRhQ2qqHRpJ6FBvHki9jh-ecosystem">
              Launch blockchain startup or presale from scratch
            </Trans>
          </Box>

          <div className="decor"></div>

          <p
            className={classnames(
              "text",
              "c-font-16-22 c-sm-font-20-24 c-fw-400 c-font-color",
            )}
          >
            <Trans id="f5KgXZRzk8crgJYEFToLxp-ecosystem">
              We offer a variety of tools and services from AlphaGuilty and
              partners to launch any blockchain startup or presale from scratch.
            </Trans>
          </p>

          <Button
            className="button"
            style="colorfull"
            href={ELinks.getInTouch}
            target="_blank"
          >
            <div>
              <Trans id="cxdfi12Cw4xnYM8McpHN9N-ecosystem">Get in Touch</Trans>
            </div>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default LaunchBlockchain;
