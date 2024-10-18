import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  GET_POSTS_BY_TAGS,
  GET_POSTS_BY_CATEGORY,
  GET_PAGE_SEO,
  GET_TAGS,
  GET_AUTHORS,
} from "@modules/blog/queries";
import { ITagItem, IAuthorItem, IPostItem, IPageSEO } from "@models";
import { HeroSection } from "@/modules/blog/components/pages";
import { HighlightsSection } from "@/modules/blog/components/pages";
import { TagsSection } from "@/modules/blog/components/pages";
import { AuthorsSection } from "@/modules/blog/components/pages";
import { PostsSection } from "@modules/blog/components/pages";
import { Button } from "@components/UI/button";
import { Loader } from "@components/UI/loader";

import {
  BlogStylesAuthors,
  BlogStylesFooter,
  BlogStylesPosts,
  BlogStylesPostsWrapp,
  BlogStylesTags,
  BlogStylesWrapper,
} from "./blog.styles";
import { client } from "@/utils";
import { LoggerService } from "@services";
import { computeLanguage } from "@modules/blog/queries/blog.utils";
import { usePrevious } from "@hooks/usePrevious";

const POSTS_PER_PAGE = 10;

export const getServerSideProps = async ({ locale }) => {
  try {
    const language = computeLanguage(locale);
    const { data: pageSeoResponse } = await client.query({
      query: GET_PAGE_SEO,
      variables: {
        name: "blog",
      },
    });

    const { data: authorsResponse } = await client.query({
      query: GET_AUTHORS,
      variables: {
        language,
      },
    });

    let authorsData: IAuthorItem[] = [];

    if (authorsResponse.customAuthors.nodes) {
      authorsData = authorsResponse.customAuthors.nodes.sort(
        (a: IAuthorItem, b: IAuthorItem) => {
          const aC = a.posts.pageInfo.offsetPagination.total;
          const bC = b.posts.pageInfo.offsetPagination.total;

          // @ts-ignore
          if (aC < bC) {
            return 1;
          }

          // @ts-ignore
          if (aC > bC) {
            return -1;
          }

          return 0;
        },
      );
    }

    const { posts, totalPages } = await fetchPosts(language);

    const highlightItems = await fetchHighlightItems(language);

    const tagsData = await fetchTags();

    const heroItems = await fetchHeroItems(language);

    return {
      props: {
        seoData: pageSeoResponse.pages.nodes,
        authorsData,
        heroItems,
        tagsData,
        highlightItems,
        postsData: posts,
        totalPages,
      },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

const fetchPosts = async (language: string) => {
  try {
    const { data: postsResponse } = await client.query({
      query: GET_POSTS_BY_TAGS,
      variables: {
        tags: undefined,
        offset: 0,
        size: POSTS_PER_PAGE,
        language,
      },
    });

    if (
      !postsResponse ||
      postsResponse.posts.nodes.filter(Boolean).length === 0
    ) {
      return await fetchPosts("EN");
    }

    let totalPages = null;
    if (
      postsResponse &&
      postsResponse.posts?.pageInfo?.offsetPagination?.total &&
      postsResponse.posts.pageInfo.offsetPagination.total > POSTS_PER_PAGE
    ) {
      totalPages = Math.ceil(
        postsResponse.posts.pageInfo.offsetPagination.total / POSTS_PER_PAGE,
      );
    }

    return {
      posts:
        postsResponse && postsResponse.posts && postsResponse.posts.nodes
          ? postsResponse.posts.nodes
          : [],
      totalPages,
    };
  } catch (e) {
    console.log("Error on fetchPosts", e);
    LoggerService.error("Error fetchPosts", e);
    return [];
  }
};

const fetchTags = async () => {
  try {
    const { data: tagsResponse } = await client.query({
      query: GET_TAGS,
    });

    let tagsD: ITagItem[] = [];

    if (tagsResponse.tags.nodes) {
      tagsD = tagsResponse.tags.nodes.map((tag: any, it: number) => ({
        id: it,
        selectStatus: false,
        slug: tag.slug,
        title: tag.name,
      }));
    }

    return tagsD;
  } catch (e) {
    console.log("Error on fetchTags", e);
    LoggerService.error("Error fetchTags", e);
    return [];
  }
};

const fetchHeroItems = async (language: string) => {
  try {
    const { data: featuredResponse } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: {
        categoryName: "Featured",
        offset: 0,
        size: 3,
        language,
      },
    });
    if (!featuredResponse.posts.nodes.length) {
      return fetchHeroItems("EN");
    }
    return featuredResponse.posts.nodes;
  } catch (e) {
    console.log("featuredResponse", e);
    return [];
  }
};

const fetchHighlightItems = async (language: string) => {
  try {
    const { data: highlightResponse } = await client.query({
      query: GET_POSTS_BY_CATEGORY,
      variables: {
        categoryName: "Highlighted",
        offset: 0,
        size: 3,
        language,
      },
    });
    if (!highlightResponse.posts.nodes.length) {
      return await fetchHighlightItems("EN");
    }
    return highlightResponse && highlightResponse.posts.nodes
      ? highlightResponse.posts.nodes
      : [];
  } catch (e) {
    console.log("Error on fetchHighlightItems", e);
    LoggerService.error("Error fetchHighlightItems", e);
    return [];
  }
};

type Props = {
  authorsData: IAuthorItem[];
  postsData: IPostItem[];
  seoData: IPageSEO[];
  tagsData: ITagItem[];
  heroItems: IPostItem[];
  highlightItems: IPostItem[];
  totalPages: number;
};

const Blog: NextPage<Props> = ({
  seoData,
  authorsData,
  heroItems: heroItemsProp,
  tagsData: tagsDataProp,
  highlightItems: highlightItemsProp,
  postsData: postsDataProp,
  totalPages: totalPagesProp,
}: Props) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [postsData, setPostsData] = useState<IPostItem[]>(postsDataProp || []);
  const [totalPages, setTotalPages] = useState<number | null>(
    totalPagesProp || 0,
  );
  const [tags, setTags] = useState<ITagItem[]>(tagsDataProp || []);
  const [heroItems, setHeroItems] = useState<IPostItem[]>(heroItemsProp || []);
  const [highlightItems, setHighlightItems] = useState<IPostItem[]>(
    highlightItemsProp || [],
  );
  // const [isFetchHeroItemsLoading, setIsFetchHeroItemsLoading] =
  //   useState<boolean>(false);
  // const [isFetchHighlightItemsLoading, setIsFetchHighlightItemsLoading] =
  //   useState(false);

  const prevLang = usePrevious(router.locale);

  const fetchPostsByTags = async (updatedTags: ITagItem[]) => {
    setTags(updatedTags);
    setLoaded(false);

    const activeTags = updatedTags.filter((tag: ITagItem) => tag.selectStatus);
    const tagsQuery = activeTags
      .map((tag: ITagItem) => tag.slug.toLocaleLowerCase())
      .join(",");

    const { data: postsResponse } = await client.query({
      query: GET_POSTS_BY_TAGS,
      variables: {
        tags: tagsQuery,
        offset: 0,
        size: POSTS_PER_PAGE,
        language: computeLanguage(router.locale),
      },
    });

    const queryString =
      tagsQuery.length > 0 ? `/blog/?tags=${tagsQuery}` : "/blog";

    router.push(queryString, undefined, { shallow: true });
    setTotalPages(
      Math.ceil(
        postsResponse.posts.pageInfo.offsetPagination.total / POSTS_PER_PAGE,
      ),
    );
    setCurrentPage(1);
    setPosts(postsResponse.posts.nodes);
    setLoaded(true);
  };

  const fetchNextPosts = async () => {
    setLoaded(false);
    const page = currentPage + 1;

    const activeTags = tags.filter((tag: ITagItem) => tag.selectStatus);
    const tagsQuery = activeTags
      .map((tag: ITagItem) => tag.slug.toLocaleLowerCase())
      .join(",");

    const { data: postsResponse } = await client.query({
      query: GET_POSTS_BY_TAGS,
      variables: {
        tags: tagsQuery,
        offset: (page - 1) * POSTS_PER_PAGE,
        size: POSTS_PER_PAGE,
        language: computeLanguage(router.locale),
      },
    });

    // router.push(queryString, undefined, { scroll: false });
    setTotalPages(
      Math.ceil(
        postsResponse.posts.pageInfo.offsetPagination.total / POSTS_PER_PAGE,
      ),
    );
    setCurrentPage(page);
    setPosts([...posts, ...postsResponse.posts.nodes]);
    setPostsData(
      prevState => [...prevState, ...postsResponse.posts.nodes] as any,
    );
    setLoaded(true);
  };

  useEffect(() => {
    setHeroItems(heroItemsProp);
    setHighlightItems(highlightItemsProp);
    setPostsData(postsDataProp);
    setTags(tagsDataProp);
    setTotalPages(totalPagesProp);
  }, [router.locale]);

  return (
    <>
      <Head>
        <title>{seoData[0].seo.title}</title>
        <meta name="description" content={seoData[0].seo.metaDesc} />
        <meta name="keywords" content={seoData[0].seo.metaKeywords} />

        <meta property="og:title" content={seoData[0].seo.title} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={seoData[0].featuredImage?.node?.sourceUrl || ""}
        />
        <meta property="og:url" content={seoData[0].seo.opengraphUrl} />
        <meta property="og:description" content={seoData[0].seo.metaDesc} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoData[0].seo.title} />
        <meta name="twitter:description" content={seoData[0].seo.metaDesc} />
        <meta
          name="twitter:image"
          content={seoData[0].featuredImage?.node?.sourceUrl || ""}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BlogStylesWrapper>
        <div className="c-wrap">
          <Box mt={{ xs: 3, sm: 5 }} mb={5}>
            <Box
              component="h1"
              className="c-font-32-38 c-md-font-48-56 c-fw-500 c-font-color"
              mb={3}
            >
              Blog
            </Box>

            {heroItems && heroItems.length > 0 && (
              <Box mb={5}>
                <HeroSection data={heroItems} />
              </Box>
            )}

            {highlightItems && highlightItems.length > 0 && (
              <Box mb={5} mr={{ xs: -2, sm: -3, md: 0 }}>
                <HighlightsSection data={highlightItems} />
              </Box>
            )}

            <BlogStylesPostsWrapp>
              {postsData && postsData.length ? (
                <BlogStylesPosts component="section" mb={{ xs: 5, md: 0 }}>
                  {!loaded && <Loader backgroundColor="rgb(16 19 19 / 10%)" />}

                  <PostsSection data={postsData} />

                  {totalPages && currentPage < totalPages && (
                    <BlogStylesFooter component="footer" mt={3} mb={1}>
                      <Button
                        style="secondary"
                        loading={!loaded}
                        disabled={!loaded}
                        onClick={fetchNextPosts}
                      >
                        <span>Show next {POSTS_PER_PAGE}</span>
                      </Button>
                    </BlogStylesFooter>
                  )}
                </BlogStylesPosts>
              ) : (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  color={"var(--scrollbar-background-color)"}
                >
                  <CircularProgress color="inherit" size={40} />
                </Box>
              )}

              {tags.length > 0 && (
                <BlogStylesTags component="section" mb={{ xs: 1.5 }}>
                  <Box className={"tags-desctop"}>
                    <TagsSection
                      title="Tags"
                      type="active"
                      tags={tags}
                      setActiveTags={fetchPostsByTags}
                    />
                  </Box>

                  <Box className={"tags-mobile"}>
                    <TagsSection
                      title="Tags"
                      type="active-slide"
                      tags={tags}
                      setActiveTags={fetchPostsByTags}
                    />
                  </Box>
                </BlogStylesTags>
              )}

              {authorsData.length > 0 && (
                <BlogStylesAuthors component="section">
                  <AuthorsSection authors={authorsData} />
                </BlogStylesAuthors>
              )}
            </BlogStylesPostsWrapp>
          </Box>
        </div>
      </BlogStylesWrapper>
    </>
  );
};

export default Blog;
