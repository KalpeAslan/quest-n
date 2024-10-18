import { authService } from "@/api";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { EResetPasswordFlow } from "@/modules/account/models";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FormikHelpers, useFormik } from "formik";
import { FC, FocusEvent, useCallback, useEffect, useState } from "react";
import { object, string } from "yup";
import { Form } from "./confirmStep.styles";

interface Props {
  address: string;
  flow: EResetPasswordFlow;
  onVerificationResend: (data: {
    confirmToken: string;
    verificationAddress: string;
  }) => void;
  onVerificationConfirm: (data: { resetToken: string }) => void;
  confirmToken: string;
}

const ConfirmStep: FC<Props> = ({
  address,
  flow,
  onVerificationResend,
  onVerificationConfirm,
  confirmToken,
}) => {
  const schema = object({
    code: string()
      .min(
        6,
        t({
          id: "iT1rVrV9v5r5AtupUNZk6h-account",
          message: "Minimum 6 symbols",
        }),
      )
      .required(
        t({
          id: "su1zgL7S7tqCNvHkpftsGs-account",
          message: "Code is required",
        }),
      ),
  });

  const [retry, setRetry] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) setRetry(true);
  }, [seconds]);

  const resendCode = useCallback(async () => {
    try {
      const res = await authService.resendResetPasswordVerification({
        confirmToken,
        type: flow,
      });

      if (
        flow === EResetPasswordFlow.EMAIL &&
        res.data.confirmToken &&
        res.data.email
      ) {
        onVerificationResend({
          confirmToken: res.data.confirmToken,
          verificationAddress: res.data.email,
        });
      }

      if (
        flow === EResetPasswordFlow.PHONE &&
        res.data.confirmToken &&
        res.data.phoneNumber
      ) {
        onVerificationResend({
          confirmToken: res.data.confirmToken,
          verificationAddress: res.data.phoneNumber,
        });
      }

      setSeconds(60);
      setRetry(false);
    } catch (error) {
      console.log(error);
    }
  }, [confirmToken, flow, onVerificationResend]);

  const onSubmit = useCallback(
    async (
      data: { code: string },
      formikHelpers: FormikHelpers<{ code: string }>,
    ) => {
      try {
        const res = await authService.confirmResetPassword({
          confirmToken,
          code: data.code,
          type: flow,
        });

        if (!res || !res.data.resetToken) return;

        onVerificationConfirm({ resetToken: res.data.resetToken });
      } catch (error) {
        formikHelpers.setErrors({
          code: t({
            id: "wfAyyGeNxuyEzyw5L9tPBp-confirmStep",
            message: "Wrong Code",
          }),
        });
      }
    },
    [confirmToken, flow, onVerificationConfirm],
  );

  const formik = useFormik<{ code: string }>({
    initialValues: { code: "" },
    validationSchema: schema,
    initialErrors: { code: "" },
    validateOnBlur: true,
    onSubmit,
  });

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    formik.setTouched({ ...formik.touched, [e.target.name]: true });
  };

  const getError = useCallback(
    (name: keyof typeof formik.errors) => ({
      error: Boolean(formik.touched[name] && formik.errors[name]),
      errorText: formik.touched[name] ? formik.errors[name] : "",
    }),
    [formik],
  );

  return (
    <Form
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <Box
        component="h1"
        mb={2.5}
        className="c-sm-font-32-38 c-fw-500 c-font-color"
        textAlign="left"
      >
        <Trans id="gU9Qzo8FddSfqBv5LxvsRg-account">Forgot Password</Trans>
      </Box>

      <Box
        mb={2.5}
        textAlign="left"
        className="c-font-20-24 c-fw-500 c-font-color"
      >
        <Trans id="74Kq5DNZYk55627xuMRwMr-account">
          Enter the 4-digit verification code sent to {address} <br />
          The code is valid for 30 minutes
        </Trans>
      </Box>

      <Box mb={2.5}>
        <Input
          className={classNames("c-full-width", "input")}
          placeholder={t({
            id: "v5xDJc4RkfpP1sK5YXWXuZ-account",
            message: "Code",
          })}
          name="code"
          value={formik.values.code}
          onBlur={onBlur}
          onChange={e => {
            const { value } = e.target as any;
            const regex = /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;

            if (!value || regex.test(value.toString())) {
              formik.setTouched({ ...formik.touched, code: true });
              formik.handleChange(e);
            }
          }}
          error={getError("code").error}
          errortext={getError("code").errorText}
          classnames={{ error: "error" }}
        />
      </Box>

      {retry ? (
        <Box
          mb={2.5}
          textAlign="left"
          className="c-font-14-20 c-fw-400 c-font-color-3"
          onClick={resendCode}
          sx={{ cursor: "pointer" }}
        >
          <Trans id="hKXLn5dEV5o8NmwAEc9YmG-account">Resend Code</Trans>
        </Box>
      ) : (
        <Box
          mb={2.5}
          textAlign="left"
          className="c-font-14-20 c-fw-400 c-font-color"
        >
          <Trans id="snaz2K8UmrYZn6H58qUSmm-account">Code sent</Trans> (
          {seconds})
        </Box>
      )}

      <Button style="primary" className="c-full-width" type="submit">
        <Trans id="4vSPkvasGMPbrFWUgjEsdH-account">Submit</Trans>
      </Button>
    </Form>
  );
};

export default ConfirmStep;
