import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Box, CircularProgress } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { DateTime } from "luxon";

import { client } from "@/utils";
import { IPostItem, IPostItemTranslated } from "@models";
import { GET_POST_BY_SLUG, GET_POSTS } from "@modules/blog/queries";

import { TagsSection } from "@/modules/blog/components/pages/blog/tags-section";
import { PostsSection } from "@/modules/blog/components/pages";

import st from "@styles/pages/blog/article.module.css";
import { BreadCrumbs } from "@/modules/blog/components/breadcrumbs";
import { Share } from "@components/share";
import { Like } from "@components/like";
import { AuthorSection } from "@modules/blog/components/pages";
import Script from "next/script";
import { appConfig } from "@/app.config";
import { useRouter } from "next/router";
import { LoggerService } from "@services";
import SkeletonLoader from "@components/UI/skeletonLoader/SkeletonLoader";
import { useObserver } from "@hooks/useObserver";
import { computeLanguage } from "@modules/blog/queries/blog.utils";
import { usePrevious } from "@hooks/usePrevious";

export const getServerSideProps = async ({ params, locale }: any) => {
  locale = locale === "uk" ? "ua" : locale;
  try {
    let { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: {
        slug: params.slug,
        language: String(locale || "en").toUpperCase(),
      },
    });

    if (!data || !data.post || !data.post.translation) {
      data = await client
        .query({
          query: GET_POST_BY_SLUG,
          variables: {
            slug: params.slug,
            language: "EN",
          },
        })
        .then(res => res.data);
    }

    return {
      props: {
        post: data.post,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

type Props = {
  post: IPostItemTranslated;
  suggestedPosts: null | IPostItem[];
};

const Article: NextPage<Props> = ({ post: postProps }: Props) => {
  const [post, setPost] = useState<IPostItemTranslated>(postProps);
  const [loaded, setLoaded] = useState<boolean>(true);
  const [suggestedPosts, setSuggestedPosts] = useState<null | IPostItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();

  const languageBefore = usePrevious(router.locale);

  const fetchSuggestedPosts = async (language: string) => {
    setIsLoadingSuggestions(true);
    try {
      const { data: postsResponse } = await client.query({
        query: GET_POSTS,
        variables: {
          language,
        },
      });
      const posts = postsResponse.posts.nodes.map(item => item.translation);

      let suggestedPosts: IPostItem[] | null = null;

      if (posts && posts.filter(Boolean).length > 1) {
        const postId = post.postId;

        suggestedPosts = posts.filter(
          (post: IPostItem) => +post.postId != +postId,
        );

        if (suggestedPosts && suggestedPosts.length > 3) {
          const itemsLength = suggestedPosts.length;
          const randomPosts: IPostItem[] = [];

          const arr = [];
          while (arr.length < 3) {
            const r = Math.floor(Math.random() * itemsLength) + 1;

            if (arr.indexOf(r) === -1) {
              arr.push(r);
            }
          }

          arr.forEach((index: number) => {
            randomPosts.push((suggestedPosts as IPostItem[])[index - 1]);
          });

          suggestedPosts = randomPosts;
          setSuggestedPosts(suggestedPosts);
          return;
        }
      }
      if (router.locale !== "en") {
        return fetchSuggestedPosts("EN");
      }
    } catch (e) {
      console.log("Error on fetch suggested posts", e);
      LoggerService.error("Error on fetch suggested posts", e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const ref = useRef<HTMLDivElement | null>(null);

  const [isViewed, setIsViewed] = useObserver(ref);

  const fetchSlug = async () => {
    try {
      let { data } = await client.query({
        query: GET_POST_BY_SLUG,
        variables: {
          slug: router.query.slug,
          language: computeLanguage(router.locale),
        },
      });

      if (!data || !data.post || !data.post.translation) {
        data = await client
          .query({
            query: GET_POST_BY_SLUG,
            variables: {
              slug: router.query.slug,
              language: "EN",
            },
          })
          .then(res => res.data);
      }

      const checkTranslationsAndReturn = (arr: any[]) =>
        arr && arr.length && arr;
      setPost(prevState => ({
        ...data.post,
        translation: {
          ...data.post.translation,
          customAuthors: {
            ...prevState.translation.customAuthors,
            nodes:
              checkTranslationsAndReturn(
                data.post.translation.customAuthors.nodes,
              ) ||
              checkTranslationsAndReturn(
                prevState.translation.customAuthors.nodes,
              ) ||
              [],
          },
          tags: {
            ...prevState.translation.tags,
            nodes:
              checkTranslationsAndReturn(data.post.translation.tags.nodes) ||
              checkTranslationsAndReturn(prevState.translation.tags.nodes) ||
              [],
          },
        },
      }));
      setIsViewed(false);
    } catch (e) {
      console.log("Error on fetch suggested posts", e);
      LoggerService.error("Error on fetch suggested posts", e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const setImgObservers = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      post?.translation.content as string,
      "text/html",
    );
    const images = doc.querySelectorAll("img");

    images.forEach(image => {
      image.setAttribute("loading", "lazy");
    });
  };

  useEffect(() => {
    if (isViewed) {
      fetchSuggestedPosts(computeLanguage(router.locale));
    }
  }, [isViewed, router.locale]);

  useEffect(() => {
    if (languageBefore && languageBefore !== router.locale) {
      fetchSlug().then(() => {});
    }
  }, [router.locale]);

  console.log("post", post);
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
      title:
        post &&
        post.translation.customAuthors?.nodes &&
        post.translation.customAuthors?.nodes[0]
          ? post.translation.customAuthors?.nodes[0].name
          : "No author",
      link: `authors/${
        post &&
        post.translation.customAuthors?.nodes &&
        post.translation.customAuthors?.nodes[0]
          ? post.translation.customAuthors?.nodes[0].slug
          : ""
      }`,
    },
    {
      id: 4,
      title: post && post.translation.title,
      link: `/${post.slug}`,
    },
  ];

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoaded(false));
    router.events.on("routeChangeComplete", () => setLoaded(true));

    return () => {
      router.events.off("routeChangeStart", () => setLoaded(false));
      router.events.off("routeChangeError", () => setLoaded(true));
    };
  }, [router]);

  useEffect(() => {
    if (post && post.translation.content) {
      setImgObservers();
    }
  }, [post, router.pathname]);

  const refBlog = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (refBlog.current) {
      const images = refBlog.current.querySelectorAll("img");

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const originalSrc = img.getAttribute("data-original-src");
            const originalSrcSet = img.getAttribute("data-original-srcset");
            if (originalSrc) {
              img.src = originalSrc;
              img.srcset = originalSrcSet;
              img.removeAttribute("data-original-src");
              img.removeAttribute("data-original-srcset");
            }

            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => img && observer.observe(img));

      return () => {
        observer.disconnect();
      };
    }
  }, [refBlog.current]);

  const computeContentToRender = (): string =>
    typeof post?.translation.content?.replace === "function"
      ? post?.translation.content?.replace(
          "https://api-blog.alphaguilty.io",
          "https://api-blog.alphaguilty.com",
        )
      : "";

  return (
    <>
      <Head>
        <title>{post.translation.seo.title}</title>
        <meta name="description" content={post.translation.seo.metaDesc} />
        <meta name="keywords" content={post.translation.seo.metaKeywords} />

        <meta
          name="author"
          content={
            post.translation.customAuthors?.nodes &&
            post.translation.customAuthors?.nodes[0]
              ? post.translation.customAuthors?.nodes[0].name
              : ""
          }
        />

        <meta property="og:title" content={post.translation.seo.title} />
        <meta property="og:type" content={post.translation.seo.opengraphType} />
        <meta
          property="og:image"
          content={
            post.translation.featuredImage?.node?.sourceUrl?.replace(
              ".io",
              ".com",
            ) || ""
          }
        />
        <meta property="og:url" content={post.translation.seo.opengraphUrl} />
        <meta
          property="og:description"
          content={post.translation.seo.metaDesc}
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.translation.seo.title} />
        <meta
          name="twitter:description"
          content={post.translation.seo.metaDesc}
        />
        <meta
          name="twitter:image"
          content={
            post.translation.featuredImage?.node?.sourceUrl?.replace(
              ".io",
              ".com",
            ) || ""
          }
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={st.wrapper}>
        <Box className={classnames(st.container)} mt={5} mb={5}>
          <Box className={st.header} mb={{ xs: 3 }}>
            <Box className={classnames(st["header-breadcrumbs"])} mb={3}>
              <BreadCrumbs links={links} />
            </Box>

            {post.likes && post.postId && (
              <Box
                className={classnames(st["header-like"])}
                mr={{ xs: 1, sm: 0 }}
              >
                {loaded ? (
                  <Like id={post.postId} likes={post.likes} />
                ) : (
                  <Box mr={2}>
                    <CircularProgress color="inherit" size={20} />
                  </Box>
                )}
              </Box>
            )}

            {post.likes && (
              <Box
                className={classnames(
                  st.decor,
                  st["decor-first"],
                  "c-font-24-24 c-font-color-11",
                )}
                component="span"
                mx={1}
              ></Box>
            )}

            <Box
              className={classnames(st["header-share"])}
              ml={{ xs: 1, sm: 0 }}
            >
              <Share
                url={`${appConfig.NEXT_PUBLIC_BLOG_DOMAIN}/${post.slug}`}
              />
            </Box>

            <Box className={st["header-inf"]}>
              {post.dateGmt && (
                <p className="c-sm-font-16-22 c-font-color">
                  {DateTime.fromISO(`${post.dateGmt}`)
                    .toUTC()
                    .toFormat("MMM dd, y")}
                </p>
              )}

              {post.dateGmt && post.readTime.readingTime && (
                <Box
                  className={classnames(
                    st.decor,
                    "c-font-24-24 c-font-color-11",
                  )}
                  component="span"
                  mx={1}
                ></Box>
              )}

              {post.readTime.readingTime && (
                <p className="c-sm-font-16-22 c-font-color">
                  Read {post.readTime.readingTime} min.
                </p>
              )}
            </Box>
          </Box>

          <Box
            className={classnames(st.content, "c-font-color")}
            mb={{ xs: 3 }}
          >
            <Box
              component="h1"
              className="c-font-32-38 c-md-font-48-56 c-fw-500 c-font-color"
              mb={2}
            >
              {post.translation.title}
            </Box>

            {loaded ? (
              <Box
                className={classnames("c-font-color wp-container")}
                ref={refBlog}
                dangerouslySetInnerHTML={{
                  __html: isMounted
                    ? computeContentToRender()
                    : processHtmlText(computeContentToRender(), () => {
                        setIsMounted(true);
                      }),
                }}
              />
            ) : (
              <Box
                sx={{
                  ".mt-16": {
                    marginTop: 2,
                  },
                }}
              >
                <SkeletonLoader width={"100%"} height={"50px"} />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"100%"}
                  height={"50px"}
                />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"70%"}
                  height={"50px"}
                />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"90%"}
                  height={"50px"}
                />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"100%"}
                  height={"300px"}
                />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"50%"}
                  height={"50px"}
                />
                <SkeletonLoader
                  classes={"mt-16"}
                  width={"100%"}
                  height={"50px"}
                />
              </Box>
            )}
          </Box>

          <Box
            className={st["footer-nav"]}
            mb={{ xs: 3, sm: suggestedPosts ? 5 : 0 }}
          >
            {post.likes && post.postId && (
              <Box
                className={classnames(st["footer-like"])}
                mr={{ xs: 1, sm: 0 }}
              >
                {loaded ? (
                  <Like id={post.postId} likes={post.likes} />
                ) : (
                  <Box mr={2}>
                    <CircularProgress color="inherit" size={20} />
                  </Box>
                )}
              </Box>
            )}

            {post.likes && (
              <Box
                className={classnames(
                  st.decor,
                  st["decor-first"],
                  "c-font-24-24 c-font-color-11",
                )}
                component="span"
                mx={1}
              ></Box>
            )}

            <Box
              className={classnames(st["footer-share"])}
              ml={{ xs: "auto", sm: 0 }}
            >
              <Share
                url={`${appConfig.NEXT_PUBLIC_BLOG_DOMAIN}/${post.slug}`}
              />
            </Box>
          </Box>

          {/* <Box
            className={ st["footer-btns"] }
            mb={ { xs: 3, sm: suggestedPosts ? 5 : 0 } }
          >
            { post.translation.previous && (
              <Link href={ `${ post.translation.previous.slug }` }>
                <a className={ st["button-link"] }>
                  <Button
                    className={ st.button }
                    style="secondary"
                    size="small"
                  >
                    <span>
                      <Icon style={ { transform: "rotate(-90deg)" } } name="arrow-straight" size="16"/>

                      Previous article
                    </span>
                  </Button>
                </a>
              </Link>
            ) }

            { post.translation.next && (
              <Link href={ `${ post.translation.next.slug }` }>
                <a className={ st["button-link"] }>
                  <Button
                    className={ st.button }
                    style="secondary"
                    size="small"
                  >
                    <span>
                      Next article

                      <Icon style={ { transform: "rotate(90deg)" } } name="arrow-straight" size="16"/>
                    </span>
                  </Button>
                </a>
              </Link>
            ) }
          </Box> */}

          <Box ref={ref} className={st.posts}>
            <Box
              className={classnames(
                st.suggest,
                "c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color",
              )}
              component="h3"
              mb={3}
            >
              Suggested articles
            </Box>

            {isLoadingSuggestions ? (
              <Box>
                <SkeletonLoader width={"100%"} height={"186px"} />
              </Box>
            ) : (
              <PostsSection data={suggestedPosts} />
            )}
          </Box>

          <Box className={st.right}>
            {post.translation.customAuthors.nodes &&
              post.translation.customAuthors.nodes[0] && (
                <Box className={st.author} mb={{ xs: 5, sm: 5 }}>
                  <AuthorSection
                    currentPostSlug={post.slug}
                    author={post.translation.customAuthors.nodes[0]}
                    type="links"
                  />
                </Box>
              )}

            {post.translation.tags.nodes &&
              post.translation.tags.nodes.length > 0 && (
                <Box
                  className={classnames(st.tags)}
                  mb={{ xs: suggestedPosts ? 5 : 0, md: 0 }}
                >
                  <Box className={st["tags-desctop"]}>
                    <TagsSection
                      title="Article tags"
                      type="show"
                      tags={post.translation.tags.nodes.map((tag, it) => ({
                        id: it,
                        title: tag.name,
                        slug: tag.slug,
                        selectStatus: false,
                      }))}
                    />
                  </Box>

                  <Box className={st["tags-mobile"]}>
                    <TagsSection
                      title="Article tags"
                      type="show-slide"
                      tags={post.translation.tags.nodes.map((tag, it) => ({
                        id: it,
                        title: tag.name,
                        slug: tag.slug,
                        selectStatus: false,
                      }))}
                    />
                  </Box>
                </Box>
              )}
          </Box>
        </Box>
      </div>
      <Script
        id={`Blog post ${post.postId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": router.pathname,
            },
            headline:
              post && post.translation.title
                ? post.translation.title
                : "Blog Article Headline",
            image:
              post && post?.translation.featuredImage?.node?.sourceUrl
                ? [post.translation.featuredImage.node.sourceUrl]
                : [],
            datePublished: post
              ? new Date(post.dateGmt).toString()
              : new Date(),
            dateModified: post ? new Date(post.dateGmt).toString() : new Date(),
            author: {
              "@type": "Person",
              name:
                post && post.translation.customAuthors.nodes.length
                  ? post.translation.customAuthors.nodes[0].name
                  : "Author",
            },
            publisher: {
              "@type": "Organization",
              name: post ? post.translation.title : "Blog Article",
              logo: {
                "@type": "ImageObject",
                url:
                  post && post.translation.featuredImage
                    ? post.translation.featuredImage.node.sourceUrl.replace(
                        ".io",
                        ".com",
                      )
                    : "Blog Article Image",
              },
            },
            description: post.translation.tags.nodes
              .map(node => node.name)
              .join(","),
          }),
        }}
      />
    </>
  );
};

const processHtmlText = (htmlText: string, cb: () => void) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  const images = doc.querySelectorAll("img");

  images.forEach(img => {
    const originalSrc = img.getAttribute("src");
    const originalSrcSet = img.getAttribute("srcset");
    if (originalSrc) {
      img.setAttribute("data-original-src", originalSrc);
      img.setAttribute("data-original-srcset", originalSrcSet);
      img.src = "/default";
      img.srcset = "/default";
    }
  });

  cb();

  return doc.documentElement.innerHTML;
};

export default Article;
