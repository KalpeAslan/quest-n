import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { AlphaquestSectionWrapper } from "./alphaQuestSection.styles";

const AlphaQuest = () => {
  return (
    <AlphaquestSectionWrapper className="c-wrap" mb={{ xs: 7, sm: 10 }}>
      <div className="content">
        <Box
          className={classnames(
            "title",
            "c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color",
          )}
          component="h3"
          mb={{ xs: 2 }}
        >
          <Trans id="n8cGA9SFVshJZqaW31t39Q-ecosystem">
            Earn crypto with AlphaQuest
          </Trans>
        </Box>

        <div className="decor"></div>

        <p
          className={classnames(
            "text",
            "c-font-16-22 c-sm-font-20-24 c-fw-400 c-font-color-3",
          )}
        >
          <Trans id="pSQSaBgovynL9tLpg9EhTJ-ecosystem">
            $0 investment required.
          </Trans>
        </p>
        <p
          className={classnames(
            "text",
            "c-font-16-22 c-sm-font-20-24 c-fw-400 c-font-color",
          )}
        >
          <Trans id="f3r2rcStQvsLBzRByW2TQ2-ecosystem">
            Just sign up for our projects, complete tasks, and earn rewards!
          </Trans>
        </p>

        <Button
          className="button"
          style="colorfull"
          href="/quest"
          target="_self"
        >
          <div>
            <Trans id="6aWbtWumT9PDub1yC9yKAZ-ecosystem">AlphaQuest</Trans>
          </div>
        </Button>
      </div>
    </AlphaquestSectionWrapper>
  );
};

export default AlphaQuest;
