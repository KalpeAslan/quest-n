import { useState } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { TwoFactorFirstStep } from "./components/firstStep";
import { TwoFactorSecondStep } from "./components/secondStep";
import { TwoFactorThirdStep } from "./components/thirdStep";
import { TwoFactorFourthStep } from "./components/fourthStep";

type Props = {
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const ChangeTwoFactorPhoneNumber = ({
  setIsReqError,
  setActiveFlow,
}: Props) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "first" | "second" | "third" | "fourth"
  >("first");

  return (
    <>
      <Box className="c-font-20-24 c-fw-500 c-font-color" component="p" mb={3}>
        <Trans id="9vC6E4HZ7S1RhuTLsjzAff-account">
          Activate 2FA on new number
        </Trans>
      </Box>

      {currentStep === "first" && (
        <TwoFactorFirstStep
          setIsReqError={setIsReqError}
          setActiveFlow={setActiveFlow}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}

      {currentStep === "second" && (
        <TwoFactorSecondStep
          currentDate={currentDate}
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}

      {currentStep === "third" && (
        <TwoFactorThirdStep
          phoneValue={phoneValue}
          setPhoneValue={setPhoneValue}
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setActiveFlow={setActiveFlow}
          setCurrentDate={setCurrentDate}
        />
      )}

      {currentStep === "fourth" && (
        <TwoFactorFourthStep
          phoneValue={phoneValue}
          currentDate={currentDate}
          setIsReqError={setIsReqError}
          setActiveFlow={setActiveFlow}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}
    </>
  );
};

export default ChangeTwoFactorPhoneNumber;
