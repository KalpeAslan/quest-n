import { useState, useRef, useMemo } from "react";
import classnames from "classnames";
import ReCAPTCHA from "react-google-recaptcha";
import { t, Trans } from "@lingui/macro";
import { Icon } from "@components/UI/icon";
import { Input } from "@components/UI/input";
import { ApiService } from "@api/api";

import {
  SubscriptionStylesInputWrapper,
  SubscriptionStylesMessage,
  SubscriptionStylesWrapper,
} from "./subscription.styles";
import { FormikProps, useFormik } from "formik";
import * as yup from "yup";
import { appConfig } from "@/app.config";

interface FormFields {
  email: string;
}

const Subscription = () => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>();

  const submit = async () => {
    try {
      setIsLoaded(false);
      const token = await (recaptchaRef as any).current.executeAsync();
      (recaptchaRef as any).current.reset();

      if (appConfig.NEXT_PUBLIC_API_HOST) {
        const api = new ApiService(appConfig.NEXT_PUBLIC_API_HOST);

        await api.post("/email", {
          email: formik.values.email,
          reCaptchaToken: token,
        });

        setIsSuccess(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoaded(true);
    }
  };

  const initialValues: FormFields = {
    email: "",
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .required(
        t({
          id: "kihdkW6xrGteMGKEe5fdJT-subscription",
          message: "This field is required",
        }),
      )
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        t({
          id: "o9UygvNvxdYKB36mGGzGrN-subscription",
          message: "The email you've entered is invalid",
        }),
      ),
  });

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: submit,
  });

  const isDisabled = useMemo(() => {
    if (!formik.isValid) {
      return true;
    }

    if (formik.values.email === "") {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [formik, isLoaded]);

  const handleClick = () => {
    if (isSuccess) {
      formik.resetForm();
      setIsSuccess(false);

      return;
    }

    submit();
  };

  return (
    <SubscriptionStylesWrapper
      hasError={formik.touched.email && Boolean(formik.errors.email)}
    >
      <form
        autoComplete="off"
        onSubmit={(e: any) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <SubscriptionStylesInputWrapper>
          {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
            <ReCAPTCHA
              // @ts-ignore
              ref={recaptchaRef}
              size="invisible"
              sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
            />
          )}
          <Input
            className={classnames("input", "c-full-width")}
            placeholder={t({
              id: "pCRujoJURASmVm7xCzbGVZ-subscription",
              message: "Email address",
            })}
            name="email"
            styles="secondary"
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            errortext={formik.errors.email}
            onChange={e => {
              setIsSuccess(false);
              setIsError(false);
              formik.setTouched({ ...formik.touched, email: true });
              formik.handleChange(e);
            }}
            classnames={{ clear: "clear", error: "error" }}
            onKeyDown={e => {
              if (e.key === "Enter" && !isDisabled) {
                submit();
              }
            }}
          />

          <button
            className={classnames(
              { loading: !isLoaded, success: isSuccess },
              "c-button-icon",
            )}
            type="submit"
            onClick={handleClick}
            disabled={isDisabled}
          >
            {isLoaded && !isSuccess && (
              <Icon name="link-arrow-left" size="20" />
            )}

            {isLoaded && isSuccess && <Icon name="check-mark" size="20" />}

            {!isLoaded && (
              <Icon
                className={classnames("rotating")}
                name="loading"
                size="20"
              />
            )}
          </button>
        </SubscriptionStylesInputWrapper>
      </form>

      {isError && (
        <SubscriptionStylesMessage className={"c-text-error c-font-14-20"}>
          <Trans id="buFRZVCwDSZFkQ2riP7dyT-subscription">
            The email address you&#39;ve entered is invalid.
          </Trans>
        </SubscriptionStylesMessage>
      )}
    </SubscriptionStylesWrapper>
  );
};

export default Subscription;
