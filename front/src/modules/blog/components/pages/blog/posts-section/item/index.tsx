import { Box } from "@mui/material";
import { DateTime } from "luxon";

import Image from "next/image";

import { Icon } from "@components/UI/icon";
import { Like } from "@components/like";
import { LabelsGroup } from "@components/labelsGroup";
import { IPostItem } from "@models";
import { PostsSectionItemStyles } from "@modules/blog/components/pages/blog/posts-section/item/postsSectionItem.styles";
import { useRef } from "react";
import { useObserver } from "@hooks/useObserver";

type Props = {
  data: IPostItem;
};

export const Item = ({ data }: Props) => {
  const ref = useRef();

  const [isViewed] = useObserver(ref);

  return (
    <PostsSectionItemStyles ref={ref} href={`/blog/${data.slug}`}>
      <div className={"image"}>
        {isViewed && (
          <>
            {data.featuredImage?.node?.sourceUrl ? (
              <Image
                src={data.featuredImage.node.sourceUrl}
                alt={data.title || ""}
                objectFit="cover"
                layout="fill"
                placeholder="empty"
                priority={false}
              />
            ) : (
              <Icon name="image-error" size="50" />
            )}
          </>
        )}
        <div className={"author author-desctop"}>
          <Box className={"author-image"} mr={1}>
            {isViewed &&
              (data.customAuthors.nodes &&
              data.customAuthors.nodes[0]?.authorsImage?.authorImg
                ?.sourceUrl ? (
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
                  priority={false}
                />
              ) : (
                <Icon name="image-error" size="10" />
              ))}
          </Box>

          {data.customAuthors.nodes && data.customAuthors.nodes[0]?.name && (
            <p className={"author-text c-font-14-17 c-fw-500 c-font-color"}>
              {data.customAuthors.nodes[0]?.name}
            </p>
          )}

          {data.likes && (
            <Box className={"like icon like-desctop"} ml="auto">
              <Like id={data.postId} likes={data.likes} />
            </Box>
          )}
        </div>
      </div>

      <div className={"content"}>
        <Box className={"header c-font-color-10"} mb={0.5}>
          <div className={"data"}>
            {data.dateGmt && (
              <p className="c-font-12-16">
                {DateTime.fromISO(`${data.dateGmt}`)
                  .toUTC()
                  .toFormat("MMM dd, y")}
              </p>
            )}

            {data.dateGmt && data.readTime?.readingTime && (
              <Box
                className={"decor c-font-24-24 c-font-color-11"}
                component="span"
                mx={1}
              ></Box>
            )}

            {data.readTime?.readingTime && (
              <Box className="c-font-12-16" ml="auto">
                Read {data.readTime.readingTime} min.
              </Box>
            )}
          </div>

          <div className={"soc"}>
            {data.likes && (
              <div className={"like like-mobile"}>
                <Like id={data.postId} likes={data.likes} />
              </div>
            )}
          </div>
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

        <div className={"author author-mobile"}>
          <Box className={"author-image"} mr={1}>
            {isViewed &&
              (data.customAuthors.nodes &&
              data.customAuthors.nodes[0]?.authorsImage?.authorImg
                ?.sourceUrl ? (
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
                  priority={false}
                />
              ) : (
                <Icon name="image-error" size="10" />
              ))}
          </Box>

          {data.customAuthors.nodes && data.customAuthors.nodes[0]?.name && (
            <p className={"author-text c-font-14-17 c-fw-500 c-font-color"}>
              {data.customAuthors.nodes[0]?.name}
            </p>
          )}
        </div>

        {data.excerpt && (
          <Box
            className={"text c-font-14-20 c-font-color"}
            mb={2}
            dangerouslySetInnerHTML={{ __html: data.excerpt }}
          />
        )}

        {data.tags && data.tags.nodes?.length > 0 && (
          <Box mt="auto">
            <LabelsGroup labels={data.tags.nodes?.map(tag => tag.name)} />
          </Box>
        )}
      </div>
    </PostsSectionItemStyles>
  );
};
