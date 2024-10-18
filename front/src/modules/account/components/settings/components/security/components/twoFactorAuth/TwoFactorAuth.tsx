import { useState } from "react";

import { ActiveTwoFactorAuth } from "./components/activeTwoFactorAuth";
import { AddingTwoFactorAuth } from "./components/addingTwoFactorAuth";
import { ChangeTwoFactorPhoneNumber } from "./components/changeTwoFactorPhoneNumber";
import { DisableTwoFactorAuth } from "./components/disableTwoFactorAuth";
import { LimitMessage } from "../../../limitMessage";

import { Wrapper } from "./twoFactorAuth.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

const TwoFactorAuth = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const [activeFlow, setActiveFlow] = useState<
    "Change number" | "Remove 2fa" | null
  >(null);
  const [isReqError, setIsReqError] = useState<boolean>(false);

  return (
    <Wrapper>
      {!isReqError &&
        accountInfo?.security?.twoFactorAuth &&
        activeFlow !== "Change number" &&
        activeFlow !== "Remove 2fa" && (
          <ActiveTwoFactorAuth setActiveFlow={setActiveFlow} />
        )}

      {!isReqError &&
        !accountInfo?.security?.twoFactorAuth &&
        activeFlow !== "Change number" &&
        activeFlow !== "Remove 2fa" && (
          <AddingTwoFactorAuth setIsReqError={setIsReqError} />
        )}

      {!isReqError && activeFlow === "Change number" && (
        <ChangeTwoFactorPhoneNumber
          setIsReqError={setIsReqError}
          setActiveFlow={setActiveFlow}
        />
      )}

      {!isReqError && activeFlow === "Remove 2fa" && (
        <DisableTwoFactorAuth
          setIsReqError={setIsReqError}
          setActiveFlow={setActiveFlow}
        />
      )}

      {isReqError && <LimitMessage />}
    </Wrapper>
  );
};

export default TwoFactorAuth;
