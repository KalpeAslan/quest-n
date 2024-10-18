import { useState, useMemo, useEffect, FC } from "react";
import { FormikProps, useFormik } from "formik";
import { Box } from "@mui/material";
import * as yup from "yup";
import { t, Trans } from "@lingui/macro";

import { Input } from "@components/UI/input";
import { Button } from "@components/UI/button";
import { LoggerService } from "@services";
import { accountService } from "@api";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setAccountInfo } from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { CBreakpoints } from "@styles/variables";
import Icon from "../../../../../../../../components/UI/icon/Icon";
import Modal from "../../../../../../../../components/UI/modal/Modal";

interface FormFields {
  username: string;
}

interface IProps {
  onClose: () => void;
  open: boolean;
}

const Username: FC<IProps> = ({ onClose, open }) => {
  const dispatch = useAppDispatch();
  const accountInfo = useTypedSelector(getAccountInfo);

  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const initialValues: FormFields = {
    username: accountInfo?.username || "",
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .trim()
      .max(
        24,
        t({
          id: "pB4tAcCz2LBHjKUsD7pAqC-username",
          message: "Must contain no more than 24 characters",
        }),
      )
      .required(
        t({
          id: "dasSf1QReVdpWZWB5rzDMW-username",
          message: "This field is required",
        }),
      )
      .matches(
        /^(?!.*[ ]{2,})([a-zA-Z0-9 ._-]*)$/,
        t({
          id: "cpoBBvAk7C9Tja1eXoMnH1-username",
          message:
            "Must contain only letters, numbers, dash, dot, space and underscore",
        }),
      ),
  });

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: sendForm,
  });

  const handleError = (error: any) => {
    const { response } = error;

    if (response.status === 400 && response.data.errorCode === 1000) {
      formik.setErrors({
        username: t({
          id: "2bcfWF8zYCKS1muxBu3cUM-username",
          message: "This username is already taken. Please try another!",
        }),
      });

      return;
    }

    LoggerService.error("Error during update user info", error);
  };

  const isDisabled = useMemo(() => {
    if (formik.errors.username) {
      return true;
    }

    if (formik.values.username === "") {
      return true;
    }

    if (formik.values.username === accountInfo?.username) {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [formik, isLoaded, accountInfo]);

  async function sendForm(values: FormFields) {
    if (values.username === "" || !accountInfo) {
      return;
    }

    setIsLoaded(false);

    try {
      await accountService.putInvestor({
        username: values.username.trim(),
      });

      dispatch(
        setAccountInfo({
          ...accountInfo,
          username: values.username.trim(),
        }),
      );
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    if (accountInfo.username) {
      formik.setFieldValue("username", accountInfo.username);
    }
  }, [accountInfo]);

  return (
    <Modal closeByOutsideClick isOpen={open} handleClose={onClose}>
      <Box
        sx={theme => ({
          width: 400,
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            px: 3,
            width: "100%",
          },
        })}
      >
        <Box
          borderRadius={2}
          px={3}
          pt={2}
          pb={4}
          bgcolor={"var(--color-b0)"}
          position={"relative"}
        >
          <Box className={"c-font-color"}>
            <Box className={"c-font-20-24 c-font-color"} component={"p"}>
              <Trans id={"erygjnbv-weruigb-3248ykbdg"}>Change Nickname</Trans>
            </Box>
            <Box onClick={onClose} position={"absolute"} right={16} top={16}>
              <Icon name={"menu-close"} size={"24"} />
            </Box>
          </Box>
          <Box mt={"20px"}>
            <form
              className="form"
              autoComplete="off"
              onSubmit={e => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <Box mb={{ xs: 2, md: formik.errors.username ? 2 : 3 }}>
                <label htmlFor={"nickname"} className={"c-font-color"}>
                  <Trans id={"hgjksnf-wlhwle-kjsbdv"}>Nickname</Trans>
                </label>
                <Input
                  className="c-full-width"
                  placeholder={t({
                    id: "ax59g4aBhe9eueo73WjNCx-account",
                    message: "Username",
                  })}
                  name="username"
                  value={formik.values.username}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  errortext={formik.errors.username}
                  onChange={e => {
                    formik.setTouched({ ...formik.touched, username: true });
                    formik.handleChange(e);
                  }}
                />
              </Box>

              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                gap={"20px"}
                sx={{
                  button: {
                    flex: 1,
                  },
                }}
              >
                <Button onClick={onClose} style={"error"}>
                  <Trans id={"sdkjghk-3hbsv-23r"}>Cancel</Trans>
                </Button>
                <Button
                  onClick={formik.handleSubmit}
                  disabled={isDisabled}
                  style={"primary"}
                >
                  <Trans id={"sljdhjk-wlhgkjw-34oihr"}>Save</Trans>
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Username;
