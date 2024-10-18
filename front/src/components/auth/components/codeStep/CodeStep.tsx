import { useState } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import { Trans } from "@lingui/macro";
import { entryService } from "@api";
import { LocalStorageService, LoggerService } from "@services";
import {
  CodeStepStylesButton,
  CodeStepStylesButtons,
  CodeStepStylesLink,
} from "./codeStep.styles";
import { EAuthSteps } from "@/models";
import { TCredsAuthType } from "@modules/account/models";

type Props = {
  userPhoneNumber: number | string | null;
  twoFaToken: string | null;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<EAuthSteps>>;
  credsAuthType: TCredsAuthType;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
};

const AuthCodeStep = ({
  userPhoneNumber,
  twoFaToken,
  setIsReqError,
  setCurrentDate,
  setCurrentStep,
  credsAuthType,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const sendCode = async () => {
    if (!twoFaToken) {
      return;
    }

    setIsLoaded(false);

    try {
      await entryService.post2faEntryCode("phone", {
        twoFactorAuthToken: twoFaToken,
      });

      setCurrentStep(EAuthSteps.CONFIRM);

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

    LoggerService.error("Error during login entry code", error);
  };

  return (
    <>
      <Box
        className="c-font-24-26 c-sm-font-32-38 c-fw-500 c-font-color"
        component="h3"
        mb={{ xs: 1 }}
      >
        <Trans id="4z6V2sdJpFo2AyVoodCh5P-auth">
          Two-Factor Authentication
        </Trans>
      </Box>

      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={{ xs: 2, md: 3 }}
      >
        <Trans id="pXEQSxsY3FEAxKTDXGPKjv-auth">
          SMS with the code will be sent to a phone number ending with
        </Trans>{" "}
        {userPhoneNumber && <span>{userPhoneNumber}</span>}
      </Box>

      <CodeStepStylesButtons>
        <CodeStepStylesButton
          type="submit"
          style="colorfull"
          loading={!isLoaded}
          disabled={!isLoaded}
          onClick={sendCode}
        >
          <Trans id="1tnMcAs18Js8HyLCgoDWsH-auth">Send Code</Trans>
        </CodeStepStylesButton>

        <CodeStepStylesLink
          type="button"
          style="icon"
          onClick={() => {
            LocalStorageService.removeItem("au-t");
            LocalStorageService.removeItem("entryUN");
            LocalStorageService.removeItem("entryType");

            setCurrentStep(EAuthSteps.LOGING);
          }}
        >
          <Trans id="hwk4kzYM7d2noRGWaKRi6H-auth">Back</Trans>
        </CodeStepStylesLink>
      </CodeStepStylesButtons>
    </>
  );
};

export default AuthCodeStep;
