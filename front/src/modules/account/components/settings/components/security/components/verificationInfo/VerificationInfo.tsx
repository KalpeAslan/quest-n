import { useCallback, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";

import { FormWrapper } from "./verificationInfo.styles";
import { LocalStorageService } from "@services";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { useAccount } from "wagmi";

const VerificationInfo = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const { connector, address } = useAccount();

  const [entryType, setEntryType] = useState<string>("");
  const [entryUserName, setEntryUserName] = useState<string>("");

  const getEntryType = useCallback(async () => {
    const authType = await LocalStorageService.getItemAsync("entryType");

    if (authType) {
      setEntryType(authType);
      return;
    }

    setEntryType("");
  }, [accountInfo]);

  const getEntryUserName = useCallback(async () => {
    const userName = await LocalStorageService.getItemAsync("entryUN");

    if (userName) {
      setEntryUserName(userName);
      return;
    }

    setEntryUserName("");
  }, [accountInfo]);

  useEffect(() => {
    getEntryType();
    getEntryUserName();
  }, [getEntryType, getEntryUserName]);

  const walletLogo = useMemo(() => {
    if (
      accountInfo.wallet === address?.toLocaleLowerCase() &&
      connector?.name &&
      connector.name === "MetaMask"
    ) {
      return "metamask-logo";
    }

    return "wallet-connect";
  }, [accountInfo.wallet, address, connector]);

  return (
    <div>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={0.5}
      >
        <Trans id="u87AvGkh5augMQR49f5bCs-account">Verification accounts</Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={3}>
        <Trans id="6EJKnfNGfS8do33PR9U5fk-account">
          This account is used for login, it may differ from activity accounts
        </Trans>
      </Box>

      <FormWrapper>
        <Box className={classnames("soc", `button-${entryType}`)} mr={2}>
          {entryType && (
            <Icon
              name={entryType === "wallet" ? walletLogo : entryType}
              size="24"
            />
          )}

          {entryUserName && (
            <Box
              className="c-font-16-22 c-fw-500 c-font-color"
              component="p"
              ml={1.25}
            >
              {entryUserName}
            </Box>
          )}
        </Box>
      </FormWrapper>
    </div>
  );
};

export default VerificationInfo;
