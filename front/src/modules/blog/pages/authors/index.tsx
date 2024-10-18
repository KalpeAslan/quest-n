import { Box } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { client } from "@/utils";
import { GET_AUTHORS, GET_PAGE_SEO } from "@modules/blog/queries";
import { IAuthorItem, IPageSEO } from "@models";
import { AuthorsStylesWrapper } from "./authors.styles";
import { BreadCrumbs } from "@/modules/blog/components/breadcrumbs";
import { AuthorSection } from "@modules/blog/components/pages";
import { usePrevious } from "@hooks/usePrevious";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { computeLanguage } from "@modules/blog/queries/blog.utils";

export const getServerSideProps = async ({ locale }) => {
  try {
    const { data: pageSeoResponse } = await client.query({
      query: GET_PAGE_SEO,
      variables: {
        name: "authors",
      },
    });

    const { data: authorsResponse } = await client.query({
      query: GET_AUTHORS,
      variables: {
        language: computeLanguage(locale),
      },
    });

    return {
      props: {
        authors: authorsResponse.customAuthors.nodes,
        seoData: pageSeoResponse.pages.nodes,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

type Props = {
  authors: IAuthorItem[];
  seoData: IPageSEO[];
};

const Authors: NextPage<Props> = ({ authors: authorsProp, seoData }: Props) => {
  console.log("authorsProp", authorsProp);
  const [authors, setAuthors] = useState<IAuthorItem[]>(authorsProp || []);

  const { locale } = useRouter();
  const prevLang = usePrevious(locale);

  useEffect(() => {
    if (prevLang !== undefined && prevLang !== locale) {
      try {
        client
          .query({
            query: GET_AUTHORS,
            variables: {
              language: computeLanguage(locale),
            },
          })
          .then(res => res.data)
          .then((data: any) =>
            setAuthors(prevState => data.customAuthors.nodes || prevState),
          );
      } catch (e) {
        console.log("Error: ", e, "authors.tsx");
      }
    }
  }, [locale]);

  const links = [
    {
      id: 1,
      title: "Blog",
      link: "/",
    },
    {
      id: 2,
      title: "Authors",
      link: "authors",
    },
  ];

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

      <AuthorsStylesWrapper>
        <div className="c-wrap">
          <Box mt={{ xs: 3, sm: 5 }} mb={5}>
            <Box className={"header-breadcrumbs"} mb={3}>
              <BreadCrumbs links={links} />
            </Box>

            <Box
              component="h1"
              className="c-font-32-38 c-md-font-48-56 c-fw-500 c-font-color"
              mb={3}
            >
              Authors
            </Box>

            {authors.length > 0 && (
              <section className={"content"}>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                >
                  <Masonry gutter="12px">
                    {authors.map((author: IAuthorItem) => (
                      <div className={"item"} key={author.databaseId}>
                        <AuthorSection author={author} type="links" />
                      </div>
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              </section>
            )}
          </Box>
        </div>
      </AuthorsStylesWrapper>
    </>
  );
};

export default Authors;
