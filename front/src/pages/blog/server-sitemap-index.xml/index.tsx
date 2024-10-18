import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import { client } from "@/utils";
import { GET_POSTS_BY_TAGS, GET_AUTHORS } from "@modules/blog/queries";
import { appConfig } from "@/app.config";
import { computeLanguage } from "@modules/blog/queries/blog.utils";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const siteUrl = appConfig.NEXT_PUBLIC_BLOG_DOMAIN;

  const { data: postsResponse } = await client.query({
    query: GET_POSTS_BY_TAGS,
    variables: {
      tags: "",
      offset: 0,
      size: 1000,
      language: computeLanguage(ctx.locale),
    },
  });

  const { data: authorsResponse } = await client.query({
    query: GET_AUTHORS,
  });

  const postFields: ISitemapField[] = postsResponse?.posts.nodes.map(
    (data: any) => ({
      loc: `${siteUrl}/${data.slug}`,
      lastmod: new Date().toISOString(),
    }),
  );

  const authorsFields: ISitemapField[] =
    authorsResponse.customAuthors.nodes.map((data: any) => ({
      loc: `${siteUrl}/authors/${data.slug}`,
      lastmod: new Date().toISOString(),
    }));

  return getServerSideSitemap(ctx, [...postFields, ...authorsFields]);
};

export default function SitemapIndex() {}
