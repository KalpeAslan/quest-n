import { Box } from "@mui/material";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Decor } from "@components/decor";
import { ELinks } from "@models";
import { ApplySectionWrapper } from "./applySection.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getSystemState } from "@store/slices/system/system.selector";

const ApplySection = () => {
  const { theme } = useTypedSelector(getSystemState);

  return (
    <ApplySectionWrapper className="c-wrap" component="section">
      <div className="content">
        <Box
          className="c-font-20-24 c-sm-font-32-38 c-md-font-48-56 c-font-color"
          component="h2"
          sx={{ fontWeight: 500 }}
        >
          <Trans id="h2F3R7T8wY8QyLmnVa3xK6-ecosystem">
            Have a great project?
          </Trans>
        </Box>

        <Box
          className={classnames(
            "text",
            "c-font-14-19 c-sm-font-16-22 c-md-font-20-28  c-font-color",
          )}
          component="p"
          mt={{ xs: 2, sm: 1 }}
          mb={{ xs: 2.5 }}
        >
          <Trans id="6kjCVkpPTCPXrP3DwjAunb-ecosystem">
            Alphaguilty is a community governed launchpad to help you launch
            your projects in a way that is fair for all.
          </Trans>
        </Box>

        <Button
          className="c-button"
          style="secondary"
          href={ELinks.getInTouch}
          target="_blank"
        >
          <Trans id="jGcvsKoTeRGhY36XXVmQHA-ecosystem">Get in Touch</Trans>
        </Button>
      </div>

      {theme === "dark" && <Decor icon />}
    </ApplySectionWrapper>
  );
};

export default ApplySection;
