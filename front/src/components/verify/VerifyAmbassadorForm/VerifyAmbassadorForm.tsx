import { VerifyAmbassadorFormStylesForm } from "@components/verify/VerifyAmbassadorForm/VerifyAmbassadorForm.styles";
import Selector from "@components/UI/selector/Selector";
import { useFormik } from "formik";
import * as yup from "yup";
import { t, Trans } from "@lingui/macro";
import Input from "@components/UI/input/Input";
import Button from "@components/UI/button/Button";
import { Box } from "@mui/material";
import { FC, useState } from "react";
import { ambassadorService } from "@api";
import Modal from "../../UI/modal/Modal";
import Icon from "../../UI/icon/Icon";
import { CBreakpoints } from "../../../styles/variables";

enum VerifyResult {
  Success = "Success",
  NotFound = "NotFound",
}

export const VerifyAmbassadorForm: FC = () => {
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

  const computeTitle = () => {
    if (verifyResult === VerifyResult.Success) {
      const titles = {
        twitter: "Official Twitter",
        telegram: "Official Telegram",
      };
      return titles[values.method];
    }
    const titles = {
      twitter: "Unofficial Twitter",
      telegram: "Unofficial Telegram",
    };
    return titles[values.method];
  };

  const { setFieldValue, values, errors, handleSubmit, handleChange, touched } =
    useFormik({
      initialValues: {
        method: options[0].value,
        contact: "",
      },
      validationSchema,
      onSubmit({ contact, method }) {
        ambassadorService
          .findAmbassadorByContact(contact, method)
          .then((res: any) => {
            if (res && res.ambassador) {
              setVerifyResult(VerifyResult.Success);
            }
          })
          .catch(() => {
            setVerifyResult(VerifyResult.NotFound);
          });
      },
    });

  return (
    <VerifyAmbassadorFormStylesForm
      className={"VerifyAmbassadorForm"}
      onSubmit={handleSubmit}
    >
      <Box className={"input-wrapper"}>
        <Box className={"method"}>
          <Box
            whiteSpace={"nowrap"}
            component={"p"}
            mb={1}
            className={"c-font-16-22"}
          >
            <Trans id={"dsvjs-qjfb0niq-qegfbvfdhvb-quest"}>
              Verification Type
            </Trans>
          </Box>
          <Selector
            options={options}
            className={"selector"}
            onSelect={value => setFieldValue("method", value)}
            value={values.method}
          />
          {touched.method && errors.method && (
            <p
              style={{ marginTop: 16 }}
              className={"c-font-16-22 c-font-color-4"}
            >
              {errors.method}
            </p>
          )}
        </Box>
        <Box className={"username"}>
          <Box mb={1} className={"c-font-16-22"}>
            <Trans id={"dfbcxnvjkdshf-qdsafsdk-fdbkj-quest"}>Username</Trans>
          </Box>
          <Input
            name={"contact"}
            className={"input"}
            placeholder={`${
              options.find(item => item.value === values.method).title
            } Username`}
            onChange={handleChange}
            errortext={errors.contact}
            error={!!(touched.contact && errors.contact)}
          />
        </Box>
      </Box>
      <Button className={"submit-button"} type={"submit"} style={"primary"}>
        <Trans id={"njvqsab-sdkbdopert-quest"}>Verify</Trans>
      </Button>
      <Modal
        isOpen={!!verifyResult}
        handleClose={() => setVerifyResult(null)}
        closeByOutsideClick
      >
        <Box
          width={"100%"}
          sx={theme => ({
            [".ambassador-verify-modal"]: {
              width: 450,
            },
            [theme.breakpoints.down(CBreakpoints.sm)]: {
              px: 3,
              [".ambassador-verify-modal"]: {
                width: "100%",
              },
            },
          })}
        >
          <Box
            borderRadius={"16px"}
            className={"ambassador-verify-modal"}
            bgcolor={"#101313"}
          >
            <Box
              position={"relative"}
              borderBottom={"1px solid rgba(255, 255, 255, 0.30)"}
              className={"c-flex c-flex-items-center items-justified-center"}
              p={2}
            >
              <p
                style={{ fontWeight: 500 }}
                className={"c-font-24-36 c-font-color"}
              >
                {computeTitle()}
              </p>
              <Box
                style={{ cursor: "pointer" }}
                position={"absolute"}
                top={14}
                right={24}
                color={"white"}
                onClick={() => setVerifyResult(null)}
              >
                <Icon name={"menu-close"} size={"24"} />
              </Box>
            </Box>

            <Box
              p={"20px 24px 30px 24px"}
              flexDirection={"column"}
              className={
                "c-flex c-flex-items-center items-justified-center c-font-color"
              }
            >
              {verifyResult === VerifyResult.Success && (
                <>
                  <img src="/images/verify/success.svg" alt="Success" />
                  <p
                    style={{ marginTop: 15, marginBottom: 30 }}
                    className={"c-font-16-24 t-align-center"}
                  >
                    {" "}
                    <Trans id={"sdjsjdf-qwiu-vnfdkjqdfn-24"}>
                      The details match our records. This is an authentic
                      AlphaGuilty Ambassador
                    </Trans>
                  </p>
                </>
              )}

              {verifyResult === VerifyResult.NotFound && (
                <>
                  <img src="/images/verify/not-found.svg" alt="NotFound" />
                  <p
                    style={{ marginTop: 15, marginBottom: 30 }}
                    className={"c-font-16-24 t-align-center"}
                  >
                    {" "}
                    <Trans id={"3s1djsjdf-qwiu-vnfdkjqdfn-24"}>
                      The details do not match our records. Be cautious and
                      avoid sharing any information
                    </Trans>
                  </p>
                </>
              )}
              <Button onClick={() => setVerifyResult(null)} style={"primary"}>
                Got It
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </VerifyAmbassadorFormStylesForm>
  );
};

const validationSchema = yup.object({
  method: yup.string().required(
    t({
      id: "jsdhfsdjksd-wesdfsufghvb-quest",
      message: "Please select a method of contact",
    }),
  ),
  contact: yup.string().required(
    t({
      id: "1j89sdhfsdjk-wesdfsufghvb-quest",
      message: "Please enter your contact details",
    }),
  ),
});

const options = [
  {
    value: "telegram",
    title: "Telegram",
    icon: "telegram",
  },
  {
    value: "twitter",
    title: "Twitter",
    icon: "twitter",
  },
  {
    value: "email",
    title: "Email",
    icon: "email",
  },
];
