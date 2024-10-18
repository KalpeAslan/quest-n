import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { FC, FocusEvent, useCallback } from "react";
import { object, string } from "yup";
import { Form } from "../verificationStep.styles";

interface Props {
  onFormSubmit: (data: { email: string }) => Promise<void>;
}

interface FormFields {
  email: string;
}

const initialValues: FormFields = {
  email: "",
};

const Email: FC<Props> = ({ onFormSubmit }) => {
  const schema = object({
    email: string()
      .email(
        t({
          id: "7Kz7jbf7WkLsYoqNCXiy5R-account",
          message: "Please enter a valid email",
        }),
      )
      .required(
        t({
          id: "g2m3HR8Gb2nmKpdqm9mDqT-account",
          message: "Email is required",
        }),
      ),
  });

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      try {
        await onFormSubmit({ email: data.email });
      } catch (error) {
        formikHelpers.setErrors({ email: "Invalid email" });
      }
    },
    [onFormSubmit],
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
      className="c-full-width"
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        formik.handleSubmit();
      }}
    >
      <Box mb={{ xs: 3, md: 3 }}>
        <Input
          className={classNames("c-full-width", "input")}
          placeholder={t({
            id: "2611WWGLT4UPSFsncp2UaT-account",
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

      <Button className="c-full-width" type="submit" style="primary">
        <div>
          <Trans id="isxKGDM4GNazMYC5hnyDDN-account">Send</Trans>
        </div>
      </Button>
    </Form>
  );
};

export default Email;
