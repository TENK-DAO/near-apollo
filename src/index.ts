import fetch from 'cross-fetch';
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    gql
} from "@apollo/client";

import { Context } from "near-cli/context"

import { Contract } from "tenk-nft";

const client = new ApolloClient({
    link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/r-strawser/near-future-nft', fetch }),
    cache: new InMemoryCache()
});

async function combine(total: number) {
    let tokens: any[] = [];
    for (let i = 0; i < total; i += 1000) {
        let { data } = await client
            .query({
                query: gql`{
          tokens(first: 1000, skip: ${i}, where: { burned: "false"}) {
            id
            ownerId
          }
        }
          `
            });
        tokens = tokens.concat(data.tokens)
    }
    return tokens;
}

export async function main({ account }: Context) {
    if (!account) {
        console.error("need --accountId");
        return;
    }
    let contract = new Contract(account, account ?.accountId);
    let res = await combine(parseInt(await contract.nft_total_supply()));
    console.log(res)
}

