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
    link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/r-strawser/near-future-nft', fetch }),
    cache: new InMemoryCache()
});

async function combine() {
    let tokens: any[] = [];
    for (let i = 0; i < 3000; i += 1000) {
        let { data } = await client
            .query({
                query: gql`{
          tokens(first: 1000, skip: ${i}) {
            id
            ownerId
            burned
          }
        }
          `
            });
        tokens = tokens.concat(data.tokens.filter((t:any) => t.burned === "false").map((t: any) => ({ id: t.id, ownerId: t.ownerId })))
    }
    return tokens;
}

async function main() {
  let res = await combine();
  console.log(res)
}

void main();