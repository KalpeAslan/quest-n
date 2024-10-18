import { useState, useMemo, useEffect } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import { LoggerService } from "@services";
import { accountService } from "@api";
import { ReferralWrapper } from "./referral.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setAccountInfo,
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setLocalReferralCode,
  setQuestReferralCode,
} from "@/modules/account/store/account.slice";
import { getAccountState } from "@modules/account/store/account.selector";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

interface FormFields {
  referralCode: string;
}

const Referral = () => {
  const dispatch = useAppDispatch();
  const { accountInfo, isReferralCodeLoading, localReferralCode } =
    useTypedSelector(getAccountState);

  const questReferralCode = useQuestReferralCode();

  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const initialValues: FormFields = {
    referralCode: "",
  };

  const validationSchema = yup.object({
    referralCode: yup
      .string()
      .trim()
      .required(
        t({
          id: "fuu8DknFSgv4Cb6yz1RERU-referral",
          message: "This field is required",
        }),
      ),
  });

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: sendForm,
  });

  function sendForm(values: FormFields) {
    if (values.referralCode === "") {
      return;
    }

    addReferralCode(values.referralCode);
  }

  const addReferralCode = async (code: string) => {
    if (!code || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      await accountService.postAddReferral({
        code,
      });

      dispatch(
        setAccountInfo({
          ...accountInfo,
          canBeReferral: false,
          referrerCode: {
            ...accountInfo.referrerCode,
            referrer_code: code,
          },
        }),
      );

      dispatch(
        setIsReferralPopupResultOpen({
          open: true,
          type: "success",
        }),
      );
    } catch (error: any) {
      const { response } = error;

      if (response.status === 400 && response.data.errorCode === 1010) {
        formik.setErrors({ referralCode: response.data.message });

        return;
      }

      if (response.status === 400 && response.data.errorCode === 1011) {
        formik.setErrors({ referralCode: response.data.message });

        return;
      }

      if (response.status === 400 && response.data.errorCode === 1012) {
        formik.setErrors({ referralCode: response.data.message });

        return;
      }

      if (response.status === 400 && response.data.errorCode === 1015) {
        formik.setErrors({ referralCode: response.data.message });

        return;
      }

      LoggerService.error("Error during adding referral code", error);
    } finally {
      setIsLoaded(true);
      dispatch(setIsReferralCodeLoading(false));
      dispatch(setLocalReferralCode(null));
      dispatch(setQuestReferralCode(null));
    }
  };

  const isDisabled = useMemo(() => {
    if (isReferralCodeLoading) {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    if (formik.errors.referralCode) {
      return true;
    }

    if (formik.values.referralCode === "") {
      return true;
    }

    return false;
  }, [isLoaded, isReferralCodeLoading, formik]);

  useEffect(() => {
    if (localReferralCode || questReferralCode) {
      addReferralCode(localReferralCode || questReferralCode);
    }
  }, [localReferralCode, questReferralCode]);

  return (
    <ReferralWrapper>
      <div className="content">
        <Box
          className="c-font-14-20 c-font-color"
          maxWidth={180}
          component="p"
          mb={3}
        >
          <Trans id="pWmwYFt4nMZLK2E91Zyjkp-account">
            Add your referral code and increase your income
          </Trans>
        </Box>

        <form
          className="form"
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Box mb={{ xs: 2, md: 3 }}>
            <Input
              style={{
                background: "var(--color-b0)",
                borderRadius: 10,
              }}
              className="c-full-width"
              placeholder={t({
                id: "pC57hkfkkT14Tu9B8DVWXW-account",
                message: "Referral code",
              })}
              name="referralCode"
              value={formik.values.referralCode}
              error={
                formik.touched.referralCode &&
                Boolean(formik.errors.referralCode)
              }
              errortext={formik.errors.referralCode}
              onChange={e => {
                formik.setTouched({ ...formik.touched, referralCode: true });
                formik.handleChange(e);
              }}
            />
          </Box>

          <Button
            className="butt"
            type="submit"
            style="colorfull"
            size="medium"
            loading={!isLoaded || isReferralCodeLoading}
            disabled={isDisabled}
          >
            <Trans id="sfEcakkXqvwfrUsfCR6RVUbB9-account">
              Add Referral code
            </Trans>
          </Button>
        </form>
      </div>
    </ReferralWrapper>
  );
};

export default Referral;
