import { useCallback, FocusEvent, FC, useRef, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { FormikProps, useFormik } from "formik";
import { t, Trans } from "@lingui/macro";
import { object, string } from "yup";

import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { PhoneInput } from "@components/UI/phoneInput";
import { Form, Policy } from "../../credentialSignup.styles";
import Link from "next/link";
import { TCredsSignupResult } from "@/models";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { entryService } from "@/api";
import {
  setIsReferralPopupResultOpen,
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import ReCAPTCHA from "react-google-recaptcha";
import { appConfig } from "@/app.config";
import { countConvs } from "@/lib/evaDav";
import classNames from "classnames";

interface FormFields {
  phone: string;
  password: string;
}

interface Props {
  handleCredsAuth: (data: TCredsSignupResult) => void;
  clickInitFn?: (type: string) => void;
  iframeAuthPopup?: boolean;
}

const initialValues: FormFields = {
  phone: "",
  password: "",
};

const PhoneSignup: FC<Props> = ({
  handleCredsAuth,
  clickInitFn,
  iframeAuthPopup,
}) => {
  const [loading, setLoading] = useState(false);

  const PASSWORD_ERROR_MESSAGE = t({
    id: "beecW58Rs7s4wVZSqop6ek-auth",
    message: "The password must contain at least 8 characters",
  });

  const formSchema = object({
    phone: string().required(
      t({ id: "vXXGD4dvCV1PAKFJQRGepk-auth", message: "Phone is required" }),
    ),
    password: string()
      .trim()
      .min(8, PASSWORD_ERROR_MESSAGE)
      .required(
        t({
          id: "h13Fb521V274SQUzaZ1Yik-auth",
          message: "Password is required",
        }),
      )
      .matches(/^\S+$/, "No spaces allowed"),
  });

  const dispatch = useAppDispatch();

  const recaptchaRef = useRef<ReCAPTCHA>();

  const onSubmit = useCallback(
    async (data: FormFields) => {
      setLoading(true);
      countConvs();
      clickInitFn && clickInitFn("creds/phone");

      try {
        let reCaptchaToken = "";

        if (!appConfig.NEXT_PUBLIC_DISABLE_RECAPTCHA) {
          reCaptchaToken = await (recaptchaRef as any).current.executeAsync();

          (recaptchaRef as any).current.reset();
        }

        const { data: result } = await entryService.registration("phone", {
          phone: data.phone,
          password: data.password.trim(),
          reCaptchaToken,
        });

        if (!result?.confirmToken || !result?.phoneNumber) return;

        handleCredsAuth({
          confirmToken: result.confirmToken,
          phone: result.phoneNumber,
        });
      } catch (error) {
        if (
          ["wrong referrer code", "expired referrer period"].includes(
            error.response.data.message,
          )
        ) {
          dispatch(setIsReferralPopupResultOpen({ open: true, type: "error" }));
          return;
        }

        if (error.response.data.message === "invalid recapcha") return;

        dispatch(
          setIsRestrictionForCreationPopupOpen({
            open: true,
            type: "phone",
            username: "",
          }),
        );
      } finally {
        dispatch(setIsSocialAuthLoaded(true));
        setLoading(false);
      }
    },
    [dispatch, handleCredsAuth, clickInitFn],
  );

  const formik: FormikProps<FormFields> = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: formSchema,
    initialErrors: initialValues,
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
    <>
      <Box
        className="c-font-16-22 c-fw-500 c-font-color"
        component="p"
        mb="20px"
        mt="20px"
        sx={{ textAlign: "left" }}
      >
        <Trans id="s9FzfzX9DnajQ1YcxyAW5H-auth">
          Enter your phone and password
        </Trans>
      </Box>

      <Form
        autoComplete="off"
        className={classNames({ paddings: iframeAuthPopup })}
        onSubmit={e => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Box mb={{ xs: 3, md: 3 }}>
          <PhoneInput
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "hHYCQyWhMBnB86bwDDixCM-auth",
              message: "Phone",
            })}
            name="phone"
            value={formik.values.phone}
            onBlur={onBlur}
            setValue={data => formik.setFieldValue("phone", data)}
            isPhoneInvalid={Boolean(formik.errors.phone)}
            setPhoneError={(value: string) =>
              formik.setFieldError("phone", value)
            }
            noPlaceholder
          />
        </Box>

        <Box mb={{ xs: 8, md: 8 }} position="relative">
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "sujBwMhQodbJiMdrzVBehT-auth",
              message: "Password",
            })}
            name="password"
            type="password"
            value={formik.values.password}
            onBlur={onBlur}
            onChange={formik.handleChange}
            error={getError("password").error}
            errortext={getError("password").errorText}
            classnames={{ error: "error" }}
            password
          />
          {!getError("password").error && (
            <p className={classnames("error", "helper")}>
              {PASSWORD_ERROR_MESSAGE}
            </p>
          )}
        </Box>

        <Button
          className="butt"
          loading={loading}
          type="submit"
          style="primary"
          disableTouchStart
        >
          <div>
            <Trans id="ftHjddrhs8orSzqEUbLGzE-auth">Create</Trans>
          </div>
        </Button>

        {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
          />
        )}
      </Form>

      <Policy
        className="c-font-14-20 c-font-color-2"
        component="p"
        mt={{ xs: 2, md: 3 }}
        mb={{ xs: 2, md: 3 }}
      >
        <Trans id="6hZqPENkNAf7F171fTa8zd-auth">
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
    </>
  );
};

export default PhoneSignup;
