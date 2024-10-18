import { useMemo } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";

import Link from "next/link";
import Image from "next/image";

import { IAuthorItem, IPostItem } from "@models";
import { Icon } from "@components/UI/icon";
import { SocialMedia } from "@components/socialMedia";
import {
  AuthorSectionStylesAuthor,
  AuthorSectionStylesAuthorText,
  AuthorSectionStylesAuthorImage,
  AuthorSectionStylesContent,
  AuthorSectionStylesItem,
  AuthorSectionStylesLink,
  AuthorSectionStylesWrapper,
} from "./author.styles";

type Props = {
  currentPostSlug?: string;
  author: IAuthorItem;
  type: "info" | "links";
};

export const AuthorSection = ({ currentPostSlug, author, type }: Props) => {
  const subPosts = useMemo(() => {
    if (author.posts?.nodes) {
      return (author.posts?.nodes as IPostItem[])
        .map((item: any) => item.translation)
        .filter((post: IPostItem) => post && post.slug !== currentPostSlug);
    }

    return [];
  }, [author]);

  return (
    <AuthorSectionStylesWrapper>
      <AuthorSectionStylesAuthor>
        <AuthorSectionStylesAuthorImage mr={1.5}>
          {author.authorsImage?.authorImg?.sourceUrl ? (
            <Image
              src={author.authorsImage?.authorImg?.sourceUrl}
              alt={author.name || ""}
              style={{ objectFit: "cover" }}
              width="80"
              height="80"
              placeholder="empty"
              priority={false}
            />
          ) : (
            <Icon name="image-error" size="30" />
          )}
        </AuthorSectionStylesAuthorImage>

        <section className={"inf"}>
          {author.name && (
            <AuthorSectionStylesAuthorText
              className={"c-font-16-22 c-fw-500 c-font-color"}
            >
              {author.name}
            </AuthorSectionStylesAuthorText>
          )}

          <Box mt={1.25}>
            <SocialMedia
              align="left"
              instagram={author.authorsSocialLinks?.instagramUrl || null}
              twitter={author.authorsSocialLinks?.twitterUrl || null}
              facebook={author.authorsSocialLinks?.facebookUrl || null}
              reddit={author.authorsSocialLinks?.redditUrl || null}
              linkedin={author.authorsSocialLinks?.linkedinUrl || null}
              discord={author.authorsSocialLinks?.discordUrl || null}
              medium={author.authorsSocialLinks?.mediumUrl || null}
              type="secondary"
            />
          </Box>
        </section>
      </AuthorSectionStylesAuthor>

      {subPosts.length >= 1 && type === "links" && (
        <AuthorSectionStylesContent mb={2}>
          {subPosts.slice(0, 3).map((post: IPostItem) => (
            <Link href={`/blog/${post.slug}`} key={post.postId}>
              <AuthorSectionStylesItem
                className={"c-font-14-20 c-font-color-10"}
              >
                <p className="c-font-14-20 c-font-color-10">
                  {DateTime.fromISO(`${post.dateGmt}`)
                    .toUTC()
                    .toFormat("MMM dd, y")}
                </p>

                <p className="c-font-14-20 c-font-color">{post.title}</p>
              </AuthorSectionStylesItem>
            </Link>
          ))}
        </AuthorSectionStylesContent>
      )}

      {subPosts.length > 3 && type === "links" && (
        <Box component="footer">
          <Link
            style={{ textDecoration: "none" }}
            href={`/blog/authors/${author.slug}`}
          >
            <AuthorSectionStylesLink className={"c-font-14-20 c-font-color-10"}>
              Other articles{" "}
              <Icon
                style={{ transform: "rotate(90deg)" }}
                name="arrow-straight"
                size="16"
              />
            </AuthorSectionStylesLink>
          </Link>
        </Box>
      )}

      {subPosts.length <= 3 && type === "links" && (
        <Box component="footer">
          <Link
            style={{ textDecoration: "none" }}
            href={`/blog/authors/${author.slug}`}
          >
            <AuthorSectionStylesLink className={"c-font-14-20 c-font-color-10"}>
              Author page{" "}
              <Icon
                style={{ transform: "rotate(90deg)" }}
                name="arrow-straight"
                size="16"
              />
            </AuthorSectionStylesLink>
          </Link>
        </Box>
      )}

      {type === "info" && (
        <>
          <Box className="c-font-16-22 c-font-color-10" component="p">
            About author
          </Box>

          <Box
            className="c-font-color"
            mt={1}
            dangerouslySetInnerHTML={{ __html: author.description || "..." }}
          />
        </>
      )}
    </AuthorSectionStylesWrapper>
  );
};
