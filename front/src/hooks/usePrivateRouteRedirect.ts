import { getAccountInfo } from "@/modules/account/store/account.selector";
import { useTypedSelector } from "./useTypedSelector";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const usePrivateRouteRedirect = (redirectPath?: string) => {
  const { replace } = useRouter();

  const accountInfo = useTypedSelector(getAccountInfo);

  useEffect(() => {
    if (accountInfo?.connected === null) return;

    if (!accountInfo?.connected) {
      replace(redirectPath || "/login");
      return;
    }

    return () => {
      if (!accountInfo?.connected) {
        replace(redirectPath || "/login");
        return;
      }
    };
  }, [accountInfo, redirectPath]);
};
