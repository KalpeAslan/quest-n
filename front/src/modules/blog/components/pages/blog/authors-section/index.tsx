import { Box } from "@mui/material";

import Link from "next/link";

import { IAuthorItem } from "@models";
import { Icon } from "@components/UI/icon";

import { Item } from "./item";
import {
  AuthorsStylesFooter,
  AuthorsStylesItem,
  AuthorsStylesLink,
  AuthorsStylesList,
  AuthorsStylesWrapper,
} from "./authorsSection.styles";

type Props = {
  authors: IAuthorItem[];
};

export const AuthorsSection = ({ authors }: Props) => {
  return (
    <section>
      <Box component="p" className="c-font-20-24 c-fw-500 c-font-color" mb={2}>
        Authors
      </Box>

      <AuthorsStylesWrapper>
        {authors.length > 0 && (
          <AuthorsStylesList>
            {authors.length > 0 &&
              authors.slice(0, 5).map((author: IAuthorItem) => (
                <AuthorsStylesItem key={author.databaseId}>
                  <Item data={author} />
                </AuthorsStylesItem>
              ))}
          </AuthorsStylesList>
        )}

        <AuthorsStylesFooter component="header" mt={1.5}>
          <Link href="/blog/authors">
            <AuthorsStylesLink className={"c-font-16-22 c-font-color-10"}>
              All authors{" "}
              <Icon
                style={{ transform: "rotate(90deg)" }}
                name="arrow-straight"
                size="18"
              />
            </AuthorsStylesLink>
          </Link>
        </AuthorsStylesFooter>
      </AuthorsStylesWrapper>
    </section>
  );
};
