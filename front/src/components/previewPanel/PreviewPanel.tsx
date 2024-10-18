import { Box } from "@mui/material";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { Wrapper } from "./previewPanel.styled";
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getPreviewPanel } from "@/store/slices/system/system.selector";
import { useCallback } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setPreviewOpen } from "@/store/slices/system/system.slice";
import { Trans } from "@lingui/macro";

const PreviewPanel = () => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();
  const { open, onClick, redirectPath } = useTypedSelector(getPreviewPanel);

  const onClose = useCallback(() => {
    if (onClick === "redirect" && redirectPath) {
      push(redirectPath);
      return;
    }
    dispatch(setPreviewOpen(false));
  }, [dispatch, onClick, push, redirectPath]);

  if (!open) return null;

  return (
    <Wrapper className="c-font-color">
      <Box className="rightWrapper">
        <Box mr={1.5} className="c-fw-500 c-font-16-22">
          <Trans id="wVPWQCQhF1mW8EMHW62gNi-previewPanel">
            Hide Fullscreen Preview
          </Trans>
        </Box>
        <Button style="secondary" className="previewButton" onClick={onClose}>
          <Icon name="menu-close" size="24" />
        </Button>
      </Box>
    </Wrapper>
  );
};

export default PreviewPanel;
