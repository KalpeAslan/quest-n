export interface IPostItem {
  postId: number;
  likes: string; // количество лайков в посте
  customAuthors: {
    nodes: IAuthorItem[] | null | undefined;
  };
  previous: {
    slug: string;
  } | null;
  next: {
    slug: string;
  } | null;
  dateGmt: string;
  readTime: {
    readingTime: number | null;
  };
  hasVideo: {
    hasVideo: boolean;
  };
  title: string | null;
  excerpt: string | null;
  content: string | null;
  featuredImage: IFeaturedImage | null;
  slug: string;
  tags: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  seo: {
    title: string;
    metaDesc: string;
    metaKeywords: string;
    opengraphUrl: string;
    opengraphType: string;
  };
}

export interface IPostItemTranslated {
  slug: string;
  likes: number;
  postId: string;
  dateGmt: string;
  hasVideo: {
    hasVideo: boolean;
  };
  readTime: {
    readingTime: string;
  };
  translation: {
    tags: {
      nodes: Array<{
        name: string;
        slug: string;
      }>;
    };
    title: string;
    content: string;
    customAuthors: {
      nodes: IAuthorItem[] | null | undefined;
    };
    featuredImage: {
      node: {
        sourceUrl: string;
      };
    };
    seo: {
      title: string;
      metaDesc: string;
      metaKeywords: string;
      opengraphUrl: string;
      opengraphType: string;
    };
  };
}

export interface ITagItem {
  id: number;
  selectStatus: boolean;
  slug: string;
  title: string;
}

export interface IAuthorItem {
  databaseId: number;
  name: string;
  slug: string;
  description: string | null;
  authorsImage: {
    authorImg: {
      sourceUrl: string | null;
    } | null;
  } | null;
  authorsSocialLinks: {
    facebookUrl: string | null;
    instagramUrl: string | null;
    redditUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    discordUrl: string | null;
    mediumUrl: string | null;
  };
  posts: {
    nodes:
      | Array<{
          translation: IPostItem[] | null;
        }>
      | IPostItem[];
    pageInfo: {
      offsetPagination: {
        total: number | null;
      };
    };
  };
  seo: {
    title: string;
    metaDesc: string;
    metaKeywords: string;
    opengraphUrl: string;
    opengraphType: string;
  };
}

export interface IPageSEO {
  seo: {
    title: string;
    metaDesc: string;
    metaKeywords: string;
    opengraphUrl: string;
    opengraphType: string;
  };
  featuredImage: IFeaturedImage | null;
}

interface IFeaturedImage {
  node: {
    sourceUrl: string | null;
  } | null;
}
