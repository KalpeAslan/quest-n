import { Box } from "@mui/material";
import { Wrapper } from "./taskCard.styles";
import { Icon } from "@/components/UI/icon";
import { FC } from "react";
import { ELoyaltyTasks } from "@/models";
import { icons } from "@/modules/quest/models/constants";
import { Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";

interface Props {
  title: string;
  description: string;
  socialAlgorithm?: boolean;
  type: ELoyaltyTasks;
  onEdit: () => void;
  onDelete: () => void;
  isDraft?: boolean;
}

const TaskCard: FC<Props> = ({
  title,
  type,
  onEdit,
  socialAlgorithm,
  onDelete,
  isDraft,
}) => {
  return (
    <Wrapper className="c-full-width">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          button: {
            paddingBottom: "5px",
          },
        }}
      >
        <Box
          component="h2"
          className="c-font-20-24 c-fw-500"
          display="flex"
          alignItems="center"
          mb={0.5}
        >
          <Box className="iconWrapper">
            <Icon name={icons[type]} />
          </Box>
          {title}
        </Box>

        <Box display={"flex"} gap={"10px"} position={"relative"}>
          <Button
            onClick={onEdit}
            size={"extraSmall"}
            type={"button"}
            style={"task"}
          >
            <Icon name={"pencil"} size={"14"} />
          </Button>

          <Button
            onClick={onDelete}
            size={"extraSmall"}
            type={"button"}
            style={"task"}
            disabled={!isDraft}
          >
            <Icon name={"menu-close"} size={"14"} color={"var(--color-o3)"} />
          </Button>
        </Box>
      </Box>

      {socialAlgorithm && (
        <Box
          component="ul"
          color="rgba(255, 255, 255, 0.5)"
          className="c-font-12-16"
          pl={2}
          m={0}
        >
          <Box component="li">
            <Trans id="gG7wG9iYzSRdr9k341N4G1-quest">
              Using Social Power Score Algorithm
            </Trans>
          </Box>
        </Box>
      )}
    </Wrapper>
  );
};

export default TaskCard;
