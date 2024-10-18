import { FC } from "react";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";

import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsOnboardingPopupDataLoaded } from "@/store/slices/system/system.selector";
import {
  setIsOnboardingPopupOpen,
  setOnboardingPopupFlow,
} from "@/store/slices/system/system.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Wrapper } from "./onboardingTask.styles";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";

const OnboardingTask: FC = () => {
  const dispatch = useAppDispatch();

  const isOnboardingDataLoaded = useTypedSelector(
    getIsOnboardingPopupDataLoaded,
  );

  return (
    <Wrapper>
      <Button
        className="button c-font-14-20 c-sm-font-16-22"
        type="button"
        style="primary"
        onClick={() => {
          if (isOnboardingDataLoaded) {
            dispatch(
              sendAnalyticsDataThunk({ type: "onboarding_tap", options: {} }),
            );
            dispatch(setIsOnboardingPopupOpen(true));
            dispatch(setOnboardingPopupFlow("task"));
          }
        }}
      >
        <Trans id="uacBCcjziiZoCfq1eJEDBH-quest">
          Complete first task and get reward
        </Trans>
      </Button>
    </Wrapper>
  );
};

export default OnboardingTask;
