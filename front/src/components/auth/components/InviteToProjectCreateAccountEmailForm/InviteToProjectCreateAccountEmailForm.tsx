import { Box } from "@mui/material";
import Icon from "@components/UI/icon/Icon";
import Input from "@components/UI/input/Input";
import { useState } from "react";
import { t, Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import Link from "next/link";
import { Policy } from "@components/auth/components/credentialsSignup/credentialSignup.styles";
import { authService, experienceService } from "@api";
import { HelperService, LocalStorageService, LoggerService } from "@services";
import { SuccessfulEntryResponse } from "@modules/account/models";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsRestrictionForCreationPopupOpen } from "@modules/account/store/account.slice";
interface IProps {
  email: string;
}

export const InviteToProjectCreateAccountEmailForm = ({ email }: IProps) => {
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      if (!validatePassword(password)) {
        setPasswordError(
          t({
            message:
              "Password must contain: at least 8 characters, at least one number, at least one capital letter",
            id: "Password must contain: at least 8 characters, at least one number, at least one capital letter",
          }),
        );
        return;
      } else {
        setPasswordError("");
      }
      setIsLoading(true);
      const { data: res } =
        await authService.registerWithInviteToPartnerProject({
          password,
          email,
          referralCode,
        });
      setIsLoading(false);

      LocalStorageService.setItem("entryUN", res.entryUsername);
      LocalStorageService.setItem("entryType", "email");
      if (!res.accessToken || !res.refreshToken) return;
      HelperService.setupAuthData(res as SuccessfulEntryResponse);
      dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(sendAnalyticsDataThunk({ type: "login_complete", options: {} }));
    } catch (error) {
      const response = error.response;

      if (
        response?.status === 409 ||
        response.data.message === "user already exist"
      ) {
        const { username } = response.data;
        dispatch(
          setIsRestrictionForCreationPopupOpen({
            open: true,
            type: "email",
            username: username,
          }),
        );
        return;
      }
    }
  };
  const verify = async () => {
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error("Error Auth => experienceService.verify", e);
    }
  };

  return (
    <Box maxWidth={328} width={"100%"} className={"c-font-color"}>
      <p className={"c-font-32-36 c-fw-500"}>Create Account</p>
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"100%"}
        gap={2}
        mt={3}
      >
        <Box width={"100%"}>
          <Box
            component={"p"}
            textAlign={"start"}
            className={"c-font-20-22 c-fw-500"}
          >
            {" "}
            Your E-mail
          </Box>
          <Box
            mt={1.5}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            border={"1px solid rgba(255, 255, 255, 0.10)"}
            py={1.5}
            borderRadius={"10px"}
          >
            <Icon name={"email"} size={"24"} />
            <p className={"c-font-16-22 c-fw-500"}>{email}</p>
          </Box>
        </Box>

        <Box>
          <Input
            className={""}
            placeholder={""}
            type={"password"}
            value={password}
            name={"password"}
            password
            error={!!passwordError}
            errortext={passwordError}
            onChange={e => setPassword(e.target.value)}
          />
          <Box
            textAlign={"start"}
            component={"p"}
            mt={1}
            className={"c-font-14-14 c-fw-400"}
          >
            Password must contain: at least 8 characters, at least one number,
            at least one capital letter
          </Box>
        </Box>

        <Box mt={1}>
          <Box
            textAlign={"start"}
            mb={1.5}
            className={"c-font-20-22 c-fw-400"}
            component={"p"}
          >
            {t({
              message: "Referral",
              id: "sldknv-23klnvfd-dbnl-Referral",
            })}
          </Box>
          <Input
            className={""}
            placeholder={t({
              message: "Add Referral Code",
              id: "sldnv-23lnf-bgfbnldb-2lknger-",
            })}
            type={"text"}
            value={referralCode}
            name={"referralCode"}
            onChange={e => setReferralCode(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            button: {
              width: "100%",
            },
          }}
          width={"100%"}
        >
          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={handleSubmit}
            style={"primary"}
          >
            {t({
              message: "Create",
              id: "dsknflwd-dscs-445415-vsdknv=32nl",
            })}
          </Button>

          <Policy
            className="c-font-14-20 c-font-color-2"
            component="p"
            mt={{ xs: 2, md: 3 }}
            mb={{ xs: 2, md: 3 }}
          >
            <Trans id="v8iU3APZaHrhJMGb734ito-auth">
              By creating account i agree with{" "}
              <Link href="/privacy-policy" className="c-font-color-2">
                Privacy policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-and-condition" className="c-font-color-2">
                Terms of service
              </Link>
            </Trans>
          </Policy>
        </Box>
      </Box>
    </Box>
  );
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePassword(password) {
  return passwordRegex.test(password);
}
