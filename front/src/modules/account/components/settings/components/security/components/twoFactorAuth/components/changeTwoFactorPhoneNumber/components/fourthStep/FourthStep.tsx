import { useMemo, useState } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { DateTime } from "luxon";
import Countdown from "react-countdown";
import { t, Trans } from "@lingui/macro";

import { LoggerService } from "@services";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { authService } from "@api";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  FooterWrapper,
  FormWrapper,
  PreHeadWrapper,
} from "./fourthStep.styles";
import { setAccountInfo } from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";

interface FormFields {
  code: string;
}

type Props = {
  currentDate: number | null;
  phoneValue: string;
  setIsReqError: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"first" | "second" | "third" | "fourth">
  >;
  setCurrentDate: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveFlow: React.Dispatch<
    React.SetStateAction<"Change number" | "Remove 2fa" | null>
  >;
};

const TwoFactorFourthStep = ({
  currentDate,
  phoneValue,
  setIsReqError,
  setCurrentStep,
  setCurrentDate,
  setActiveFlow,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  const sendCode = async (values: FormFields) => {
    if (values.code === "" || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      const { data } = await authService.post2faConnectConfirm({
        code: values.code,
      });

      dispatch(
        setAccountInfo({
          ...accountInfo,
          security: {
            twoFactorAuth: true,
            phoneNumber: data.phoneNumber,
          },
        }),
      );

      setActiveFlow(null);
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

      const time = DateTime.now().plus({ minutes: 2 }).toUnixInteger();
      setCurrentDate(time);
      setIsResendDisabled(true);
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
          id: "46KaKr3XefCJkGcdwJD7ST-account",
          message: "Wrong code",
        }),
      });

      return;
    }
    if (response.status === 400 && response.data.errorCode === 20429) {
      formik.setErrors({
        code: t({
          id: "6df6KaKr3XefCJkGcdwJD7ST-account",
          message: "Too many attempts. Please try again later",
        }),
      });

      return;
    }

    LoggerService.error("Error during connect 2fa - confirm step", error);
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
        t({ id: "hEG4bJvSLQnQrtngeCVNfj-account", message: "Min length 6" }),
      )
      .required(
        t({
          id: "eGG628V2LCbAP8jspUjyZ3-account",
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

  return (
    <>
      <Box component="p" className="c-font-14-20 c-font-color">
        <Trans id="98jyxgvVGrkvcBNegYctCo-account">
          A message with a verification code has been sent to
        </Trans>{" "}
        {phoneValue}
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p">
        <Trans id="xqQehG5JCRmkrwPet6qWYZ-account">
          Enter the code you received via SMS
        </Trans>
      </Box>

      <PreHeadWrapper mb={1.2}>
        <Box component="p" className="c-font-14-20 c-font-color" mr={1}>
          <Trans id="syakNDzjtBQVUxG87Q2ePr-account">
            The code is active during
          </Trans>
        </Box>

        {endTime && (
          <p className="c-font-14-20 c-fw-500 c-font-color">
            <Countdown
              date={endTime}
              renderer={({ formatted }: any) => {
                return (
                  <span>
                    <Trans id="uATqyYUr8Yboma5TSj31EH-account">
                      {formatted.minutes}m : {formatted.seconds}s
                    </Trans>
                  </span>
                );
              }}
              zeroPadTime={2}
              zeroPadDays={2}
              onComplete={() => {
                setIsResendDisabled(false);
              }}
            />
          </p>
        )}
      </PreHeadWrapper>

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
              id: "8X5ZWktbEzsbbWdZeHxfjD-account",
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
            <Trans id="6RwWgqfpVnsMaXzmejknVb-account">Confirm</Trans>
          </Button>
        </Box>
      </FormWrapper>

      <FooterWrapper>
        <Button
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
          <Trans id="jKfJ6uHdGHxKtM6a4CPvms-account">Resend SMS code</Trans>
        </Button>

        <Button
          className="link"
          type="button"
          style="icon"
          loading={!isLoaded}
          disabled={!isLoaded}
          onClick={() => setCurrentStep("first")}
        >
          <Trans id="igeQLXZdzYPxPWukTjLQfA-account">Cancel</Trans>
        </Button>
      </FooterWrapper>
    </>
  );
};

export default TwoFactorFourthStep;
