import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsCreateQuestPopupOpen } from "@/store/slices/system/system.selector";
import { setIsCreateQuestPopupOpen } from "@/store/slices/system/system.slice";
import { Box } from "@mui/material";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { Modal } from "../UI/modal";
import { Wrapper } from "./createQuestPopup.styles";
import createQuestImage from "@assets/images/quest/createQuest.webp";
import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { Trans } from "@lingui/macro";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";

const CreateQuestPopup = () => {
  const dispatch = useAppDispatch();

  const { replace, query } = useRouter();

  const isCreateQuestPopupOpen = useTypedSelector(getIsCreateQuestPopupOpen);

  const scheduleCall = () => {
    if (typeof window === "undefined") return;
    dispatch(sendAnalyticsDataThunk({ type: "schedule_call", options: {} }));
    window.open("https://calendly.com/catherine_m/30min", "_blank");
  };

  const handleClose = useCallback(() => {
    dispatch(setIsCreateQuestPopupOpen(false));
    const newQuery = { ...query };
    delete newQuery.cq_open;
    replace({ query: { ...newQuery } });
  }, [dispatch, query, replace]);

  return (
    <>
      {isCreateQuestPopupOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <header className="header">
              <Box
                component="h1"
                textAlign="center"
                className="title c-font-color c-font-20-24 c-md-font-24-24 c-fw-500"
              >
                <Trans id="u6MvmLXV5AhziwhdDA9YQT-createQuestPopup">
                  Create Quest
                </Trans>
              </Box>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={handleClose}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </header>

            <div className="content">
              <Box className="imageWrapper" mb={3}>
                <Image
                  alt="Create quest"
                  fill
                  style={{ objectFit: "cover" }}
                  src={createQuestImage.src}
                />
              </Box>

              <Box
                mb={3}
                textAlign="center"
                className="c-font-color c-font-16-22 c-md-font-20-24 c-fw-400"
              >
                <Trans id="hcEVZGpjFzzNMcG8WJdc5u-createQuestPopup">
                  We are currently working on this functionality. If you want to
                  create your quest setup call with our CBDO
                </Trans>
              </Box>

              <Button
                className="button"
                onClick={scheduleCall}
                style="colorfull"
              >
                <Trans id="aMjnXgp8VHdD4qZ9YKuQgW-createQuestPopup">
                  Schedule Call
                </Trans>
              </Button>
            </div>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default CreateQuestPopup;
