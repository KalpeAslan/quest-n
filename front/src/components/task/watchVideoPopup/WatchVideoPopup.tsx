import { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";

import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { Modal } from "@components/UI/modal";
import { VideoQuest } from "@components/videoQuest";

import { ILoyaltyTask, ETaskStatus } from "@models";

import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { Wrapper } from "./watchVideoPopup.styles";

interface PopupProps {
  isPopupOpened: boolean;
  watchVideoTask: ILoyaltyTask | null;
  isLoaded: boolean;
  setIsPopupOpened: React.Dispatch<React.SetStateAction<boolean>>;
  confirmFlow: () => Promise<void>;
  title?: string;
}

const enum ETasks {
  YOUTUBE = "youtube",
  REWARD_SIGN_UP = "reward sign up",
}

const WatchVideoPopup: FC<PopupProps> = ({
  isPopupOpened,
  watchVideoTask,
  isLoaded,
  setIsPopupOpened,
  confirmFlow,
  title,
}) => {
  const [currentTask, setCurrentTask] = useState<ETasks | null>(null);

  const accountInfo = useTypedSelector(getAccountInfo);

  useEffect(() => {
    if (
      isLoaded &&
      accountInfo?.connected &&
      watchVideoTask?.status === ETaskStatus.DONE
    ) {
      setIsPopupOpened(false);
    }

    if (
      isLoaded &&
      accountInfo?.connected &&
      watchVideoTask?.status === ETaskStatus.ACTIVE
    ) {
      setCurrentTask(ETasks.YOUTUBE);

      return;
    }
  }, [accountInfo, watchVideoTask, isLoaded]);

  return (
    <Modal
      isOpen={isPopupOpened}
      closeByOutsideClick={false}
      handleClose={() => setIsPopupOpened(false)}
    >
      <Wrapper>
        <div className="header">
          {title && (
            <Box
              className={classnames(
                "title",
                "c-font-24-26 c-fw-500 c-font-color",
              )}
              component="p"
            >
              {title}
            </Box>
          )}

          <Button
            className={classnames("close", "c-font-color")}
            style="icon"
            type="button"
            onClick={() => setIsPopupOpened(false)}
            disableTouchStart
          >
            <Icon name="menu-close" size="24" />
          </Button>
        </div>

        <div className="content">
          {currentTask === ETasks.YOUTUBE &&
            watchVideoTask?.points &&
            watchVideoTask?.id && (
              <VideoQuest
                data={watchVideoTask}
                outLoaded={isLoaded}
                completeFunction={confirmFlow}
              />
            )}
        </div>
      </Wrapper>
    </Modal>
  );
};

export default WatchVideoPopup;
