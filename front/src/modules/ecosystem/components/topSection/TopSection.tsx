import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { Box } from "@mui/material";

import { TopSectionWrapper, TopSectionDecor } from "./topSection.styles";

const TopSection = () => {
  return (
    <TopSectionWrapper
      pt={{ xs: 3, sm: 8, md: 11 }}
      mb={{ xs: 7, sm: 10, md: 28 }}
    >
      <Box className={classnames("cont", "c-wrap")}>
        <Box className="content">
          <Box
            className={classnames(
              "title",
              "c-font-30-36 c-sm-font-48-56 c-md-font-56-56 c-fw-500 c-font-color c-text-shadow",
            )}
            component="h2"
            mb={3.5}
          >
            <Box component="span" className="c-font-color-3">
              <Trans id="bMkUErm52WyfAm15XdCc6K-ecosystem">
                Multichain ecosystem
              </Trans>
            </Box>
            <Trans id="3kbXQGLitnfbxB1v3ejEFG-ecosystem">
              for boosting crypto portfolio
            </Trans>
          </Box>

          <TopSectionDecor />

          <Box
            className={classnames(
              "text",
              "c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color c-text-shadow",
            )}
          >
            <Trans id="cWEag3AGbsjMC2PgbPZPSm-ecosystem">
              Make crypto alpha way. No more bots. No more lotteries. Just real
              allocation and community
            </Trans>
          </Box>
        </Box>
      </Box>
    </TopSectionWrapper>
  );
};

export default TopSection;
