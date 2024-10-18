import { entryService } from "@/api";
import { TCredsLoginResult } from "@/models";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { PhoneInput } from "@components/UI/phoneInput";

import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classnames from "classnames";
import { FormikProps, useFormik } from "formik";
import { useRouter } from "next/router";
import { Dispatch, FC, FocusEvent, SetStateAction, useCallback } from "react";
import { object, string } from "yup";
import { Form, PassReset } from "../credentialsLogin.styles";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import classNames from "classnames";

interface FormFields {
  phone: string;
  password: string;
}

const initialValues: FormFields = {
  phone: "",
  password: "",
};

interface Props {
  handleLogin: (data: TCredsLoginResult) => void;
  isSocialAuthLoaded: boolean;
  clickInitFn?: (type: string) => void;
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

const PhoneLoginForm: FC<Props> = ({
  handleLogin,
  isSocialAuthLoaded,
  clickInitFn,
  iframeAuthPopup,
  setResetPassword,
}) => {
  const dispatch = useAppDispatch();

  const PASSWORD_ERROR_MESSAGE = t({
    id: "qAh9X9zoW2k8i3X1FUTqMA-auth",
    message: "Incorrect password",
  });

  const loginSchema = object({
    phone: string().required(
      t({ id: "egXSWu5DzXMD5c3iVTfQvs-auth", message: "Phone is required" }),
    ),
    password: string()
      .min(8, PASSWORD_ERROR_MESSAGE)
      .required(
        t({
          id: "8Rbk5ctLrSBHP3meh5h1iG-auth",
          message: "Password is required",
        }),
      ),
  });

  const { push } = useRouter();

  const onSubmit = useCallback(
    async (data: FormFields) => {
      clickInitFn && clickInitFn("creds/phone");

      try {
        const res = await entryService.login("phone", {
          phone: data.phone,
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
            type: "login/phone",
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
          <PhoneInput
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "nm2FAHnaML8xWFAEXFwwoZ-auth",
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

        <Box mb={{ xs: 3, md: 3 }} position="relative">
          <Input
            className={classnames("c-full-width", "input")}
            placeholder={t({
              id: "jyDejRzVNznLhyEiiyno2C-auth",
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
        >
          <div>
            <Trans id="iSG1u3o386RL1b9kwPfcvL-auth">Login</Trans>
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
        <Trans id="itfWaroHEvunLMApvBMyBW-auth">Forgot password?</Trans>
      </PassReset>
    </>
  );
};

export default PhoneLoginForm;
