import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import classnames from "classnames";
import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { InviteRefForm } from "@components/inviteRefForm";
import { ShareViaSocials } from "@components/shareViaSocials";
import { StickyBarWrapper } from "./stickyBar.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { ELinks } from "@/models";

const StickyBar = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  return (
    <StickyBarWrapper
      className={classnames({
        ["active"]: accountInfo?.connected,
      })}
    >
      <div className="content">
        <Box
          component="p"
          className={classnames(
            "title",
            "c-font-20-24 c-sm-font-32-36 c-font-grad",
          )}
        >
          <Trans id="tmqS56QiSivnitbvBUHgpL-account">
            INVITE FRIENDS & EARN TOKENS
          </Trans>
        </Box>

        <Box
          component="p"
          className={classnames(
            "text",
            "mobile-text",
            "c-font-14-20 c-font-color",
          )}
        >
          <Box component="span" mr={0.5}>
            <Trans id="1VVNMM2u9NHvRtHVrpVqJv-account">
              Get up to 15% of friends profits and $300k in referral bonuses
            </Trans>
          </Box>

          <Button
            className="link"
            style="link"
            size="task"
            type="button"
            href={ELinks.faq}
            target="_blank"
          >
            <>
              <Box component="span" mr={0.5}>
                <Trans id="wuhuUwed66j4vBxu99KSvD-account">Learn How</Trans>
              </Box>
              <Icon
                style={{ transform: "rotate(90deg)" }}
                size="14"
                name="arrow-straight"
              />
            </>
          </Button>
        </Box>

        {accountInfo?.connected && (
          <Box className="form-group">
            <InviteRefForm withoutCode className="form" />
          </Box>
        )}
        {accountInfo?.connected && (
          <Box className="share">
            <ShareViaSocials />
          </Box>
        )}
      </div>

      {!accountInfo?.connected && (
        <div className="image">
          <div className="decor" />
        </div>
      )}
    </StickyBarWrapper>
  );
};

export default StickyBar;
