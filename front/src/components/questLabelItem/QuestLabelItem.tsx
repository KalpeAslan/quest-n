import { Box } from "@mui/material";
import { FC, useMemo } from "react";
import { Wrapper } from "./questLabelItem.styles";
import { LoyaltyProjectStatuses } from "@/modules/quest/models";
import classNames from "classnames";
import { appConfig } from "@/app.config";
import Image from "next/image";

interface IProps {
  title: string | number;
  status?: LoyaltyProjectStatuses;
  image?: string;
  subTitle?: string;
  disabled?: boolean;
  isPreview?: boolean;
}

const QuestLabelItem: FC<IProps> = ({
  title,
  image,
  subTitle,
  status,
  disabled,
  isPreview,
}) => {
  const imageUrl = useMemo(() => {
    if (image) {
      return `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${image}`;
    }

    return null;
  }, [image]);

  return (
    <Wrapper
      disabled={disabled}
      className={classNames({
        expired: status === LoyaltyProjectStatuses.Expired.toLowerCase(),
      })}
    >
      <Box
        style={{ color: isPreview ? "var(--text-color-1)" : "" }}
        className="c-font-20-24 c-fw-500"
        component="p"
      >
        {title}
      </Box>

      <div className="footer">
        {imageUrl && (
          <Box className="image" mr={0.5}>
            <Image src={imageUrl} fill alt={subTitle ? subTitle : ""} />
          </Box>
        )}

        {subTitle && (
          <p className="c-font-12-16 c-font-color-11 c-text-center">
            {subTitle}
          </p>
        )}
      </div>
    </Wrapper>
  );
};

export default QuestLabelItem;
