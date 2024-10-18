import { useState } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { TwoFactorFirstStep } from "./components/firstStep";
import { TwoFactorSecondStep } from "./components/secondStep";

type Props = {
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddingTwoFactorAuth = ({ setIsReqError }: Props) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"first" | "second">("first");

  return (
    <>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={0.5}
      >
        <Trans id="15xUSkaX2AYrMSa39jBfi4-account">
          Two-Factor Authentication
        </Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={{ xs: 3 }}>
        <Trans id="tbTDMuTJb9Yf1ws2raiwZW-account">
          Double up on security by protecting your AlphaAccount with two-factor
          authentication (2FA)
        </Trans>
      </Box>

      {currentStep === "first" && (
        <TwoFactorFirstStep
          phoneValue={phoneValue}
          setPhoneValue={setPhoneValue}
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}

      {currentStep === "second" && (
        <TwoFactorSecondStep
          phoneValue={phoneValue}
          currentDate={currentDate}
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}
    </>
  );
};

export default AddingTwoFactorAuth;
