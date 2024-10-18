import { useMemo } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { FormWrapper } from "./initStep.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

interface FormFields {
  username: string;
}

type Props = {
  isLoaded: boolean;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"init" | "code" | "confirm">
  >;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const InitStep = ({ isLoaded, setCurrentStep, setIsPopupOpen }: Props) => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const handleSubmit = (values: FormFields) => {
    if (accountInfo?.username !== values.username) {
      return;
    }

    if (accountInfo.security?.twoFactorAuth) {
      setCurrentStep("code");

      return;
    }

    setIsPopupOpen(true);
  };

  const initialValues: FormFields = {
    username: "",
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .trim()
      .required(
        t({
          id: "1jKpaDeWzqjMwQbuMRFr3Y-account",
          message: "This field is required",
        }),
      ),
  });

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const isDisabled = useMemo(() => {
    if (formik.errors.username) {
      return true;
    }

    if (formik.values.username === "") {
      return true;
    }

    if (formik.values.username !== accountInfo?.username) {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [formik, isLoaded, accountInfo]);

  return (
    <>
      <Box
        className="c-font-20-24 c-fw-500 c-font-color"
        component="p"
        mb={0.5}
      >
        <Trans id="faseNinTAm6mDj5DGWxvN3-account">Delete your account</Trans>
      </Box>

      <Box className="c-font-14-20 c-font-color" component="p" mb={3}>
        <Trans id="cYiTv4guftQeXH3bdZwDjS-account">
          Enter your details to delete your account
        </Trans>
      </Box>

      <FormWrapper
        autoComplete="off"
        onSubmit={(e: any) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <Box mb={{ xs: 2, md: formik.errors.username ? 2 : 3 }}>
          <Input
            className="c-full-width"
            placeholder={t({
              id: "s4qSYziUnp26caeF8M7acm-account",
              message: "Username",
            })}
            name="username"
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            errortext={formik.errors.username}
            onChange={e => {
              formik.setTouched({ ...formik.touched, username: true });
              formik.handleChange(e);
            }}
          />
        </Box>

        <Button
          className="butt"
          type="submit"
          style="error"
          loading={!isLoaded}
          disabled={isDisabled}
          onClick={formik.handleSubmit}
        >
          <Trans id="usqDLjZaePK5MfFbjzyepG-account">Delete</Trans>
        </Button>
      </FormWrapper>
    </>
  );
};

export default InitStep;
