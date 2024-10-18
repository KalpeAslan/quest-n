import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";

import { client } from "@/utils";
import { GET_POSTS_BY_AUTHOR, GET_AUTHOR_BY_SLUG } from "@modules/blog/queries";
import { IAuthorItem, IPostItem } from "@models";
import { PostsSection } from "@modules/blog/components/pages";
import { Button } from "@components/UI/button";
import { Loader } from "@components/UI/loader";

import {
  AuthorStylesContainer,
  AuthorStylesFooter,
  AuthorStylesFooterMore,
  AuthorStylesHeader,
  AuthorStylesSticky,
  AuthorStylesWrapper,
} from "./author.styles";
import { BreadCrumbs } from "@/modules/blog/components/breadcrumbs";
import { AuthorSection } from "@modules/blog/components/pages";
import { computeLanguage } from "@modules/blog/queries/blog.utils";
import { useRouter } from "next/router";
import { usePrevious } from "@hooks/usePrevious";

const POSTS_PER_PAGE = 10;

export const getServerSideProps = async ({ params, locale }: any) => {
  try {
    const { data: authorData } = await client.query({
      query: GET_AUTHOR_BY_SLUG,
      variables: {
        id: params.slug,
      },
    });

    const { data: authorPosts } = await client.query({
      query: GET_POSTS_BY_AUTHOR,
      variables: {
        terms: params.slug,
        offset: 0,
        size: POSTS_PER_PAGE,
        language: computeLanguage(locale),
      },
    });

    let pages = null;

    if (
      authorPosts.posts.pageInfo.offsetPagination.total &&
      authorPosts.posts.pageInfo.offsetPagination.total > POSTS_PER_PAGE
    ) {
      pages = Math.ceil(
        authorPosts.posts.pageInfo.offsetPagination.total / POSTS_PER_PAGE,
      );
    }

    if (!authorData.customAuthor) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        author: authorData.customAuthor,
        postsData: authorPosts.posts.nodes,
        postsPages: pages,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

type Props = {
  author: IAuthorItem;
  postsData: IPostItem[];
  postsPages: number;
};

const Author: NextPage<Props> = ({
  author,
  postsData: postsDataProp,
  postsPages,
}) => {
  const [loaded, setLoaded] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(postsPages);
  const [posts, setPosts] = useState<IPostItem[]>(postsDataProp || []);

  const { locale, query } = useRouter();

  const prevLang = usePrevious(locale);

  useEffect(() => {
    if (prevLang !== undefined && prevLang !== locale) {
      try {
        client
          .query({
            query: GET_POSTS_BY_AUTHOR,
            variables: {
              terms: query.slug,
              offset: 0,
              size: POSTS_PER_PAGE,
              language: computeLanguage(locale),
            },
          })
          .then(res => res.data)
          .then((data: any) => setPosts(data.posts.nodes));
      } catch (e) {
        console.log("Error on fetching GET_POSTS_BY_AUTHOR: ", e, "author.tsx");
      }
    }
  }, [locale]);

  const fetchNextPosts = async () => {
    setLoaded(false);
    const page = currentPage + 1;

    const { data: postsResponse } = await client.query({
      query: GET_POSTS_BY_AUTHOR,
      variables: {
        terms: author.slug,
        offset: (page - 1) * POSTS_PER_PAGE,
        size: POSTS_PER_PAGE,
        language: computeLanguage(locale),
      },
    });

    setTotalPages(
      Math.ceil(
        postsResponse.posts.pageInfo.offsetPagination.total / POSTS_PER_PAGE,
      ),
    );
    setCurrentPage(page);
    setPosts([...posts, ...postsResponse.posts.nodes]);
    setLoaded(true);
  };

  const links = [
    {
      id: 1,
      title: "Blog",
      link: "",
    },
    {
      id: 2,
      title: "Authors",
      link: "authors",
    },
    {
      id: 3,
      title: author.name,
      link: "authors",
    },
  ];

  return (
    <>
      <Head>
        <title>{author.seo.title}</title>
        <meta name="description" content={author.seo.metaDesc} />
        <meta name="keywords" content={author.seo.metaKeywords} />

        <meta name="author" content={author.name} />

        <meta property="og:title" content={author.seo.title} />
        <meta property="og:type" content={author.seo.opengraphType} />
        <meta
          property="og:image"
          content={author.authorsImage?.authorImg?.sourceUrl || ""}
        />
        <meta property="og:url" content={author.seo.opengraphUrl} />
        <meta property="og:description" content={author.seo.metaDesc} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={author.seo.title} />
        <meta name="twitter:description" content={author.seo.metaDesc} />
        <meta
          name="twitter:image"
          content={author.authorsImage?.authorImg?.sourceUrl || ""}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthorStylesWrapper>
        <AuthorStylesContainer mt={5} mb={5}>
          <Box style={{ gridArea: "breadcrumbs" }} mb={3}>
            <BreadCrumbs links={links} />
          </Box>

          <AuthorStylesHeader mb={{ xs: 1.5 }}>
            <Box
              component="h1"
              className="c-font-32-38 c-md-font-48-56 c-fw-500 c-font-color"
            >
              {`${author.name}'`}s articles
            </Box>
          </AuthorStylesHeader>

          <AuthorStylesSticky mb={{ xs: 5 }}>
            {author && <AuthorSection author={author} type="info" />}
          </AuthorStylesSticky>

          {posts.length > 0 && (
            <AuthorStylesFooter>
              {!loaded && <Loader backgroundColor="rgb(16 19 19 / 10%)" />}

              <PostsSection data={posts} />

              {totalPages !== null && currentPage < totalPages && (
                <AuthorStylesFooterMore component="footer" mt={3} mb={1}>
                  <Button
                    style="secondary"
                    loading={!loaded}
                    disabled={!loaded}
                    onClick={fetchNextPosts}
                  >
                    <span>Show next {POSTS_PER_PAGE}</span>
                  </Button>
                </AuthorStylesFooterMore>
              )}
            </AuthorStylesFooter>
          )}
        </AuthorStylesContainer>
      </AuthorStylesWrapper>
    </>
  );
};

export default Author;
