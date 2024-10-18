import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
  query GET_AUTHORS($language: LanguageCodeEnum = EN) {
    customAuthors {
      nodes {
        databaseId
        name
        slug
        description
        authorsImage {
          authorImg {
            sourceUrl(size: LARGE)
          }
        }
        authorsSocialLinks {
          facebookUrl
          instagramUrl
          redditUrl
          linkedinUrl
          twitterUrl
          discordUrl
          mediumUrl
        }
        posts {
          nodes {
            translation(language: $language) {
              postId
              slug
              title
              dateGmt
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

export const GET_AUTHOR_BY_SLUG = gql`
  query GET_AUTHOR($id: ID = "") {
    customAuthor(id: $id, idType: SLUG) {
      name
      slug
      description
      authorsImage {
        authorImg {
          sourceUrl(size: LARGE)
        }
      }
      authorsSocialLinks {
        facebookUrl
        fieldGroupName
        instagramUrl
        linkedinUrl
        redditUrl
        twitterUrl
        discordUrl
        mediumUrl
      }
      seo {
        title
        metaDesc
        metaKeywords
        opengraphUrl
        opengraphType
      }
    }
  }
`;
