declare global {
  interface Window {
    __APOLLO_STATE__: any;
  }
}

import 'isomorphic-fetch';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

const link = new HttpLink({
  uri: 'https://www.graphqlhub.com/graphql'
});

export const webClient = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(
    typeof window !== 'undefined' && window.__APOLLO_STATE__
  )
});

export const serverClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  ssrMode: true
});
