import { useState } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { TwoFactorFirstStep } from "./components/firstStep";
import { TwoFactorSecondStep } from "./components/secondStep";

type Props = {
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const DisableTwoFactorAuth = ({ setIsReqError, setActiveFlow }: Props) => {
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"first" | "second">("first");

  return (
    <>
      <Box className="c-font-20-24 c-fw-500 c-font-color" component="p" mb={3}>
        <Trans id="vn1whNerRwqLUc9rhEcdVz-account">
          Disable two-factor authentication
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
          setActiveFlow={setActiveFlow}
        />
      )}
    </>
  );
};

export default DisableTwoFactorAuth;
