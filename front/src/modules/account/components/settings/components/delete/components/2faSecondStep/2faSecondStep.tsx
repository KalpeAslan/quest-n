import { useEffect, useMemo, useState } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { DateTime } from "luxon";
import { t, Trans } from "@lingui/macro";

import { LoggerService } from "@services";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { authService } from "@api";
import { FooterWrapper, FormWrapper } from "./2faSecondStep.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

interface FormFields {
  code: string;
}

type Props = {
  currentDate: number | null;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"init" | "code" | "confirm">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteToken: React.Dispatch<React.SetStateAction<number | null>>;
};

const TwoFactorSecondStep = ({
  currentDate,
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
  setIsPopupOpen,
  setDeleteToken,
}: Props) => {
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
    if (values.code === "" || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      const { data } = await authService.postInvestor2FaConfirm({
        code: values.code,
      });

      if (data.deleteToken) {
        setDeleteToken(data.deleteToken);

        setIsPopupOpen(true);
      }
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
      formik.setErrors({
        code: t({
          id: "8ZHg7tzFepvdK3oNEHssLK-account",
          message: "Wrong code",
        }),
      });

      return;
    }

    LoggerService.error("Error duringdelete account - confirm step", error);
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
        t({ id: "cGCZcacYuiK8EsJ7EJ2C26-account", message: "Min length 6" }),
      )
      .required(
        t({
          id: "gUfS9eYLCmoS8GDQCzMtVd-account",
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
        <Trans id="bdQHS1FyEoryAaU1pWDiZB-account">
          A message with a verification code has been sent to
        </Trans>{" "}
        {userPhone}
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={1.2}>
        <Trans id="eW2UrXxcMhD7okD3vZak6J-account">
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
              id: "kei4q21bepsv78tBSR5Lea-account",
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
            <Trans id="f9MaESYB3N9rk6LJPmpiu1-account">Confirm</Trans>
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
          <Trans id="h8uK9AxStQQBi21kC7Xjk1-account">Resend SMS code</Trans>
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
          onClick={() => setCurrentStep("init")}
        >
          <Trans id="umpvQYtizesn1PEQgiYoxz-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorSecondStep;
