import { Box } from "@mui/material";
import Icon from "@components/UI/icon/Icon";
import Input from "@components/UI/input/Input";
import { useState } from "react";
import { t, Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import Link from "next/link";
import { authService, experienceService } from "@api";
import { HelperService, LocalStorageService, LoggerService } from "@services";
import { SuccessfulEntryResponse } from "@modules/account/models";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { PassReset } from "@components/auth/components/credentialsLogin/credentialsLogin.styles";
import { setIsRestrictionForCreationPopupOpen } from "@modules/account/store/account.slice";
interface IProps {
  email: string;
}

export const InviteToProjectLoginAccountEmailForm = ({ email }: IProps) => {
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: res } = await authService.loginWithInviteToPartnerProject({
        password,
        email,
      });

      LocalStorageService.setItem("entryUN", res.entryUsername);
      LocalStorageService.setItem("entryType", "email");
      if (!res.accessToken || !res.refreshToken) return;
      HelperService.setupAuthData(res as SuccessfulEntryResponse);
      dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(sendAnalyticsDataThunk({ type: "login_complete", options: {} }));
    } catch (e) {
      dispatch(
        setIsRestrictionForCreationPopupOpen({
          open: true,
          type: "login/email",
          username: "",
        }),
      );
    } finally {
      setIsLoading(false);
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
      <p className={"c-font-32-36 c-fw-500"}>Welcome</p>
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
            onChange={e => setPassword(e.target.value)}
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
            disabled={!password || isLoading}
            loading={isLoading}
            onClick={handleSubmit}
            style={"primary"}
          >
            {t({
              message: "Login",
              id: "dsknflwd-dsdf-sdfscs-445415-vsdknv=32nl",
            })}
          </Button>

          <Link style={{ textDecoration: "none" }} href={"/reset-password"}>
            <PassReset m="0 auto" sx={{ cursor: "pointer" }} component="p">
              <Trans id="1q6Pt2HDBKWSbmTYVgptds-auth">Forgot password?</Trans>
            </PassReset>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePassword(password) {
  return passwordRegex.test(password);
}
