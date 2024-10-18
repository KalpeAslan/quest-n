import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { Icon } from "@components/UI/icon";

import {
  InviteRefFormStylesItemValue,
  InviteRefFormStylesItemWrapper,
  InviteRefFormStylesWrapper,
} from "./inviteRefForm.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { Trans } from "@lingui/macro";
import { IAccount } from "@modules/account/models";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  className: string;
  withoutCode?: boolean;
};

const InviteRefForm = ({ className, withoutCode }: Props) => {
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);
  const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);

  const accountInfo: IAccount = useTypedSelector(getAccountInfo);

  const referralCode: string | null = useMemo(() => {
    if (accountInfo.referralCode) {
      return accountInfo?.referralCode;
    }

    return null;
  }, [accountInfo]);

  const referralLink = useMemo(() => {
    return `${window.location.origin}/referral-invite?code=${referralCode}`;
  }, [referralCode]);

  const handleCopy = (type: "link" | "code") => {
    if (!referralCode) {
      return;
    }

    if (type === "link") {
      setIsLinkCopied(true);

      setTimeout(() => {
        setIsLinkCopied(false);
      }, 1500);

      return;
    }

    setIsCodeCopied(true);

    setTimeout(() => {
      setIsCodeCopied(false);
    }, 1500);
  };

  return (
    <InviteRefFormStylesWrapper className={classnames(className)}>
      <InviteRefFormStylesItemWrapper>
        <p className="c-font-12-16 c-font-color-5">
          <Trans id="jy2gZSEgUdLRGMSybsiApN-inviteRefForm">Invite Link</Trans>
        </p>

        <InviteRefFormStylesItemValue>
          <Box className="c-font-14-20 c-font-color" mr={1}>
            {referralLink}
          </Box>

          <Box
            ml="auto"
            style={{
              color: !isLinkCopied ? "#fafafa" : "#87f696",
            }}
          >
            <CopyToClipboard
              text={referralLink}
              onCopy={() => handleCopy("link")}
            >
              <Icon
                name={!isLinkCopied ? "account-copy" : "check-mark"}
                size="24"
              />
            </CopyToClipboard>
          </Box>
        </InviteRefFormStylesItemValue>
      </InviteRefFormStylesItemWrapper>

      {!withoutCode && (
        <InviteRefFormStylesItemWrapper>
          <p className="c-font-12-16 c-font-color-5">
            <Trans id="38ZuJRgo4J6zBpDyZC3Bvt-inviteRefForm">Invite Code</Trans>
          </p>

          <InviteRefFormStylesItemValue>
            <Box className="c-font-14-20 c-font-color" mr={1}>
              {referralCode}
            </Box>

            <Box
              ml="auto"
              style={{
                color: !isCodeCopied ? "#fafafa" : "#87f696",
              }}
            >
              <CopyToClipboard
                text={referralCode}
                onCopy={() => handleCopy("code")}
              >
                <Icon
                  name={!isCodeCopied ? "account-copy" : "check-mark"}
                  size="24"
                />
              </CopyToClipboard>
            </Box>
          </InviteRefFormStylesItemValue>
        </InviteRefFormStylesItemWrapper>
      )}
    </InviteRefFormStylesWrapper>
  );
};

InviteRefForm.defaultProps = {
  className: "",
} as Partial<Props>;

export default InviteRefForm;
