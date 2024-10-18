import { gql } from "@apollo/client";

export const GET_PAGE_SEO = gql`
  query GET_PPAGE_SEO($name: String = "") {
    pages(where: { name: $name }) {
      nodes {
        seo {
          metaDesc
          metaKeywords
          title
          opengraphUrl
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
      }
    }
  }
`;
