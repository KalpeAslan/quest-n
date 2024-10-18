import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  setAccountPageActiveTab,
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setLocalReferralCode,
  setQuestReferralCode,
} from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { GetServerSideProps } from "next";
import { getQueryVariable } from "@/utils";
import { accountService } from "@api";
import { setLoginPrevLocation } from "@store/slices/system/system.slice";
import { CircularProgress } from "@mui/material";
import { LocalStorageService } from "@/services";

const ReferralInvite = () => {
  const { push, query } = useRouter();
  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  const computeCode = (key): string => {
    const codeFromWindow = getQueryVariable(key);
    const codeFromServer = key === "questCode" ? query.questCode : query.code;

    return ((query[key] as string) ||
      codeFromServer ||
      codeFromWindow) as string;
  };

  const [questTitle, setQuestTitle] = useState<string>("");

  useEffect(() => {
    if (computeCode("questCode") && !questTitle) {
      accountService
        .getQuestTitleByReferralCodeTask(computeCode("questCode") as string)
        .then(res => res.data.response.questLinkTitle)
        .then(setQuestTitle)
        .catch(() => null);
    }
  }, [query]);

  useEffect(() => {
    (async () => {
      const code = computeCode("code");

      const questCode = computeCode("questCode");

      if (!code && !questCode && accountInfo?.connected === false) {
        push("/sign-up");

        return;
      }

      if (!code && !questCode && accountInfo?.connected) {
        push("/profile/experience");

        return;
      }

      if (accountInfo?.connected && code) {
        dispatch(setAccountPageActiveTab("Settings"));

        if (accountInfo?.canBeReferral) {
          dispatch(setLocalReferralCode(code as string));
          dispatch(setIsReferralCodeLoading(true));

          push("/profile/experience");

          return;
        }

        dispatch(setLocalReferralCode(null));
        push("/profile/experience");
        setIsReferralPopupResultOpen({
          open: true,
          type: "error",
        });

        return;
      }

      if (accountInfo?.connected === false && code) {
        dispatch(setLocalReferralCode(code as string));
        push("/sign-up");
      }

      //For Invite Friend Task

      if (accountInfo?.connected && questCode) {
        dispatch(setAccountPageActiveTab("Settings"));

        if (accountInfo?.canBeReferral) {
          dispatch(setQuestReferralCode(questCode));
          dispatch(setIsReferralCodeLoading(true));

          push(`quest/${questTitle}`);

          return;
        }

        dispatch(setQuestReferralCode(null));
        push(`quest/${questTitle}`);
        setIsReferralPopupResultOpen({
          open: true,
          type: "error",
        });

        return;
      }

      if (accountInfo.connected === false && questCode) {
        LocalStorageService.setItem("invite-task-ref", questCode);
        dispatch(setLoginPrevLocation(`quest/${questTitle}`));
        dispatch(setQuestReferralCode(questCode));
        push("/sign-up");
      }
    })();
  }, [
    accountInfo?.connected,
    accountInfo?.canBeReferral,
    push,
    query,
    questTitle,
  ]);

  return (
    <>
      <div
        className="background-other c-font-color-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const props: any = {
    link: "/referral-invite",
  };

  return {
    props,
  };
};

export default ReferralInvite;
