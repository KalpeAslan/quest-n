import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./changePasswordPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { FC, FocusEvent, useCallback, useState } from "react";
import { TAuthType } from "@/modules/account/models";
import { Input } from "@/components/UI/input";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { object, ref, string } from "yup";
import classNames from "classnames";
import { authService } from "@/api";
import { useRouter } from "next/router";
import { Trans, t } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setSuccessOpen: (value: boolean) => void;
  type: TAuthType | "";
}

interface FormFields {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialValues: FormFields = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordPopup: FC<Props> = ({
  isOpen,
  setIsOpen,
  setSuccessOpen,
  type,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { push } = useRouter();

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const validationSchema = object({
    oldPassword: string()
      .trim()
      .min(
        8,
        t({
          id: "jazq7vxUEXktCoMqPitBTB-changePasswordPopup",
          message: "Incorrect password",
        }),
      )
      .required(
        t({
          id: "34f6EvY1Wz1DoLtWm9eDGT-changePasswordPopup",
          message: "Current password is required",
        }),
      )
      .matches(
        /^\S+$/,
        t({
          id: "9Bunq2JWBiGD8xGjeuKX7G-changePasswordPopup",
          message: "No spaces allowed",
        }),
      ),
    newPassword: string()
      .trim()
      .min(
        8,
        t({
          id: "kShmHVUqutcNN6f6M78yjJ-changePasswordPopup",
          message: "Password is too short",
        }),
      )
      .required(
        t({
          id: "m3Xn6QF8qxGbF5zkdA5xit-changePasswordPopup",
          message: "New password is required",
        }),
      )
      .matches(
        /^\S+$/,
        t({
          id: "x31s7Z82iNNY3KsuaSYf3F-changePasswordPopup",
          message: "No spaces allowed",
        }),
      ),
    confirmPassword: string()
      .trim()
      .min(
        8,
        t({
          id: "nTTHhP9brGBs67es1wtZeM-changePasswordPopup",
          message: "Password is too short",
        }),
      )
      .required(
        t({
          id: "8vqQKiv8rpyqjrvULA2Vn4-changePasswordPopup",
          message: "Confirm password is required",
        }),
      )
      .matches(
        /^\S+$/,
        t({
          id: "7ZmxosXHPa5wQwBeakxQYm-changePasswordPopup",
          message: "No spaces allowed",
        }),
      )
      .oneOf(
        [ref("newPassword"), ""],
        t({
          id: "w77E3xmgKikt3FFDFqNAq5-changePasswordPopup",
          message: "Passwords must match",
        }),
      ),
  });

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      if (type !== "phone" && type !== "email") {
        return;
      }

      setIsLoading(true);

      try {
        await authService.changePassword(type, {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        });

        formikHelpers.resetForm();
        handleClose();
        setSuccessOpen(true);
      } catch {
        formikHelpers.setFieldError(
          "oldPassword",
          t({
            id: "2ZMjTMo2Pj2kQvHFmbbjiB-changePasswordPopup",
            message: "Incorrect password",
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [type, handleClose, setSuccessOpen],
  );

  const formik: FormikProps<FormFields> = useFormik<FormFields>({
    initialValues,
    validationSchema,
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
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              <Trans id="tgwT2YnvDfTfjg7VmijSHc-changePasswordPopup">
                Change Password
              </Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box
              className="content"
              component="form"
              onSubmit={formik.handleSubmit}
            >
              <Box mb={3.5} position="relative" className="c-full-width">
                <Input
                  className={classNames("c-full-width", "input")}
                  placeholder={t({
                    id: "5ioRkukqV7wz4AxUWH4o8S-changePasswordPopup",
                    message: "Current password",
                  })}
                  name="oldPassword"
                  type="password"
                  value={formik.values.oldPassword}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("oldPassword").error}
                  errortext={getError("oldPassword").errorText}
                  classnames={{ error: "error" }}
                />
              </Box>

              <Box mb={3.5} position="relative" className="c-full-width">
                <Input
                  className={classNames("c-full-width", "input")}
                  placeholder={t({
                    id: "k1z4qm45es16g3UGy6dNjV-changePasswordPopup",
                    message: "New password",
                  })}
                  name="newPassword"
                  type="password"
                  value={formik.values.newPassword}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("newPassword").error}
                  errortext={getError("newPassword").errorText}
                  classnames={{ error: "error" }}
                />
              </Box>

              <Box mb={3.5} position="relative" className="c-full-width">
                <Input
                  className={classNames("c-full-width", "input")}
                  placeholder={t({
                    id: "6CpDPpTU5WxAvuaWHYjuFa-changePasswordPopup",
                    message: "Confirm new password",
                  })}
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onBlur={onBlur}
                  onChange={formik.handleChange}
                  error={getError("confirmPassword").error}
                  errortext={getError("confirmPassword").errorText}
                  classnames={{ error: "error" }}
                />
              </Box>

              <Button
                disabled={Boolean(
                  formik.errors.oldPassword ||
                    !formik.values.oldPassword ||
                    formik.errors.newPassword ||
                    !formik.values.newPassword ||
                    formik.errors.confirmPassword ||
                    !formik.values.confirmPassword ||
                    isLoading,
                )}
                loading={isLoading}
                style="primary"
                type="submit"
                className="c-full-width"
              >
                <Trans id="64HJeMTCVfEvqdkha6Qujp-changePasswordPopup">
                  Change password
                </Trans>
              </Button>

              <Box
                component="button"
                onClick={() => {
                  push("/reset-password?change=true");
                  handleClose();
                }}
                className="c-font-16-22 resetPassBtn"
              >
                <Trans id="1vVcs2BPuqxKpzQD6euJMS-changePasswordPopup">
                  Forgot password?
                </Trans>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default ChangePasswordPopup;
