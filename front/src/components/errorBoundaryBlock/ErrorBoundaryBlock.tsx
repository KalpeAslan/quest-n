import classnames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Wrapper } from "./errorBoundaryBlock.styles";
import { useRouter } from "next/router";

interface ErrorBoundaryBlockProps {
  className?: string;
  errorText?: string;
}

const ErrorBoundaryBlock = ({
  className,
  errorText,
}: ErrorBoundaryBlockProps) => {
  const router = useRouter();

  const reloadPage = () => {
    router.reload();
  };

  return (
    <Wrapper className={classnames("background-other", className)}>
      <Box component="p" className="c-font-color" mb={2}>
        <Trans id="8syaqfBkwA6xbp2mQykfBo-errorBoundaryBlock">
          An unexpected error has occurred.
        </Trans>
      </Box>

      <Button
        className="button"
        type="button"
        style="colorfull"
        onClick={reloadPage}
      >
        <div>
          <Trans id="5XzQ5PT3Dg5iSL2gM6CUy7-errorBoundaryBlock">
            Reload the page
          </Trans>
        </div>
      </Button>

      <Box
        component="p"
        className="c-font-color"
        mt={4}
        sx={{ fontSize: "12px" }}
      >
        <Trans id="qTL2ZrJWJv5uk8GgfQBbnx-errorBoundaryBlock">
          Details: {errorText || "unknown"}
        </Trans>
      </Box>
      <Box
        component="p"
        className="c-font-color"
        mt={2}
        sx={{ fontSize: "12px" }}
      >
        <Trans id="usdYUpXZ4phtZSMV88qhjL-errorBoundaryBlock">
          Time: {new Date().toISOString()}
        </Trans>
      </Box>
    </Wrapper>
  );
};

export default ErrorBoundaryBlock;
