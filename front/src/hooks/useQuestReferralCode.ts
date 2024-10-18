import { useTypedSelector } from "./useTypedSelector";
import { useCallback, useEffect, useState } from "react";
import { LocalStorageService } from "@/services";
import { getQuestReferralCode as getQuestReferralCodeSelector } from "@modules/account/store/account.selector";

export const useQuestReferralCode = () => {
  const [questReferralCode, setQuestReferralCode] = useState<string | null>(
    null,
  );

  const stateQuestReferralCode = useTypedSelector(getQuestReferralCodeSelector);

  const getQuestReferralCode = useCallback(async () => {
    const localReferralCode = await LocalStorageService.getItemAsync(
      "invite-task-ref",
    );

    setQuestReferralCode(stateQuestReferralCode || localReferralCode || null);
  }, [stateQuestReferralCode]);

  useEffect(() => {
    getQuestReferralCode();
  }, [getQuestReferralCode]);

  return questReferralCode;
};
