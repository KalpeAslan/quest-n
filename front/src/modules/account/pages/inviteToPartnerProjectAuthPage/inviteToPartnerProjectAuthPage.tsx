"use client";
import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { useRouter } from "next/router";

import { AppContext } from "@context";
import { SignUpWrapper } from "./inviteToPartnerProjectAuthPage.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountState } from "@modules/account/store/account.selector";
import { getLoginPrevLocation } from "@/store/slices/system/system.selector";
import { LocalStorageService } from "@/services";
import { InviteToPartnerProjectAuth } from "@components/auth/InviteToPartnerProjectAuth";

interface IProps {
  flow: "login" | "sign-up";
}

const InviteToPartnerProjectAuthPage = ({ flow }: IProps) => {
  const { push, query } = useRouter();

  const { accountInfo } = useTypedSelector(getAccountState);
  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const [email, setEmail] = useState("");

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  useEffect(() => {
    if (query.email) {
      setEmail(query.email as string);
    }

    return () => {
      if (prevLocation) {
        prevLocation.current = location.pathname;
      }
    };
  }, []);

  useEffect(() => {
    if (accountInfo?.connected) {
      const localStoragePrevLocation =
        LocalStorageService.getItem("prev_location");
      LocalStorageService.removeItem("prev_location");

      push(loginPrevLocation || localStoragePrevLocation || "/");
    }
  }, [accountInfo?.connected, loginPrevLocation, push]);

  return (
    <div className="background-other">
      <SignUpWrapper mt={5} mb={5}>
        <InviteToPartnerProjectAuth authFlow={flow} email={email || ""} />
      </SignUpWrapper>
    </div>
  );
};

export default InviteToPartnerProjectAuthPage;
