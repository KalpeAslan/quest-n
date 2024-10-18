import { Box } from "@mui/material";
import classnames from "classnames";
import { DateTime } from "luxon";

import Image from "next/image";

import { Icon } from "@components/UI/icon";
import { Like } from "@components/like";
import { LabelsGroup } from "@components/labelsGroup";
import { IPostItem } from "@models";
import { HeroSectionItemStyled } from "./item.styles";
import { useRef } from "react";
import { useObserver } from "@hooks/useObserver";

type Props = {
  data: IPostItem;
};

export const Item = ({ data }: Props) => {
  const ref = useRef();

  const [isViewed] = useObserver(ref);

  return (
    <HeroSectionItemStyled ref={ref} href={`/blog/${data.slug}`}>
      <div className={"image"}>
        {isViewed &&
          (data.featuredImage?.node?.sourceUrl ? (
            <Image
              src={data.featuredImage?.node?.sourceUrl}
              alt={data.title || ""}
              objectFit="cover"
              layout="fill"
              placeholder="empty"
              priority={false}
            />
          ) : (
            <Icon name="image-error" size="80" />
          ))}
      </div>

      <section className={"content"}>
        <Box
          component="header"
          className={classnames("header", "c-font-color-10")}
          mb={{ xs: 0.5, md: 0 }}
        >
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

          {data.readTime.readingTime && (
            <Box className="c-font-12-16">
              Read {data.readTime.readingTime} min.
            </Box>
          )}

          {data.likes && (
            <Box className={"like"} ml="auto">
              <Like id={data.postId as unknown as string} likes={+data.likes} />
            </Box>
          )}
        </Box>

        <div className={"author"}>
          <Box className={"author-image"} mr={1.5}>
            {isViewed &&
              (data.customAuthors.nodes &&
              data.customAuthors.nodes[0] &&
              data.customAuthors.nodes[0].authorsImage?.authorImg?.sourceUrl ? (
                <Image
                  src={
                    data.customAuthors.nodes[0].authorsImage?.authorImg
                      ?.sourceUrl
                  }
                  alt={data.customAuthors.nodes[0]?.name || ""}
                  objectFit="cover"
                  width="48"
                  height="48"
                  placeholder="empty"
                  priority={false}
                />
              ) : (
                <Icon name="image-error" size="20" />
              ))}
          </Box>

          {data.customAuthors.nodes && data.customAuthors.nodes[0]?.name && (
            <p
              className={classnames(
                "author-text",
                "c-font-20-24 c-fw-500 c-font-color",
              )}
            >
              {data.customAuthors.nodes[0]?.name}
            </p>
          )}
        </div>

        <Box className={"info"} mb={{ xs: 2, sm: 0 }}>
          {data.title && (
            <Box
              component="h2"
              className={classnames(
                "title",
                "c-font-20-24 c-md-font-32-38 c-fw-500 c-font-color",
              )}
              mb={{ xs: 0.5, md: 1.5 }}
            >
              {data.title}
            </Box>
          )}

          {data.excerpt && (
            <Box
              className={classnames(
                "text",
                "c-font-14-20 c-md-font-16-22 c-font-color",
              )}
              mb={{ xs: 2, sm: 0 }}
              dangerouslySetInnerHTML={{ __html: data.excerpt }}
            />
          )}
        </Box>

        {data.tags.nodes.length > 0 && (
          <Box className={"footer"} mt={{ xs: "auto", md: 0 }}>
            <LabelsGroup
              labels={data.tags.nodes.map(tag => tag.name)}
              type="slice"
            />
          </Box>
        )}
      </section>
    </HeroSectionItemStyled>
  );
};
