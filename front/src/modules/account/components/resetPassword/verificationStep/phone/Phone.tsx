import { Button } from "@/components/UI/button";
import { PhoneInput } from "@/components/UI/phoneInput";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import classNames from "classnames";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { FC, FocusEvent, useCallback } from "react";
import { object, string } from "yup";
import { Form } from "../verificationStep.styles";

interface Props {
  onFormSubmit: (data: { phone: string }) => Promise<void>;
}

interface FormFields {
  phone: string;
}

const initialValues: FormFields = {
  phone: "",
};

const Phone: FC<Props> = ({ onFormSubmit }) => {
  const schema = object({
    phone: string().required(
      t({ id: "qSdAXFy4RYGAXU3RzvAm7J-account", message: "Phone is required" }),
    ),
  });

  const onSubmit = useCallback(
    async (data: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
      try {
        await onFormSubmit({ phone: data.phone });
      } catch (error) {
        formikHelpers.setErrors({
          phone: t({
            id: "6NVNV7XoFvQXcJTpzWFJbf-account",
            message: "Invalid phone",
          }),
        });
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
        <PhoneInput
          className={classNames("c-full-width", "input")}
          placeholder={t({
            id: "3eRnL5Xt6BV2BxoyZqtCyE-account",
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

      <Button className="c-full-width" type="submit" style="primary">
        <div>
          <Trans id="sX46gnZke3BKGC2cSMjqxb-account">Get recovery code</Trans>
        </div>
      </Button>
    </Form>
  );
};

export default Phone;
