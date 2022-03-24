import fetch from 'cross-fetch';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({uri : 'https://api.thegraph.com/subgraphs/name/r-strawser/mr-brown-project', fetch }),
  cache: new InMemoryCache()
});

client
  .query({
    query: gql`
      query GetContracts {
          contracts {
            id
            total_minted
          }
      }
    `
  })
  .then(result => console.log(result.data));