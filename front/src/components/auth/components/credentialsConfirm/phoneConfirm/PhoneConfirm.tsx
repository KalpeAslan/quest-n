import { entryService } from "@/api";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { EAuthSteps } from "@/models";
import { HelperService } from "@/services";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FormikHelpers, useFormik } from "formik";
import Link from "next/link";
import {
  Dispatch,
  FC,
  FocusEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { object, string } from "yup";
import { Policy, Wrapper } from "./phoneConfirm.styles";
import { setIsReferralPopupResultOpen } from "@/modules/account/store/account.slice";

interface Props {
  confirmToken: string;
  phone: string;
  setConfirmToken: (token: string) => void;
  setAuthStep: Dispatch<SetStateAction<EAuthSteps>>;
  iframeAuthPopup?: boolean;
}

const PhoneConfirm: FC<Props> = ({
  confirmToken,
  phone,
  setConfirmToken,
  setAuthStep,
  iframeAuthPopup,
}) => {
  const schema = object({
    code: string()
      .min(
        6,
        t({
          id: "4w5ZDH9Dsh4jH7WpcUTZxm-auth",
          message: "Minimum 6 symbols",
        }),
      )
      .required(
        t({ id: "bzf46HrBPvT2QkGbBBpP63-auth", message: "Code is required" }),
      ),
  });

  const dispatch = useAppDispatch();

  const [retry, setRetry] = useState(false);
  const [seconds, setSeconds] = useState<number>(60);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(prev => prev - 1), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) setRetry(true);
  }, [seconds]);

  const onSubmit = useCallback(
    async (
      data: { code: string },
      formikHelpers: FormikHelpers<{ code: string }>,
    ) => {
      try {
        const { data: result } = await entryService.verifyPhone({
          code: data.code,
          confirmToken,
        });

        if (!result?.accessToken || !result?.refreshToken) {
          formikHelpers.setErrors({
            code: t({
              id: "kWSA5D65f9YVJHYFACih6C-auth",
              message: "Wrong Code",
            }),
          });
          return;
        }

        HelperService.setupAuthData({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        setAuthStep(EAuthSteps.USERNAME);
      } catch (error) {
        if (
          ["wrong referrer code", "expired referrer period"].includes(
            error.response.data.message,
          )
        ) {
          dispatch(setIsReferralPopupResultOpen({ open: true, type: "error" }));
          return;
        }

        formikHelpers.setErrors({
          code: t({ id: "kWSA5D65f9YVJHYFACih6C-auth", message: "Wrong Code" }),
        });
      }
    },
    [confirmToken, dispatch, setAuthStep],
  );

  const formik = useFormik({
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

  const resendCode = useCallback(async () => {
    try {
      const { data: result } = await entryService.phoneResendVerificationCode({
        confirmToken,
      });

      if (!result?.confirmToken) return;

      setConfirmToken(result.confirmToken);

      setSeconds(60);
      setRetry(false);
    } catch (error) {
      console.log(error);
    }
  }, [confirmToken, setConfirmToken]);

  return (
    <Wrapper
      onSubmit={formik.handleSubmit}
      className={classNames({
        paddings: iframeAuthPopup,
      })}
    >
      <Box
        component="h3"
        className="c-sm-font-32-38 c-fw-500 c-font-color"
        mb={2.5}
        textAlign="left"
      >
        <Trans id="fvgW6TsMGtKB7EBdwVqzqD-auth">Phone Verification</Trans>
      </Box>

      <Box
        mb={2.5}
        className="c-font-color c-font-16-22 c-fw-500"
        textAlign="left"
      >
        <Trans id="qL3xkd98sKsDaaqSVyNT9T-auth">
          Enter the 6-digit verification code sent to {phone} <br />
          The code is valid for 30 minutes
        </Trans>
      </Box>

      <Box mb={2.5}>
        <Input
          className={classNames("c-full-width", "input")}
          placeholder={t({
            id: "pgWRCySQChBUaqdkdKxqBz-auth",
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
          <Trans id="jzQPiYAVtwMcAwMfJiAZu9-auth">Resend Code</Trans>
        </Box>
      ) : (
        <Box
          mb={2.5}
          textAlign="left"
          className="c-font-14-20 c-fw-400 c-font-color"
        >
          <Trans id="vfPjhCSwe1ooQcRnVVe1Jp-auth">Code sent</Trans> ({seconds})
        </Box>
      )}

      <Button style="primary" className="c-full-width" type="submit">
        <Trans id="h2jGPsWHberFZrDy9Nht8L-auth">Submit</Trans>
      </Button>

      <Policy
        className="c-font-14-20 c-font-color-2"
        component="p"
        mt={{ xs: 2, md: 3 }}
      >
        <Trans id="ixbK25i3XFvB9q8inPN3k5-auth">
          By creating account i agree with{" "}
          <Link href="/privacy-policy" className="c-font-color-2">
            Privacy policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-and-condition" className="c-font-color-2">
            Terms of service
          </Link>
        </Trans>
      </Policy>
    </Wrapper>
  );
};

export default PhoneConfirm;
