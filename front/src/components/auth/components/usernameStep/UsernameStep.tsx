import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@/modules/account/store/account.selector";
import { HelperService, LocalStorageService, LoggerService } from "@/services";
import {
  FC,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount } from "wagmi";
import { Wrapper } from "./usernameStep.styled";
import { Box } from "@mui/material";
import { Icon } from "@/components/UI/icon";
import { TSocialAuthType } from "@/modules/account/models";
import { object, string } from "yup";
import { FormikHelpers, FormikProps, useFormik } from "formik";
import { accountService } from "@/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setAccountInfo } from "@/modules/account/store/account.slice";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { Trans, t } from "@lingui/macro";

interface Props {
  skip: () => Promise<void>;
  submitCallback?: () => Promise<void>;
  authType?: TSocialAuthType | "phone" | "email";
}

interface FormFields {
  username: string;
}

const initialValues: FormFields = {
  username: "",
};

const UsernameStep: FC<Props> = ({
  authType: propsAuthType,
  skip,
  submitCallback,
}) => {
  const validationSchema = object({
    username: string()
      .trim()
      .max(
        24,
        t({
          id: "fzMjqwELELVi5nKPeqPDEi-auth",
          message: "Must contain no more than 24 characters",
        }),
      )
      .required(
        t({
          id: "8PHkXRYVVTS1Z949LKrQDk-auth",
          message: "This field is required",
        }),
      )
      .matches(
        /^(?!.*[ ]{2,})([a-zA-Z0-9 ._-]*)$/,
        t({
          id: "bYn6ugjqwtYgLPWT7Jv9nN-auth",
          message:
            "Must contain only letters, numbers, dash, dot, space and underscore",
        }),
      ),
  });

  const [entryType, setEntryType] = useState<
    TSocialAuthType | "phone" | "email" | null
  >(null);
  const [entryUserName, setEntryUserName] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const { accountInfo } = useTypedSelector(getAccountState);

  const { connector, address } = useAccount();

  const handleError = useCallback(
    (error: any, formikHelpers: FormikHelpers<FormFields>) => {
      const { response } = error;

      if (response.status === 400 && response.data.errorCode === 1000) {
        formikHelpers.setFieldError(
          "username",
          t({
            id: "tCyWa9GAVuXRwSXTZnkdtm-auth",
            message: "This username is already taken. Please try another!",
          }),
        );

        return;
      }

      LoggerService.error("Error during update user info", error);
    },
    [],
  );

  const sendForm = useCallback(
    async (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => {
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

        submitCallback && (await submitCallback());
      } catch (error: any) {
        handleError(error, formikHelpers);
      } finally {
        setIsLoaded(true);
      }
    },
    [accountInfo, dispatch, handleError, submitCallback],
  );

  const formik: FormikProps<FormFields> = useFormik({
    initialValues,
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit: sendForm,
  });

  const getEntryType = useCallback(async () => {
    const authType = await LocalStorageService.getItemAsync("entryType");

    if (authType) {
      setEntryType(propsAuthType || (authType as TSocialAuthType));
      return;
    }

    setEntryType(propsAuthType || null);
  }, [accountInfo]);

  const getEntryUserName = useCallback(async () => {
    const userName = await LocalStorageService.getItemAsync("entryUN");

    if (userName) {
      setEntryUserName(userName);
      return;
    }

    setEntryUserName("");
  }, [accountInfo]);

  const walletLogo = useMemo(() => {
    if (connector?.name && connector.name === "MetaMask") {
      return "metamask-logo";
    }

    return "wallet-connect";
  }, [connector?.name]);

  const shortAddress = useMemo(() => {
    if (accountInfo?.wallet || address) {
      return HelperService.getShortAddress(
        accountInfo?.wallet || address,
        4,
      ).toLocaleLowerCase();
    }

    return "";
  }, [accountInfo?.wallet, address]);

  const title = useMemo(() => {
    if (entryType === "email")
      return t({
        id: "kmgQdrztiLhmok2rdViQ7w-auth",
        message: "Email verified, thanks for joining us",
      });
    if (entryType === "phone")
      return t({
        id: "mc4KsM71Yf5w86hEtPKLRP-auth",
        message: "Phone number verified, thanks for joining us",
      });

    return t({
      id: "cUNgkU4A2ZYNZ967WJT1r4-auth",
      message: "Thanks for joining us",
    });
  }, [entryType]);

  const signMethod = useMemo(() => {
    if (entryType === "google") return "Google";
    if (entryType === "twitter") return "Twitter";
    if (
      entryType === "wallet" &&
      connector?.name &&
      connector.name === "MetaMask"
    )
      return "MetaMask";

    return "WalletConnect";
  }, [connector?.name, entryType]);

  const isCreds = useMemo(
    () => ["email", "phone"].includes(entryType),
    [entryType],
  );

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

  useEffect(() => {
    getEntryType();
    getEntryUserName();
  }, [getEntryType, getEntryUserName]);

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      formik.setTouched({ ...formik.touched, [e.target.name]: true });
    },
    [formik],
  );

  return (
    <Wrapper entryType={entryType}>
      <Box className="iconWrapper">
        <Icon name="checkmark" size="40" />
      </Box>

      <Box
        component="h2"
        textAlign="center"
        mb={isCreds ? "30px" : "20px"}
        className="c-font-color c-font-32-38 c-fw-500"
      >
        {title}
      </Box>

      {!isCreds && (
        <Box>
          <Box
            component="h3"
            className="c-font-color c-font-20-24 c-fw-500"
            mb="20px"
          >
            <Trans id="m8yucPkQ1YCC4u4sTtibEK-auth">
              You signed up with {signMethod}
            </Trans>
          </Box>

          <Box className="userLabel">
            <Icon
              name={entryType === "wallet" ? walletLogo : entryType}
              size="20"
            />

            <Box
              component="span"
              className="c-font-color c-font-16-24 c-fw-400"
              ml="10px"
            >
              {entryType === "wallet" ? shortAddress : entryUserName}
            </Box>
          </Box>
        </Box>
      )}

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box
          component="p"
          className="c-font-color c-font-20-24 c-fw-500"
          mb="12px"
        >
          <Trans id="geDDsavfTjabVyYJbnHrge-auth">Create your nickname</Trans>
        </Box>

        <Input
          className="c-full-width input"
          placeholder={t({
            id: "oSu1Ea7t39393HBJaDC8Hn-auth",
            message: "Username",
          })}
          name="username"
          value={formik.values.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          errortext={formik.errors.username}
          onChange={formik.handleChange}
          onBlur={onBlur}
          classnames={{ error: "error" }}
        />

        <Box component="p" className="helper c-font-14-20 c-fw-400" mb="20px">
          <Trans id="n625HAYkVrZm9PWm7bQeyf-auth">
            You can create a nickname for yourself later.
          </Trans>
        </Box>

        <Button
          style="primary"
          type="submit"
          className="c-full-width submitBtn"
          loading={!isLoaded}
          disabled={isDisabled}
        >
          <Trans id="aSbzonDj8Ra2Xnd3aY2r7x-auth">Continue</Trans>
        </Button>

        <Button style="secondary" className="c-full-width" onClick={skip}>
          <Trans id="sB1SShgxst59VvjPMeCjxd-auth">Later</Trans>
        </Button>
      </Box>
    </Wrapper>
  );
};

export default UsernameStep;
