import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GET_POSTS($language: LanguageCodeEnum = EN) {
    posts {
      nodes {
        translation(language: $language) {
          title(format: RENDERED)
          excerpt(format: RENDERED)
          content(format: RENDERED)
          postId
          slug
          dateGmt
          readTime {
            readingTime
          }
          hasVideo {
            hasVideo
          }
          featuredImage {
            node {
              sourceUrl(size: LARGE)
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
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
            }
          }
          likes
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

export const GET_POSTS_BY_TAGS = gql`
  query GET_POSTS_BY_TAGS(
    $tags: String = ""
    $offset: Int = 0
    $size: Int = 10
    $language: LanguageCodeFilterEnum = EN
  ) {
    posts(
      where: {
        tag: $tags
        offsetPagination: { size: $size, offset: $offset }
        language: $language
      }
    ) {
      nodes {
        title(format: RENDERED)
        excerpt(format: RENDERED)
        content(format: RENDERED)
        postId
        slug
        dateGmt
        readTime {
          readingTime
        }
        hasVideo {
          hasVideo
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
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
          }
        }
        likes
      }
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;

export const GET_POSTS_BY_AUTHOR = gql`
  query GET_POSTS_BY_AUTHOR(
    $terms: [String] = ""
    $offset: Int = 0
    $size: Int = 10
    $language: LanguageCodeFilterEnum = EN
  ) {
    posts(
      where: {
        offsetPagination: { offset: $offset, size: $size }
        taxQuery: {
          taxArray: { field: SLUG, taxonomy: CUSTOMAUTHOR, terms: $terms }
        }
        language: $language
      }
    ) {
      nodes {
        title(format: RENDERED)
        excerpt(format: RENDERED)
        content(format: RENDERED)
        postId
        slug
        likes
        dateGmt
        readTime {
          readingTime
        }
        hasVideo {
          hasVideo
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
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

export const GET_POSTS_BY_CATEGORY = gql`
  query GET_POSTS_BY_CATEGORY(
    $categoryName: String = ""
    $offset: Int = 0
    $size: Int = 10
    $language: LanguageCodeFilterEnum = EN
  ) {
    posts(
      where: {
        categoryName: $categoryName
        offsetPagination: { size: $size, offset: $offset }
        language: $language
      }
    ) {
      nodes {
        title(format: RENDERED)
        excerpt(format: RENDERED)
        content(format: RENDERED)
        postId
        slug
        likes
        dateGmt
        readTime {
          readingTime
        }
        hasVideo {
          hasVideo
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
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
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GET_POST_BY_SLUG($slug: ID!, $language: LanguageCodeEnum = EN) {
    post(id: $slug, idType: SLUG) {
      slug
      likes
      postId
      dateGmt
      hasVideo {
        hasVideo
      }
      readTime {
        readingTime
      }
      translation(language: $language) {
        tags {
          nodes {
            name
            slug
          }
        }
        title(format: RENDERED)
        content(format: RENDERED)
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
          }
        }
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
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
  }
`;
