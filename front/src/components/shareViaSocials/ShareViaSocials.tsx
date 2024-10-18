/** @jsxRuntime classic /
 /* @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useMemo } from "react";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import {
  ShareViaSocialsStylesHeader,
  ShareViaSocialsStylesIcon,
  ShareViaSocialsStylesLabel,
  ShareViaSocialsStylesLink,
  ShareViaSocialsStylesList,
  ShareViaSocialsStylesListItem,
} from "./shareViaSocials.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { t, Trans } from "@lingui/macro";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";

const ShareViaSocials = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const dispatch = useAppDispatch();

  const referralCode: string | null = useMemo(() => {
    if (accountInfo?.referralInfo?.referralCode) {
      return accountInfo?.referralInfo?.referralCode;
    }

    return null;
  }, [accountInfo]);

  const referralLink = useMemo(() => {
    return `${window.location.origin}/referral-invite?code=${referralCode}`;
  }, [referralCode]);

  const trackShareEvent = (source: string) =>
    dispatch(
      sendAnalyticsDataThunk({
        type: "referral_share_tap",
        options: { event_property_referral_share_source: source },
      }),
    );

  return (
    <>
      <ShareViaSocialsStylesHeader>
        <Trans id="2df5k1XnjM3GUGUyLHCjak-shareViaSocials">
          Share via social
        </Trans>
      </ShareViaSocialsStylesHeader>

      <ShareViaSocialsStylesList>
        <ShareViaSocialsStylesListItem>
          <TwitterShareButton
            css={ShareViaSocialsStylesLink}
            url={referralLink}
            onClick={() => trackShareEvent("twitter")}
            title={t({
              id: "vZ9hoacHM9zUqpKfRZiQkx-shareViaSocials",
              message: `Use my referral code ${referralCode} and start making money in crypto! Let's begin our journey with AlphaQuest together!`,
            })}
          >
            <ShareViaSocialsStylesIcon size="24" name="twitter" />
            <ShareViaSocialsStylesLabel>
              <Trans id="9kA3pvruySGWgskkZbzkFz-shareViaSocials">Twitter</Trans>
            </ShareViaSocialsStylesLabel>
          </TwitterShareButton>
        </ShareViaSocialsStylesListItem>
        <ShareViaSocialsStylesListItem>
          <FacebookShareButton
            css={ShareViaSocialsStylesLink}
            url={referralLink.replace(
              "http://localhost:3000",
              "https://cnlp-stage.mocstage.com",
            )}
            onClick={() => trackShareEvent("facebook")}
            title={t({
              id: "2FEWUbAa4WGV4rbQfdfsVs-shareViaSocials",
              message: `Use my referral code ${referralCode} and start making money in crypto! Let's begin our journey with AlphaQuest together!`,
            })}
          >
            <ShareViaSocialsStylesIcon size="24" name="facebook" />
            <ShareViaSocialsStylesLabel>
              <Trans id="9uvFsGcMSJ3sbsfZB27zSz-shareViaSocials">
                Facebook
              </Trans>
            </ShareViaSocialsStylesLabel>
          </FacebookShareButton>
        </ShareViaSocialsStylesListItem>
        <ShareViaSocialsStylesListItem>
          <TelegramShareButton
            css={ShareViaSocialsStylesLink}
            url={referralLink}
            onClick={() => trackShareEvent("telegram")}
            title={t({
              id: "3V37bJtbsP63bNR8xdbM5Z-shareViaSocials",
              message: `Use my referral code ${referralCode} and start making money in crypto! Let's begin our journey with AlphaQuest together!`,
            })}
          >
            <ShareViaSocialsStylesIcon size="24" name="telegram" />
            <ShareViaSocialsStylesLabel>
              <Trans id="a8D9zJEmi2Dubt27CxStzu-shareViaSocials">
                Telegram
              </Trans>
            </ShareViaSocialsStylesLabel>
          </TelegramShareButton>
        </ShareViaSocialsStylesListItem>
      </ShareViaSocialsStylesList>
    </>
  );
};

export default ShareViaSocials;
