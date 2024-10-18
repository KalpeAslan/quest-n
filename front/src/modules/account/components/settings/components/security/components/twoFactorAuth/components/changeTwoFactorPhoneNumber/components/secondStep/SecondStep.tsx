import { useEffect, useMemo, useState } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { DateTime } from "luxon";
import { t, Trans } from "@lingui/macro";

import { LoggerService } from "@services";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authService } from "@api";
import { FooterWrapper, FormWrapper } from "./secondStep.styles";
import { setAccountInfo } from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";

interface FormFields {
  code: string;
}

type Props = {
  currentDate: number | null;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"first" | "second" | "third" | "fourth">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
};

const TwoFactorSecondStep = ({
  currentDate,
  setIsReqError,
  setCurrentStep,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const [retry, setRetry] = useState(false);
  const [seconds, setSeconds] = useState<number>(60);

  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) setRetry(true);
  }, [seconds]);

  const sendCode = async (values: FormFields) => {
    if (values.code === "" || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      await authService.post2faDisconnectConfirm({
        code: values.code,
      });

      dispatch(
        setAccountInfo({
          ...accountInfo,
          security: {
            twoFactorAuth: false,
            phoneNumber: null,
          },
        }),
      );

      setCurrentStep("third");
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoaded(true);
    }
  };

  const reSendCode = async () => {
    setIsLoaded(false);

    try {
      await authService.post2faRetry();

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
      formik.setErrors({ code: "Wrong code" });

      return;
    }

    LoggerService.error("Error during disconnect 2fa - confirm step", error);
  };

  const initialValues: FormFields = {
    code: "",
  };

  const validationSchema = yup.object({
    code: yup
      .string()
      .trim()
      .min(
        6,
        t({ id: "hWJ5asow77qPUy6YyT4Z14-account", message: "Min length 6" }),
      )
      .required(
        t({
          id: "x2JCvjWdywpdtavnNuyd5s-account",
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
  }, [formik, isLoaded]);

  const userPhone = useMemo(() => {
    if (accountInfo?.security?.phoneNumber) {
      return accountInfo.security.phoneNumber;
    }

    return "";
  }, [accountInfo]);

  return (
    <>
      <Box className="c-font-14-20 c-font-color" component="p">
        <Trans id="k318bwPMezVXJHKBWitpLm-account">
          A message with a verification code has been sent to
        </Trans>{" "}
        {userPhone}
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={1.2}>
        <Trans id="kJAYsDh8YQtzbtxVmbLAo4-account">
          Enter the code you received via SMS
        </Trans>
      </Box>

      <FormWrapper
        component="form"
        mb={2}
        // @ts-ignore
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
              id: "bhTMRDz2DPAAut3Bc4ctfw-account",
              message: "Enter code",
            })}
            name="code"
            type="text"
            value={formik.values.code}
            error={formik.touched.code && Boolean(formik.errors.code)}
            errortext={formik.errors.code}
            onChange={e => {
              // @ts-ignore
              const { value } = e.target;
              const regex =
                /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;

              if (!value || regex.test(value.toString())) {
                formik.setTouched({ ...formik.touched, code: true });
                formik.handleChange(e);
              }
            }}
          />
        </Box>

        <Box mb={2}>
          <Button
            className="button"
            type="submit"
            style="task"
            loading={!isLoaded}
            disabled={isDisabled}
          >
            <Trans id="7C5F2ThhtoyuBh9cSM98Qp-account">Confirm</Trans>
          </Button>
        </Box>
      </FormWrapper>

      <FooterWrapper>
        {/* <Button
          className="link"
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={isResendDisabled || !isLoaded}
          onClick={() => {
            setCurrentDate(null);
            reSendCode();
          }}
        >
          <Trans id="aLxM3fDMJzyVzYFWeiFQDi-account">Resend SMS code</Trans>
        </Button> */}

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

        <Button
          className="link"
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={!isLoaded}
          onClick={() => setCurrentStep("first")}
        >
          <Trans id="gS6f8EcUNGHabdZp3MXk9r-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorSecondStep;
