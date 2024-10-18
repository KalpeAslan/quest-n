import { ConfirmStep } from "@/modules/account/components/resetPassword/confirmStep";
import { ResetStep } from "@/modules/account/components/resetPassword/resetStep";
import { VerificationStep } from "@/modules/account/components/resetPassword/verificationStep";
import {
  EResetPasswordFlow,
  EResetPasswordSteps,
} from "@/modules/account/models";
import { Box } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface Props {
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

const ResetPassword: FC<Props> = ({ iframeAuthPopup, setResetPassword }) => {
  const [verificationAddress, setVerificationAddress] = useState<string | null>(
    null,
  );
  const [confirmToken, setConfirmToken] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [step, setStep] = useState<EResetPasswordSteps>(
    EResetPasswordSteps.VERIFY,
  );
  const [activeFlow, setActiveFlow] = useState<EResetPasswordFlow>(
    EResetPasswordFlow.EMAIL,
  );

  const onVerificationResend = (data: {
    confirmToken: string;
    verificationAddress: string;
  }) => {
    setConfirmToken(data.confirmToken);
    setVerificationAddress(data.verificationAddress);
  };

  const onVerificationSend = (data: {
    confirmToken: string;
    verificationAddress: string;
  }) => {
    onVerificationResend(data);
    setStep(EResetPasswordSteps.CONFIRM);
  };

  const onVerificationConfirm = (data: { resetToken: string }) => {
    setResetToken(data.resetToken);
    setStep(EResetPasswordSteps.RESET);
  };

  return (
    <Box
      mt={5}
      mb={5}
      sx={{
        flex: 1,
        width: "100%",
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {step === EResetPasswordSteps.VERIFY && (
        <VerificationStep
          activeTab={activeFlow}
          setActiveTab={setActiveFlow}
          onVerificationSend={onVerificationSend}
          iframeAuthPopup={iframeAuthPopup}
          setResetPassword={setResetPassword}
        />
      )}

      {step === EResetPasswordSteps.CONFIRM && (
        <ConfirmStep
          address={verificationAddress}
          flow={activeFlow}
          onVerificationResend={onVerificationResend}
          confirmToken={confirmToken}
          onVerificationConfirm={onVerificationConfirm}
        />
      )}

      {step === EResetPasswordSteps.RESET && (
        <ResetStep
          iframeAuthPopup={iframeAuthPopup}
          setResetPassword={setResetPassword}
          flow={activeFlow}
          resetToken={resetToken}
        />
      )}
    </Box>
  );
};

export default ResetPassword;
