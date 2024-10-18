import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { authService } from "@api";
import { LoggerService } from "@services";
import { FooterWrapper, FormWrapper } from "./2faFirstStep.styles";

type Props = {
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"init" | "code" | "confirm">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
};

const TwoFactorFirstStep = ({
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const sendCode = async () => {
    setIsLoaded(false);

    try {
      await authService.postInvestor2FaCode();

      setCurrentStep("confirm");

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

    LoggerService.error("Error during delete account - code step", error);
  };

  const isDisabled = useMemo(() => {
    if (!isLoaded) {
      return true;
    }

    return false;
  }, [isLoaded]);

  return (
    <>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={0.5}
      >
        <Trans id="fwqnLvJbdpqmFwQSGZ5Cso-account">Delete your account</Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={3}>
        <Trans id="cgqzgUZyuCDb2pmcx51qnp-account">
          Enter your details to delete your account
        </Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={1.2}>
        <Trans id="9tASwTt72TswLhb3t6zPH2-account">
          Pass Two-Factor Authentication to delete your account
        </Trans>
      </Box>

      <FormWrapper mb={2}>
        <Button
          className="button"
          type="submit"
          style="task"
          loading={!isLoaded}
          disabled={isDisabled}
          onClick={sendCode}
        >
          <Trans id="63627prHESyz4UH5DVmA4s-account">Send</Trans>
        </Button>
      </FormWrapper>

      <FooterWrapper>
        <Button
          className="link"
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={!isLoaded}
          onClick={() => setCurrentStep("init")}
        >
          <Trans id="fUkYYBDvNiCZCKmhs7DGfh-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorFirstStep;
