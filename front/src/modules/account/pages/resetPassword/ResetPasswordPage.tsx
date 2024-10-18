import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAccountState } from "../../store/account.selector";
import { getLoginPrevLocation } from "@store/slices/system/system.selector";
import { ResetPassword } from "@/components/auth/components/resetPassword";

const ResetPasswordPage = () => {
  const { push, query } = useRouter();

  const { accountInfo } = useTypedSelector(getAccountState);

  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  useEffect(() => {
    if (accountInfo?.connected && !query.change) {
      push(loginPrevLocation ? loginPrevLocation : "/");
    }
  }, [push, accountInfo, query.change]);

  return (
    <div className="background-other">
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
