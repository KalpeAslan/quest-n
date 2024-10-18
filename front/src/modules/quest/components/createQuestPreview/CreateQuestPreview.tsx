import { Box } from "@mui/material";
import { QuestComponent } from "../questComponent";
import { ILoyaltyProject } from "../../models";
import { FC, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setPreviewOpen,
  setPreviewPanel,
} from "@/store/slices/system/system.slice";

interface Props {
  currentQuest: ILoyaltyProject | null;
}

const CreateQuestPreview: FC<Props> = ({ currentQuest }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPreviewPanel({ open: true, onClick: "close" }));
    dispatch(setPreviewOpen(true));

    return () => {
      dispatch(setPreviewPanel({ open: false, onClick: "close" }));
      dispatch(setPreviewOpen(false));
    };
  }, [dispatch]);

  return (
    <Box zIndex="5" width="100%">
      <QuestComponent projectLinkTitle={currentQuest.linkTitle.toLowerCase()} preview fullPreview/>
    </Box>
  );
};

export default CreateQuestPreview;
