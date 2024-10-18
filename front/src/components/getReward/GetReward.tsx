import { FC, useRef, useState } from "react";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";

import {
  ContWrapper,
  FooterWrapper,
  SocWrapper,
  WdDecor,
} from "./getReward.styles";
import { LoggerService } from "@/services";
import { loyaltyService } from "@/api";
import ReCAPTCHA from "react-google-recaptcha";
import { appConfig } from "@/app.config";

interface GetRewardProps {
  className?: string;
  preHead?: string;
  points: number;
  taskId: number;
  preTitle?: string;
  preTitleDesc?: string;
  title?: string;
  description?: string | null | undefined;
  isDecor?: boolean;
  buttonText: string | null | undefined;
  outLoaded?: boolean;
  cb?: () => void;
  completeFunction?: () => void;
}

const GetReward: FC<GetRewardProps> = ({
  className,
  preHead = "EARNED",
  points,
  taskId,
  preTitle = "",
  preTitleDesc = "",
  title = "",
  description = "",
  isDecor = false,
  buttonText,
  outLoaded = true,
  cb,
  completeFunction,
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>();

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const confirmFlow = async () => {
    try {
      setIsLoaded(false);

      const reCaptchaToken = await (recaptchaRef as any).current.executeAsync();

      (recaptchaRef as any).current.reset();

      const { data: socialData } =
        await loyaltyService.postLoyaltyTaskCompleted(taskId, {
          reCaptchaToken,
        });

      if (socialData.success.status && cb) {
        cb();
      }
    } catch (error: any) {
      LoggerService.error("Error during response", error);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <>
      {isDecor && <WdDecor />}

      {preTitle && (
        <ContWrapper
          className="c-font-20-24 c-fw-500 c-font-color"
          component="p"
          mb={1}
        >
          {preTitle}{" "}
          {preTitleDesc && (
            <span className="c-font-16-22 c-font-color">{preTitleDesc}</span>
          )}
        </ContWrapper>
      )}

      <SocWrapper mb={3} className={className}>
        <Icon className="icon" name="reward-decor" size="127" />

        <div>
          <Box className="c-font-13-17 c-font-color-3" component="p">
            {preHead}
          </Box>

          <Box className="c-font-44-56 c-font-color-3" component="p">
            {points}
          </Box>

          <Box className="c-font-13-17 c-font-color-3" component="p">
            <Trans id="bcwWzwEfcXQfyropFUGpUd-getReward">POINTS</Trans>
          </Box>
        </div>

        <div className="decor" />
      </SocWrapper>
      {title && (
        <ContWrapper
          className="c-font-20-24 c-fw-500 c-font-color"
          component="p"
          mb={1}
        >
          {title}
        </ContWrapper>
      )}

      {description && (
        <ContWrapper className="c-font-16-22 c-font-color" component="p" mb={3}>
          {description}
        </ContWrapper>
      )}

      <FooterWrapper>
        <Button
          className="butt"
          style="colorfull"
          size="medium"
          type="button"
          loading={!isLoaded || !outLoaded}
          onClick={() => {
            if (!completeFunction) {
              confirmFlow();

              return;
            }

            completeFunction();
          }}
        >
          <Box className="c-font-16-20 c-fw-500">
            {buttonText
              ? buttonText
              : t({
                  id: "w1FECzjWPB4GHZtbjqGwit-getReward",
                  message: "Complete",
                })}
          </Box>
        </Button>
      </FooterWrapper>

      {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
        />
      )}
    </>
  );
};

export default GetReward;
