import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { HelperService, LoggerService } from "@services";
import { FormikProps, useFormik } from "formik";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";

import { entryService } from "@api";
import { Input } from "@components/UI/input";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  ConfirmStepStylesButton,
  ConfirmStepStylesFooter,
  ConfirmStepStylesForm,
  ConfirmStepStylesLink,
} from "./confirmStep.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { EAuthSteps } from "@/models";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { experienceService } from "@/api/services";

interface FormFields {
  code: string;
}

type Props = {
  currentDate: number | null;
  userPhoneNumber: number | string | null;
  twoFaToken: string | null;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<EAuthSteps>>;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
};

const AuthConfirmStep = ({
  currentDate,
  userPhoneNumber,
  twoFaToken,
  setIsReqError,
  setCurrentStep,
}: Props) => {
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const [retry, setRetry] = useState(false);
  const [seconds, setSeconds] = useState<number>(60);

  const accountInfo = useTypedSelector(getAccountInfo);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) setRetry(true);
  }, [seconds]);

  const sendCode = async (values: FormFields) => {
    if (values.code === "" || !twoFaToken || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      const { data: result } = await entryService.post2faEntryConfirm({
        code: values.code,
        twoFactorAuthToken: twoFaToken,
      });

      if (!result?.accessToken || !result?.refreshToken) return;

      HelperService.setupAuthData(result);

      await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await experienceService.verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(sendAnalyticsDataThunk({ type: "login_complete", options: {} }));
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoaded(true);
    }
  };

  const reSendCode = async () => {
    if (!twoFaToken) {
      return;
    }

    setIsLoaded(false);

    try {
      await entryService.post2faEntryCode("phone", {
        twoFactorAuthToken: twoFaToken,
      });

      setSeconds(60);
      setRetry(false);
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

    if (response.status === 400 && response.data.errorCode === 1001) {
      formik.setErrors({
        code: t({ id: "cEFofcFqDnupgDaPVpDXT6-auth", message: "Wrong code" }),
      });

      return;
    }

    LoggerService.error("Error during login entry code", error);
  };

  const initialValues: FormFields = {
    code: "",
  };

  const validationSchema = yup.object({
    code: yup
      .string()
      .trim()
      .min(6, t({ id: "fWHYUb2eWD3EFKTSBGbmDb-auth", message: "Min length 6" }))
      .required(
        t({
          id: "4V6BdJmXbhzDMh4mweWZzC-auth",
          message: "This field is required",
        }),
      ),
  });

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: sendCode,
  });

  const endTime = useMemo(() => {
    if (currentDate) {
      return `${DateTime.fromSeconds(currentDate)}`;
    }

    return null;
  }, [currentDate]);

  const isDisabled = useMemo(() => {
    if (formik.errors.code) {
      return true;
    }

    if (formik.values.code === "") {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [formik, isLoaded, accountInfo]);

  return (
    <>
      <Box
        className="c-font-24-26 c-sm-font-32-38 c-fw-500 c-font-color"
        component="h3"
        mb={{ xs: 1 }}
      >
        <Trans id="gApHcEFFejpJsk7xSvjgBY-auth">
          Two-Factor Authentication
        </Trans>
      </Box>

      <Box className="c-font-20-24 c-fw-500 c-font-color" component="p" mb={3}>
        <Trans id="pVzJX7JAnGdhPFuhfEdher-auth">
          SMS with the code will be sent to a phone number ending with
        </Trans>{" "}
        {userPhoneNumber && <span>{userPhoneNumber}</span>}
      </Box>

      <ConfirmStepStylesForm
        component="form"
        mb={2}
        autoComplete="off"
        onSubmit={(e: any) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Box mb={{ xs: 2, md: formik.errors.code ? 2 : 3 }}>
          <Input
            className="c-full-width"
            placeholder={t({
              id: "8RnDWe2Uj5uA49LxCH8raM-auth",
              message: "Authentication code",
            })}
            name="code"
            type="text"
            value={formik.values.code}
            error={formik.touched.code && Boolean(formik.errors.code)}
            errortext={formik.errors.code}
            onChange={e => {
              const { value } = e.target as any;
              const regex =
                /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;

              if (!value || regex.test(value.toString())) {
                formik.setTouched({ ...formik.touched, code: true });
                formik.handleChange(e);
              }
            }}
          />
        </Box>

        <Box>
          <ConfirmStepStylesButton
            type="submit"
            style="colorfull"
            loading={!isLoaded}
            disabled={isDisabled}
          >
            <Trans id="axESAMKTk3h3TdkYNaMsjZ-auth">Confirm</Trans>
          </ConfirmStepStylesButton>
        </Box>
      </ConfirmStepStylesForm>

      <ConfirmStepStylesFooter>
        {/* <ConfirmStepStylesLink
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={isResendDisabled || !isLoaded}
          onClick={() => {
            setCurrentDate(null);
            reSendCode();
          }}
        >
          <Trans id="xiTYGJ9BCakE92cBWPUZdA-auth">Resend SMS code</Trans>
        </ConfirmStepStylesLink> */}

        {retry ? (
          <Box
            mb={2.5}
            textAlign="left"
            className="c-font-14-20 c-fw-400 c-font-color-3"
            onClick={reSendCode}
            sx={{ cursor: "pointer" }}
          >
            <Trans id="jzQPiYAVtwMcAwMfJiAZu9-auth">Resend Code</Trans>
          </Box>
        ) : (
          <Box
            mb={2.5}
            textAlign="left"
            className="c-font-14-20 c-fw-400 c-font-color"
          >
            <Trans id="vfPjhCSwe1ooQcRnVVe1Jp-auth">Code sent</Trans> ({seconds}
            )
          </Box>
        )}

        <ConfirmStepStylesLink
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={!isLoaded}
          onClick={() => setCurrentStep(EAuthSteps.CODE)}
        >
          <Trans id="7jBfVAUv8JDboWYyUu3cY6-auth">Back</Trans>
        </ConfirmStepStylesLink>
      </ConfirmStepStylesFooter>
    </>
  );
};

export default AuthConfirmStep;
