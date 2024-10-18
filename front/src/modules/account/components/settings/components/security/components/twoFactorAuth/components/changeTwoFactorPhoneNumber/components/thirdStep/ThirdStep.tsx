import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { PhoneInput } from "@components/UI/phoneInput";
import { authService } from "@api";
import { LoggerService } from "@services";
import { FooterWrapper, FormWrapper } from "./thirdStep.styles";

type Props = {
  phoneValue: string;
  setPhoneValue: React.Dispatch<React.SetStateAction<string>>;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"first" | "second" | "third" | "fourth">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const TwoFactorThirdStep = ({
  phoneValue,
  setPhoneValue,
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
  setActiveFlow,
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

      setCurrentStep("fourth");

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

    LoggerService.error("Error during connect 2fa - send code step", error);
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
      <FormWrapper mb={2}>
        <Box mb={3}>
          <PhoneInput
            value={phoneValue}
            placeholder={t({
              id: "iXZVAcHvBbi3HQKPnumF97-account",
              message: "Enter your new phone number",
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
          <Trans id="fnfjQadZ7aW9F9vD1qZhqQ-account">Send</Trans>
        </Button>
      </FormWrapper>

      <FooterWrapper>
        <Button
          className="link"
          type="button"
          style="icon"
          onClick={() => setActiveFlow(null)}
        >
          <Trans id="atccWFvxSPaKUN3XtkrxMh-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorThirdStep;
