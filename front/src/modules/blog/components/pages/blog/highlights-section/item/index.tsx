import { Box } from "@mui/material";
import { DateTime } from "luxon";
import Image from "next/image";

import { Icon } from "@components/UI/icon";
import { Like } from "@components/like";
import { LabelsGroup } from "@components/labelsGroup";
import { IPostItem } from "@models";

import {
  HighlightsSectionStylesWrapper,
  HighlightsSectionStylesImage,
  HighlightsSectionStylesContent,
  HighlightsSectionStylesAuthorImage,
  HighlightsSectionStylesAuthor,
} from "./highlightsSectionItem.styles";

type Props = {
  data: IPostItem;
};

export const Item = ({ data }: Props) => {
  return (
    <HighlightsSectionStylesWrapper href={`/blog/${data.slug}`}>
      <HighlightsSectionStylesImage>
        {data.featuredImage?.node?.sourceUrl ? (
          <Image
            src={data.featuredImage?.node?.sourceUrl}
            alt={data.title || ""}
            objectFit="cover"
            layout="fill"
            placeholder="empty"
            priority={false}
            loading={"lazy"}
          />
        ) : (
          <Icon name="image-error" size="50" />
        )}

        <HighlightsSectionStylesAuthor>
          <HighlightsSectionStylesAuthorImage mr={1}>
            {data.customAuthors.nodes &&
            data.customAuthors.nodes[0]?.authorsImage?.authorImg?.sourceUrl ? (
              <Image
                src={
                  data.customAuthors.nodes &&
                  data.customAuthors.nodes[0]?.authorsImage?.authorImg
                    ?.sourceUrl
                }
                alt={data.customAuthors.nodes[0]?.name || ""}
                objectFit="cover"
                width="24"
                height="24"
                placeholder="empty"
                loading={"lazy"}
                priority={false}
              />
            ) : (
              <Icon name="image-error" size="10" />
            )}
          </HighlightsSectionStylesAuthorImage>

          {data.customAuthors.nodes && data.customAuthors.nodes[0]?.name && (
            <p className={"author-text c-font-14-17 c-fw-500 c-font-color"}>
              {data.customAuthors.nodes[0]?.name}
            </p>
          )}

          {data.likes && (
            <Box className={"like"} ml="auto">
              <Like id={data.postId} likes={data.likes} />
            </Box>
          )}
        </HighlightsSectionStylesAuthor>
      </HighlightsSectionStylesImage>

      <HighlightsSectionStylesContent>
        <Box className={"header c-font-color-10"} mb={0.5}>
          {data.dateGmt && (
            <p className="c-font-12-16">
              {DateTime.fromISO(`${data.dateGmt}`)
                .toUTC()
                .toFormat("MMM dd, y")}
            </p>
          )}

          {data.readTime.readingTime && (
            <Box className="c-font-12-16" ml="auto">
              Read {data.readTime.readingTime} min.
            </Box>
          )}
        </Box>

        {data.title && (
          <Box
            component="p"
            className={"title c-font-20-24 c-font-color c-fw-500"}
            mb={0.5}
          >
            {data.title}
          </Box>
        )}

        {data.excerpt && (
          <Box
            className={"text c-font-14-20 c-font-color"}
            mb={2}
            dangerouslySetInnerHTML={{ __html: data.excerpt }}
          />
        )}

        {data.tags.nodes.length > 0 && (
          <Box className={"footer"} mt={{ xs: "auto" }}>
            <LabelsGroup
              labels={data.tags.nodes.map(tag => tag.name)}
              type="slice"
            />
          </Box>
        )}
      </HighlightsSectionStylesContent>
    </HighlightsSectionStylesWrapper>
  );
};
