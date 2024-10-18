import { entryService } from "@/api";
import { TCredsLoginResult } from "@/models";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classnames from "classnames";
import { FormikProps, useFormik } from "formik";
import { useRouter } from "next/router";
import { Dispatch, FC, FocusEvent, SetStateAction, useCallback } from "react";
import { object, string } from "yup";
import { Form, PassReset } from "../credentialsLogin.styles";
import {
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import classNames from "classnames";

interface FormFields {
  email: string;
  password: string;
}

const initialValues: FormFields = {
  email: "",
  password: "",
};

interface Props {
  handleLogin: (data: TCredsLoginResult) => void;
  isSocialAuthLoaded: boolean;
  clickInitFn?: (type: string) => void;
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

const EmailLoginForm: FC<Props> = ({
  handleLogin,
  isSocialAuthLoaded,
  clickInitFn,
  iframeAuthPopup,
  setResetPassword,
}) => {
  const dispatch = useAppDispatch();

  const PASSWORD_ERROR_MESSAGE = t({
    id: "tcMq9CTVp7Q2SqZ6kJzUWc-auth",
    message: "Incorrect password",
  });

  const loginSchema = object({
    email: string()
      .email(
        t({
          id: "86a8k5dksA2KjXXzyPmTpd-auth",
          message: "Please enter a valid email",
        }),
      )
      .required(
        t({ id: "h7BdnxXWaw3rFEHTxXW5RF-auth", message: "Email is required" }),
      ),
    password: string()
      .min(8, PASSWORD_ERROR_MESSAGE)
      .required(
        t({
          id: "62Y7FvK5W5ipcik5xgQE1c-auth",
          message: "Password is required",
        }),
      ),
  });

  const { push } = useRouter();

  const onSubmit = useCallback(
    async (data: FormFields) => {
      clickInitFn && clickInitFn("creds/email");
      try {
        const res = await entryService.login("email", {
          email: data.email,
          password: data.password,
        });

        if (
          res.data.twoFactorAuth &&
          res.data.twoFactorAuthToken &&
          res.data.phoneNumber
        ) {
          handleLogin({
            twoFactorAuth: res.data.twoFactorAuth,
            twoFactorAuthToken: res.data.twoFactorAuthToken,
            phoneNumber: res.data.phoneNumber,
          });
        }

        if (res.data.accessToken && res.data.refreshToken) {
          handleLogin({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });
        }
      } catch (error) {
        dispatch(
          setIsRestrictionForCreationPopupOpen({
            open: true,
            type: "login/email",
            username: "",
          }),
        );
      } finally {
        dispatch(setIsSocialAuthLoaded(true));
      }
    },
    [handleLogin, clickInitFn, dispatch],
  );

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validationSchema: loginSchema,
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
      <Form
        className={classNames("c-full-width", { paddings: iframeAuthPopup })}
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Box mb={{ xs: 3, md: 3 }}>
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "dJeDKobtG6z7PtVRxG6TWd-auth",
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

        <Box mb={{ xs: 3, md: 3 }} position="relative">
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "kxeymrKfZcX25wZK3YVCZr-auth",
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
          />
        </Box>

        <Button
          className="c-full-width"
          type="submit"
          style="primary"
          loading={!isSocialAuthLoaded}
          onClick={formik.handleSubmit}
        >
          <div>
            <Trans id="f3pxbcvqYUpggM7TjXHsWh-auth">Login</Trans>
          </div>
        </Button>
      </Form>

      <PassReset
        m="0 auto"
        sx={{ cursor: "pointer" }}
        onClick={() => {
          if (iframeAuthPopup) {
            setResetPassword(true);
          } else {
            push("/reset-password");
          }
        }}
        component="p"
      >
        <Trans id="1q6Pt2HDBKWSbmTYVgptds-auth">Forgot password?</Trans>
      </PassReset>
    </>
  );
};

export default EmailLoginForm;
