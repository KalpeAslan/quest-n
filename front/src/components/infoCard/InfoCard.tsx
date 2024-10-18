import { Box } from "@mui/material";
import { Button } from "@components/UI/button";
import { Decor } from "@components/decor";
import { Icon } from "@components/UI/icon";

import {
  InfoCardStylesIcon,
  InfoCardStylesContent,
  InfoCardStylesWrapper,
} from "./infoCard.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getSystemState } from "@store/slices/system/system.selector";

type Props = {
  icon?: string;
  title: string;
  subTitle: string;
  subTitle2?: string;
  actionName: string;
  href?: string;
  loading?: boolean;
  onClick?: () => void;
};

const InfoCard = ({
  icon,
  title,
  subTitle,
  subTitle2,
  actionName,
  href,
  loading,
  onClick,
}: Props) => {
  const { theme } = useTypedSelector(getSystemState);

  return (
    <InfoCardStylesWrapper className={"c-wrap"}>
      <InfoCardStylesContent>
        {icon && (
          <InfoCardStylesIcon mb={4.8}>
            <Icon name={icon} size="24" />
          </InfoCardStylesIcon>
        )}

        <Box
          className="c-font-32-38 c-sm-font-48-56 c-font-color"
          component="h2"
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Box>

        <Box
          className="c-font-14-19 c-sm-font-20-28 c-font-color"
          component="p"
          mt={2}
        >
          {subTitle}
        </Box>

        <Box
          className="c-font-14-19 c-sm-font-20-28 c-font-color"
          component="p"
        >
          {subTitle2}
        </Box>

        {actionName && href && (
          <Box mt={5}>
            <Button
              style="primary"
              href={href}
              loading={loading}
              disabled={loading}
              target="_self"
            >
              {actionName}
            </Button>
          </Box>
        )}

        {actionName && onClick && (
          <Box mt={5}>
            <Button
              style="primary"
              loading={loading}
              disabled={loading}
              onClick={onClick}
            >
              {actionName}
            </Button>
          </Box>
        )}
      </InfoCardStylesContent>

      {theme === "dark" && <Decor icon />}
    </InfoCardStylesWrapper>
  );
};

export default InfoCard;
