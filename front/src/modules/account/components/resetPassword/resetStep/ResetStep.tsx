import { authService, experienceService } from "@/api";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { EResetPasswordFlow } from "@/modules/account/models";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { useRouter } from "next/router";
import { Dispatch, FC, FocusEvent, SetStateAction, useCallback } from "react";
import { object, string } from "yup";
import { Form } from "./resetStep.styles";
import { HelperService } from "@services";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { useAppDispatch } from "@hooks/useAppDispatch";

interface Props {
  flow: EResetPasswordFlow;
  resetToken: string;
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  password: string;
}

const initialValues: FormFields = {
  password: "",
};

const ResetStep: FC<Props> = ({
  flow,
  resetToken,
  iframeAuthPopup,
  setResetPassword,
}) => {
  const PASSWORD_ERROR_MESSAGE = t({
    id: "4DSRnH8bHhDzWVdVx9sDBT-account",
    message: "The password must contain at least 8 characters",
  });

  const schema = object({
    password: string()
      .trim()
      .min(8, PASSWORD_ERROR_MESSAGE)
      .required(
        t({
          id: "vHCKZCV83T5JQb9mBm2xBk-account",
          message: "Password is required",
        }),
      )
      .matches(/^\S+$/, "No spaces allowed"),
  });

  const { push, query } = useRouter();

  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      try {
        const {
          data: { accessToken, refreshToken },
        } = await authService.resetPassword({
          resetToken,
          newPassword: data.password.trim(),
          type: flow,
        });

        if (query.change) {
          push("/profile/security");
          return;
        }

        HelperService.setupAuthData({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
        await experienceService.verify();

        await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

        dispatch(
          sendAnalyticsDataThunk({ type: "login_complete", options: {} }),
        );

        if (iframeAuthPopup) {
          setResetPassword(false);
        } else {
          push("/login");
        }
      } catch (error) {
        formikHelpers.setErrors({
          password: t({
            id: "oKzLmAsyickkzEnTsLD8v3-account",
            message: "Invalid password",
          }),
        });
      }
    },
    [
      resetToken,
      flow,
      query.change,
      dispatch,
      iframeAuthPopup,
      push,
      setResetPassword,
    ],
  );

  const formik: FormikProps<FormFields> = useFormik<FormFields>({
    initialValues,
    validationSchema: schema,
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
        textAlign="left"
        className="c-sm-font-32-38 c-fw-500 c-font-color"
      >
        <Trans id="mD4697PiFkwwiCgFjXHQxQ-account">Create new password</Trans>
      </Box>

      <Box mb={{ xs: 8, md: 8 }} position="relative">
        <Input
          className={classNames("c-full-width", "input")}
          placeholder={t({
            id: "oswuTRoXQrDUVmxzsC4omF-account",
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
          <p className={classNames("error", "helper")}>
            {PASSWORD_ERROR_MESSAGE}
          </p>
        )}
      </Box>

      <Button className="butt" type="submit" style="primary">
        <div>
          <Trans id="72zAs1vKJs2fGLPoGF2Fof-account">Create</Trans>
        </div>
      </Button>
    </Form>
  );
};

export default ResetStep;
