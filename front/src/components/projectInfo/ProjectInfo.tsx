import { FC, MouseEvent, memo, useCallback } from "react";
import classnames from "classnames";

import { Image } from "@components/UI/image";
import { Icon } from "@components/UI/icon";

import { Wrapper } from "./projectInfo.styles";
import { useRouter } from "next/router";
import { appConfig } from "@/app.config";
import { Box } from "@mui/material";

interface ProjectInfoProps {
  image?: string | null;
  imageSize?: string;
  iconSize?: string;
  approved: boolean;
  title: string;
  subTitle?: string;
  type?: "primary" | "secondary";
  slider?: boolean;
  linkTitle: string;
  maxWidth?: number;
}

const ProjectInfo: FC<ProjectInfoProps> = ({
  image = null,
  imageSize = "36",
  iconSize = "12",
  approved,
  title,
  subTitle = undefined,
  type = "primary",
  slider,
  linkTitle,
  maxWidth,
}) => {
  const { push } = useRouter();

  const goToProjectPage = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      push(`/partners/${linkTitle}`);
    },
    [linkTitle, push],
  );

  return (
    <Wrapper>
      <div
        className="image-wrapper"
        style={{
          width: `${imageSize}px`,
          minWidth: `${imageSize}px`,
          height: `${imageSize}px`,
        }}
        id="partnerImage"
        onClick={goToProjectPage}
      >
        <div
          className="image"
          id="partnerImage"
          style={{
            width: `${imageSize}px`,
            minWidth: `${imageSize}px`,
            height: `${imageSize}px`,
          }}
        >
          <Image
            slider={slider}
            lazyLoading
            src={image ? `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${image}` : ""}
            alt={title}
            size="16"
            id="partnerImage"
          />
        </div>

        {approved && iconSize && (
          <Icon
            className={classnames("icon", type)}
            name={"quest-check-mark"}
            size={iconSize}
            style={{ position: "absolute", bottom: 0, right: 0 }}
            id="partnerImage"
          />
        )}
      </div>

      <div className="content">
        <p
          className={classnames("title", type)}
          id="partnerTitle"
          onClick={goToProjectPage}
        >
          {title}
        </p>

        {subTitle && (
          <Box
            sx={{
              maxWidth,
              textOverflow: maxWidth && "overflow",
              whiteSpace: maxWidth && "nowrap",
            }}
            className={classnames("sub-title", type)}
          >
            {subTitle}
          </Box>
        )}
      </div>
    </Wrapper>
  );
};

export default memo(ProjectInfo);
