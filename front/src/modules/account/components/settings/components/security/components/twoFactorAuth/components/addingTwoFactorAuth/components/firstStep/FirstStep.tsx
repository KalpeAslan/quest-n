import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { PhoneInput } from "@components/UI/phoneInput";
import { authService } from "@api";
import { LoggerService } from "@services";
import { FormWrapper } from "./firstStep.styles";

interface FormFields {
  phone: string;
}

type Props = {
  phoneValue: string;
  setPhoneValue: React.Dispatch<React.SetStateAction<string>>;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<"first" | "second">>;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
};

const TwoFactorFirstStep = ({
  phoneValue,
  setPhoneValue,
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isPhoneInvalid, setIsPhoneInvalid] = useState<boolean>(true);

  const sendPhone = async () => {
    if (phoneValue === "") {
      return;
    }

    setIsLoaded(false);

    try {
      await authService.post2faConnect({
        phoneNumber: phoneValue,
      });

      setCurrentStep("second");

      const time = DateTime.now().plus({ minutes: 2 }).toUnixInteger();
      setCurrentDate(time);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleError = (error: any) => {
    const { response } = error;

    if (
      response.status === 429 ||
      (response.status === 400 && response.data.errorCode === 1003)
    ) {
      setIsReqError(true);

      return;
    }

    LoggerService.error("Error during adding phone for 2fa", error);
  };

  const isDisabled = useMemo(() => {
    if (phoneValue === "" || isPhoneInvalid) {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [phoneValue, isLoaded, isPhoneInvalid]);

  return (
    <>
      <FormWrapper>
        <Box mb={3}>
          <PhoneInput
            value={phoneValue}
            placeholder={t({
              id: "6X4mAEkzQHDiWJ8nTvPCAV-account",
              message: "Enter your phone number",
            })}
            setValue={setPhoneValue}
            isPhoneInvalid={isPhoneInvalid}
            setIsPhoneInvalid={setIsPhoneInvalid}
          />
        </Box>

        <Button
          className="button"
          type="button"
          style="task"
          loading={!isLoaded}
          disabled={isDisabled}
          onClick={sendPhone}
        >
          <Trans id="tjZVpscrCfk2Hyfw2LrdpF-account">Send</Trans>
        </Button>
      </FormWrapper>
    </>
  );
};

export default TwoFactorFirstStep;
