import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { IAuthorItem } from "@models";
import { Icon } from "@components/UI/icon";
import {
  AuthorsSectionItem,
  AuthorsSectionItemImg,
  AuthorsSectionItemText,
} from "./authorsSection.styles";
// import st from "./item.module.css";

type Props = {
  data: IAuthorItem;
};

export const Item = ({ data }: Props) => {
  return (
    <Link style={{ textDecoration: "none" }} href={`blog/authors/${data.slug}`}>
      <AuthorsSectionItem>
        <AuthorsSectionItemImg mr={1.5}>
          {data && data.authorsImage?.authorImg?.sourceUrl ? (
            <Image
              src={data.authorsImage?.authorImg?.sourceUrl}
              alt={data.name || ""}
              title={data.name}
              width="48"
              height="48"
              placeholder="empty"
              priority={false}
            />
          ) : (
            <Icon name="image-error" size="20" />
          )}
        </AuthorsSectionItemImg>

        {data.name && (
          <AuthorsSectionItemText
            className={"c-font-16-22 c-fw-500 c-font-color"}
          >
            {data.name}
          </AuthorsSectionItemText>
        )}

        {data.posts.pageInfo.offsetPagination.total !== null &&
          data.posts.pageInfo.offsetPagination.total > 0 && (
            <Box
              className="c-font-14-20 c-font-color-10"
              component="p"
              ml="auto"
            >
              {data.posts.pageInfo.offsetPagination.total}{" "}
              {data.posts.pageInfo.offsetPagination.total === 1
                ? "article"
                : "articles"}{" "}
            </Box>
          )}
      </AuthorsSectionItem>
    </Link>
  );
};
