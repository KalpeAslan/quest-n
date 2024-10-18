import { Box } from "@mui/system";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { ReferralRanksRule } from "@modules/account/models";
import { ProfitWrapper } from "./profit.styles";

type Props = {
  currentRank: ReferralRanksRule | null;
  nextRanks: ReferralRanksRule[];
};

const Profit = ({ currentRank, nextRanks }: Props) => {
  return (
    <ProfitWrapper>
      {currentRank && currentRank.code && (
        <Box className="profit">
          <Box className="rank">
            <Icon
              className="rank-icon"
              name="loyalty-curve"
              height="64"
              width="46"
            />

            <Box
              component="p"
              className="c-font-32-36 c-font-grad c-inline-block"
              ml={1.2}
            >
              {currentRank.code}
            </Box>

            <Box
              component="p"
              className="c-font-10-12 c-font-grad c-inline-block"
              ml={1.2}
            >
              <Trans id="jHYCadogTmG88pbTvEQorK-account">Rank</Trans>
            </Box>
          </Box>

          <Box
            component="p"
            className={classnames("text", "c-font-14-18 c-font-color")}
          >
            <Trans id="ufD19AuUcAvseDPMyuhJ41-account">
              Max. referral profit
            </Trans>{" "}
            <Box mr={1} component="span" className="c-font-color-3">
              {currentRank.percentage}%
            </Box>
            <Trans id="uutARBSJwj5hSUHdQ6HWBM-account">from group volume</Trans>
          </Box>
        </Box>
      )}

      {nextRanks.length > 0 && (
        <Box className="icon">
          <Icon
            style={{ transform: "rotate(-90deg)" }}
            name="menu-select"
            size="24"
          />
        </Box>
      )}

      <Box className="ranks">
        {nextRanks.map((item: ReferralRanksRule, index) =>
          index < 3 ? (
            <div className="rank-item" key={item.code}>
              <p className="c-font-14-14 c-font-color-3">{item.percentage}%</p>
              <p className="c-font-8-8 c-font-color-3">
                <Trans id="vFZ2Je8Lzc2hNUBeAeWvvf-account">Rank</Trans>{" "}
                {item.code}
              </p>
            </div>
          ) : null,
        )}

        {nextRanks.length > 3 && (
          <div className="rank-item">
            <p className="c-font-14-14 c-font-color-3">...</p>
          </div>
        )}
      </Box>
    </ProfitWrapper>
  );
};

export default Profit;
