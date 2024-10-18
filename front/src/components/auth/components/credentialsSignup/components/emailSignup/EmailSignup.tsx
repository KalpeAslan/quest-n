import { useCallback, FocusEvent, FC, useRef, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { FormikProps, useFormik } from "formik";
import { t, Trans } from "@lingui/macro";
import { object, string } from "yup";

import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { Form, Policy } from "../../credentialSignup.styles";
import Link from "next/link";
import { entryService } from "@/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setIsReferralPopupResultOpen,
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import { useTypedSelector } from "../../../../../../hooks/useTypedSelector";
import { getLocalReferralCode } from "@/modules/account/store/account.selector";
import { TCredsSignupResult } from "@/models";
import ReCAPTCHA from "react-google-recaptcha";
import { appConfig } from "@/app.config";
import { countConvs } from "@/lib/evaDav";
import { getLoginPrevLocation } from "@/store/slices/system/system.selector";
import classNames from "classnames";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

interface FormFields {
  email: string;
  password: string;
}

interface Props {
  handleCredsAuth: (data: TCredsSignupResult) => void;
  clickInitFn?: (type: string) => void;
  iframeAuthPopup?: boolean;
}

const initialValues: FormFields = {
  email: "",
  password: "",
};

const EmailSignup: FC<Props> = ({
  handleCredsAuth,
  clickInitFn,
  iframeAuthPopup,
}) => {
  const PASSWORD_ERROR_MESSAGE = t({
    id: "7wEhKMcqjeoG63ePr8pLPu-auth",
    message: "The password must contain at least 8 characters",
  });

  const [loading, setLoading] = useState(false);

  const formSchema = object({
    email: string()
      .email(
        t({
          id: "hEfrRVZPusjeBnE3gbRQSZ-auth",
          message: "Please enter a valid email",
        }),
      )
      .required(
        t({ id: "2LMpYHUQ3PLDXGwMGjqWh9-auth", message: "Email is required" }),
      ),
    password: string()
      .trim()
      .min(8, PASSWORD_ERROR_MESSAGE)
      .required(
        t({
          id: "cDbV5LHLKZ5p1KQwihF5Kp-auth",
          message: "Password is required",
        }),
      )
      .matches(/^\S+$/, "No spaces allowed"),
  });

  const dispatch = useAppDispatch();

  const recaptchaRef = useRef<ReCAPTCHA>();

  const localReferralCode = useTypedSelector(getLocalReferralCode);
  const questReferralCode = useQuestReferralCode();
  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const onSubmit = useCallback(
    async (data: FormFields) => {
      setLoading(true);
      clickInitFn && clickInitFn("creds/email");
      countConvs();
      try {
        let reCaptchaToken = "";

        if (!appConfig.NEXT_PUBLIC_DISABLE_RECAPTCHA) {
          reCaptchaToken = await (recaptchaRef as any).current.executeAsync();

          (recaptchaRef as any).current.reset();
        }

        const { data: result } = await entryService.registration("email", {
          email: data.email,
          password: data.password.trim(),
          referralCode: localReferralCode || questReferralCode || "",
          reCaptchaToken,
          redirect: loginPrevLocation,
        });

        if (!result?.email) return;

        handleCredsAuth({
          confirmToken: result.confirmToken || "",
          email: result.email,
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
            type: "email",
            username: "",
          }),
        );
      } finally {
        dispatch(setIsSocialAuthLoaded(true));
        setLoading(false);
      }
    },
    [
      clickInitFn,
      localReferralCode,
      questReferralCode,
      loginPrevLocation,
      handleCredsAuth,
      dispatch,
    ],
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
        <Trans id="cEreQHMHQttYtgoP5TjJVw-auth">
          Enter your email and password
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
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "sFRkxm9ySTx5nx7ghap4he-auth",
              message: "Email",
            })}
            name="email"
            value={formik.values.email}
            onBlur={onBlur}
            onChange={formik.handleChange}
            error={getError("email").error}
            errortext={getError("email").errorText}
            classnames={{ error: "error" }}
          />
        </Box>

        <Box mb={{ xs: 8, md: 8 }} position="relative">
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "14heHKzKpZuLukFXiX7xYo-auth",
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
          onClick={formik.handleSubmit}
          disableTouchStart
        >
          <div>
            <Trans id="myWS6ggRyCqF9FVxpGRhg9-auth">Create</Trans>
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
        <Trans id="v8iU3APZaHrhJMGb734ito-auth">
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

export default EmailSignup;
