import fetch from 'cross-fetch';
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    gql,
    NormalizedCacheObject
} from "@apollo/client";

import { Context } from "near-cli/context"

import { Contract } from "tenk-nft";



async function combine(client: ApolloClient<NormalizedCacheObject>, total: number) {
    let tokens: any[] = [];
    for (let i = 0; i < total; i += 1000) {
        let { data } = await client
            .query({
                query: gql`{
          tokens(first: 1000, skip: ${i}, where: { burned: "false"}) {
            ownerId
            # id
          }
        }
          `
            });
        //  @ts-ignore no types
        tokens = tokens.concat(data.tokens).map(({ ownerId }) =>  ownerId )
    }
    return tokens;
}

export async function main({ account, argv }: Context) {
    if (!account) {
        console.error("need --accountId");
        return;
    }
    if (!argv || argv.length < 1) {
        console.error("missing uri argument");
        console.error("<uri url>");
        return;
    }
    const [uri] = argv;
    const client = new ApolloClient({
        link: new HttpLink({ uri, fetch }),
        cache: new InMemoryCache()
    });
    let contract = new Contract(account, account ?.accountId);
    let res = await combine(client, parseInt(await contract.nft_total_supply()));
    console.dir(res, {'maxArrayLength': null})
    console.log(new Set(res).size)
}

