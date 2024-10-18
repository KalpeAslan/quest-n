import { FC, useState, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import YouTube from "react-youtube";
import { t, Trans } from "@lingui/macro";

import { LoggerService } from "@services";
import { Button } from "@components/UI/button";
import { Tooltip } from "@components/UI/tooltip";
import { ILoyaltyTask } from "@models";
import { loyaltyService } from "@api";
import { Wrapper } from "./videoQuest.styles";
import { extractVideoID } from "@/utils/react.utils";
import { appConfig } from "@/app.config";
import ReCAPTCHA from "react-google-recaptcha";

interface VideoQuestProps {
  data: ILoyaltyTask | null;
  title?: string;
  description?: string;
  outLoaded?: boolean;
  cb?: () => void;
  completeFunction?: () => void;
}

const options = {
  playerVars: {
    autoplay: 0,
    enablejsapi: 1,
    origin: typeof window !== "undefined" ? window.location.origin || "" : "",
    showinfo: 0,
    rel: 0,
  },
};

const VideoQuest: FC<VideoQuestProps> = ({
  data,
  title = "",
  description = "",
  outLoaded = true,
  cb,
  completeFunction,
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const recaptchaRef = useRef<ReCAPTCHA>();

  const disabled = useMemo(() => {
    if (isDisabled) {
      return true;
    }

    if (!isLoaded) {
      return true;
    }

    return false;
  }, [isDisabled]);

  const tooltipStatus = useMemo(() => {
    if (isDisabled) {
      return t({
        id: "cPHvHpk7Pf21XE4MkKZvED-videoQuest",
        message: "To continue - watch the video first",
      });
    }

    return "";
  }, [isDisabled]);

  const confirmFlow = async () => {
    if (!data?.id) {
      return;
    }

    try {
      setIsLoaded(false);

      const reCaptchaToken = await (recaptchaRef as any).current.executeAsync();

      (recaptchaRef as any).current.reset();

      const { data: socialData } =
        await loyaltyService.postLoyaltyTaskCompleted(data.id, {
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
    <Wrapper>
      {title && (
        <Box
          className={classnames(
            "title",
            "c-font-20-24 c-fw-500 c-text-center c-font-color",
          )}
          component="p"
          mb={{ xs: !description ? 3 : 1 }}
        >
          {title}
        </Box>
      )}

      {description && (
        <Box
          className={classnames(
            "title",
            "c-font-16-22 c-text-center c-font-color",
          )}
          component="p"
          mb={3}
        >
          {description}
        </Box>
      )}

      {data && data.body.videoId && (
        <YouTube
          videoId={extractVideoID(data.body.videoId)}
          className="iframe"
          opts={options}
          onEnd={() => setIsDisabled(false)}
        />
      )}

      <Box mt={3}>
        <Tooltip value={tooltipStatus} placement="top" followCursor>
          <section>
            <Button
              className="butt"
              style="colorfull"
              size="medium"
              type="button"
              loading={!isLoaded || !outLoaded}
              disabled={disabled}
              onClick={() => {
                if (!completeFunction) {
                  confirmFlow();

                  return;
                }

                completeFunction();
              }}
            >
              <Box className="c-font-16-20 c-fw-500">
                <Trans id="67MtcuZHcmdKK497oGsago-videoQuest">Complete</Trans>
              </Box>
            </Button>
          </section>
        </Tooltip>
      </Box>

      {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
        />
      )}
    </Wrapper>
  );
};

export default VideoQuest;
