/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { Button } from "@components/UI/button";
import { Link } from "@components/UI/link";

import {
  CookiePopupButton,
  CookiePopupContent,
  CookiePopupWrapper,
} from "./cookiePopup.styles";
import { LocalStorageService } from "@services";
import { useRouter } from "next/router";

const CookiePopup = () => {
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const { pathname } = useRouter();
  const handleAgree = () => {
    LocalStorageService.setItem("cookie-agree", "true");

    setIsAgree(false);
  };

  const getIsAgree = useCallback(async () => {
    setIsAgree(!(await LocalStorageService.getItemAsync("cookie-agree")));
  }, []);

  useEffect(() => {
    getIsAgree();
  }, [getIsAgree]);

  return (
    <>
      {isAgree && (
        <CookiePopupWrapper className={"slide-in-bottom"}>
          <CookiePopupContent>
            <Box className={"c-font-14-19"} component="p" mr={{ sm: 3 }} mt={2}>
              <Box className="c-font-color" component="span" mr={1}>
                <Trans id="8XDiMfefGhoLdtA2jhTCrQ-cookiePopup">
                  By using this website you agree with our
                </Trans>
              </Box>

              {pathname.includes("iframe") ? (
                <a
                  style={{ color: "var(--text-link-color)" }}
                  href={"/privacy-policy"}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Trans id="vCkZzowR9HW8WtsNDwcSMU-cookiePopup">
                    privacy policy
                  </Trans>
                </a>
              ) : (
                <Link underline="hover" to="/privacy-policy">
                  <Trans id="vCkZzowR9HW8WtsNDwcSMU-cookiePopup">
                    privacy policy
                  </Trans>
                </Link>
              )}
            </Box>

            <Box css={CookiePopupButton} mt={2}>
              <Button
                css={CookiePopupButton}
                style="primary"
                size="small"
                onClick={handleAgree}
                disableTouchStart
              >
                <Trans id="v7mTqw3zLFcdkboUTPL87H-cookiePopup">Agree</Trans>
              </Button>
            </Box>
          </CookiePopupContent>
        </CookiePopupWrapper>
      )}
    </>
  );
};

export default CookiePopup;
