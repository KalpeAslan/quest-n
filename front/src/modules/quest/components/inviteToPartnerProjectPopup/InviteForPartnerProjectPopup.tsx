import { BaseInvitePartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/BaseInvitePartnerProjectPopup";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "@components/UI/input/Input";
import { adminProjectService } from "@api";
import { LoggerService } from "@services";
import { InviteToPartnerProjectPopupStyles } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteToPartnerProjectPopup.styles";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  projectLink?: string;
  onSubmit: () => Promise<void>;
}

enum EStep {
  SendEmail,
  ShowSuccessMessage,
}

export const InviteForPartnerProjectPopup = ({
  isOpen,
  onClose: onCloseProp,
  projectLink,
  onSubmit,
}: IProps) => {
  const [step, setStep] = useState(EStep.SendEmail);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setStep(EStep.SendEmail);
    onCloseProp();
  };

  const { values, errors, handleSubmit, handleChange, touched } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(),
    }),
    onSubmit: async values => {
      try {
        setIsLoading(true);
        await adminProjectService.inviteForPartnerProject(projectLink, values);
        await onSubmit();
        setStep(EStep.ShowSuccessMessage);
      } catch (e) {
        LoggerService.error(`Error in AcceptFromPartnerProjectPopup`, e);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const renderSteps = () => {
    if (step === EStep.SendEmail) {
      return (
        <>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            gap={3}
          >
            <Box>
              <p
                className={
                  "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
                }
              >
                <Trans id={"dsdk43tjknbjnvdf-3njksv-jsn"}>
                  The user will receive an invitation via email.
                </Trans>
              </p>
              <p
                className={
                  "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
                }
              >
                <Trans id={"sdc-xdsdkjnvdf-3njk056jnbjksv-jsn"}>
                  By clicking on the link in the letter, he will be able to
                  manage your quests.
                </Trans>
              </p>
            </Box>
            <Box width={"100%"}>
              <label
                className={"c-font-color c-font-16-22 c-fw-500"}
                htmlFor="email"
              >
                E-mail
              </label>
              <Input
                name={"email"}
                type={"email"}
                style={{ width: "100%" }}
                className={"email"}
                value={values.email}
                error={!!(touched.email && errors.email)}
                errortext={touched.email && errors.email}
                onChange={handleChange}
                placeholder={t({
                  message: "Enter email",
                  id: "12xdsdkjnvdfsdf0b5jn-3njksv-jsn",
                })}
              />
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"20px"}
              sx={{
                button: {
                  flex: 1,
                },
              }}
              width={"100%"}
            >
              <Button onClick={onClose} style={"secondary"}>
                <Trans id={"sdlk-42ldfnj-cancel"}>Cancel</Trans>
              </Button>
              <Button
                loading={isLoading}
                onClick={handleSubmit}
                style={"primary"}
              >
                <Trans id={"dfj-32jsdv-dsnbm2-Invite-User"}>Invite User</Trans>
              </Button>
            </Box>
          </Box>
          <Box
            className={"c-font-color c-font-14-16 c-fw-400"}
            component={"p"}
            mt={2}
            sx={{ opacity: 0.5 }}
          >
            <Trans id={"lvjnk24-gedflnb12-dlfnkfjdb"}>
              Be careful. Do not give access to managing your quests to unknown
              users.
            </Trans>
          </Box>
        </>
      );
    }
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box>
          <InviteToPartnerProjectPopupStyles.AddUser />
        </Box>
        <Box
          my={3}
          component={"p"}
          className={"c-font-color c-fw-400 c-font-16-18"}
        >
          {t({
            message: "You can revoke a user's access at any time.",
            id: "5i40trbgf-fgblkn-dfblknlnlf-b",
          })}
        </Box>
        <Button onClick={onClose} style={"colorfull"}>
          <Trans id={"sldkng4-rlkngf6d4fb945bd-fbdfb"}>Continue</Trans>
        </Button>
      </Box>
    );
  };

  return (
    <BaseInvitePartnerProjectPopup
      title={
        step === EStep.SendEmail
          ? t({
              message: "Invite a user to manage quests",
              id: "23fedsf-wdjnvf-inviteUserToManageQuests",
            })
          : t({
              message: "Invitation sent",
              id: "vlkdfn-4lrnfb-fblkn23-d",
            })
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>{renderSteps()}</Box>
      {/*<Box*/}
      {/*  display={"flex"}*/}
      {/*  gap={"20px"}*/}
      {/*  flexDirection={"column"}*/}
      {/*  alignItems={"center"}*/}
      {/*>*/}
      {/*  <Box*/}
      {/*    display={"flex"}*/}
      {/*    alignItems={"center"}*/}
      {/*    gap={"20px"}*/}
      {/*    justifyContent={"center"}*/}
      {/*  >*/}
      {/*    <Button style={"error"}>*/}
      {/*      <Trans id={"ddvfjbkj340dfvjkb12-fkdjvb"}>Decline</Trans>*/}
      {/*    </Button>*/}
      {/*    <Button style={"error"}>*/}
      {/*      <Trans id={"ksdb34-fdbjkn2-vdfkj"}>Accept</Trans>*/}
      {/*    </Button>*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </BaseInvitePartnerProjectPopup>
  );
};
