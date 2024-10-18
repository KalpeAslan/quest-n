import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { LauncherSectionWrapper } from "./launcherSection.styled";

const Launcher = () => {
  return (
    <LauncherSectionWrapper className="c-wrap" mb={{ xs: 7, sm: 10 }}>
      <div className="container">
        <div className="content">
          <Box
            className={classnames(
              "title",
              "c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color",
            )}
            component="h3"
            mb={{ xs: 3, sm: 4, md: 2 }}
          >
            <Trans id="1qz9gaeM9L1us5ftzGcMK1-ecosystem">
              Guaranteed & lottery-free allocations for real users
            </Trans>
          </Box>

          <div className="decor"></div>

          <p
            className={classnames(
              "text",
              "c-font-16-22 c-sm-font-20-24 c-fw-400 c-font-color",
            )}
          >
            <Trans id="2Q9rrj5dYBntK3QxNRCo2Z-ecosystem">
              We developed an easy and secure way to provide allocations to all
              our users. A sophisticated scoring system allows all investors to
              get an allocation in our presales.
            </Trans>
          </p>
        </div>
      </div>
    </LauncherSectionWrapper>
  );
};

export default Launcher;
