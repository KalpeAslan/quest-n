import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
} from "@apollo/client";
import { appConfig } from "@/app.config";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const cache = new InMemoryCache({
  resultCaching: false,
});

const link = createHttpLink({
  uri: `${appConfig.NEXT_PUBLIC_BLOG_HOST}/graphql`,
});

export const client = new ApolloClient({
  connectToDevTools: false,
  link,
  cache,
  defaultOptions,
});
