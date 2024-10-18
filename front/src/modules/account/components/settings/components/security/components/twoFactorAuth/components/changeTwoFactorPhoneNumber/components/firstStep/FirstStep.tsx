import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { authService } from "@api";
import { LoggerService } from "@services";
import { FooterWrapper, FormWrapper } from "./firstStep.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

type Props = {
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"first" | "second" | "third" | "fourth">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const TwoFactorFirstStep = ({
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
  setActiveFlow,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const accountInfo = useTypedSelector(getAccountInfo);

  const sendCode = async () => {
    setIsLoaded(false);

    try {
      await authService.post2faDisconnect();

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

    LoggerService.error("Error during disconnect 2fa - send code step", error);
  };

  const isDisabled = useMemo(() => {
    if (!isLoaded) {
      return true;
    }

    return false;
  }, [isLoaded]);

  const userPhone = useMemo(() => {
    if (accountInfo?.security?.phoneNumber) {
      return accountInfo.security.phoneNumber;
    }

    return "";
  }, [accountInfo]);

  return (
    <>
      <Box className="c-font-14-20 c-font-color" component="p" mb={1.2}>
        <Trans id="c6z39qEc4EhbjeDjLFEmab-account">
          Send code to your current phone number
        </Trans>{" "}
        {userPhone !== "" &&
          t({
            id: "d4W2sHUFBRvqGhCJDEP5ga-account",
            message: `which ends on ${userPhone}`,
          })}
      </Box>

      <FormWrapper>
        <Button
          className="button"
          type="submit"
          style="task"
          loading={!isLoaded}
          disabled={isDisabled}
          onClick={sendCode}
        >
          <Trans id="8rjgkY6UYN1NqBMSZu6zvC-account">Send</Trans>
        </Button>
      </FormWrapper>

      <FooterWrapper>
        <Button
          className="link"
          type="button"
          style="icon"
          onClick={() => setActiveFlow(null)}
        >
          <Trans id="biVVM7DptAAi8PX6vXzupA-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorFirstStep;
