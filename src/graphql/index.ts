import { randomUUID } from "node:crypto";

import { createYoga } from "graphql-yoga";
import { costLimitPlugin } from '@escape.tech/graphql-armor-cost-limit';
import { maxAliasesPlugin } from '@escape.tech/graphql-armor-max-aliases';
import { maxDepthPlugin } from '@escape.tech/graphql-armor-max-depth';
import { maxDirectivesPlugin } from '@escape.tech/graphql-armor-max-directives';
import { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';

import { GraphQLError } from "graphql";

import { Context, pubSub, schema } from "../schema";
// import { useJWT, createInlineSigningKeyProvider, extractFromHeader } from "@graphql-yoga/plugin-jwt";

export const authenErr = () =>
    new GraphQLError("Authentication error", {
      extensions: { code: "UNAUTHENTICATED" },
    });

export const yoga = createYoga<Context>({
    schema,
    logging: false,
    context: async (_ctx) => {
        const requestId = randomUUID();

        return { requestId, pubSub };
    },
    graphiql: {
        subscriptionsProtocol: 'WS',
    },
    plugins: [
        costLimitPlugin(),
        maxTokensPlugin(),
        maxDepthPlugin(),
        maxDirectivesPlugin(),
        maxAliasesPlugin(),
        // useJWT({
        //     singingKeyProviders: [
        //         createInlineSigningKeyProvider('secret'),
        //     ],
        //     extendContext: true,
        //     tokenLookupLocations: [
        //         extractFromHeader({
        //             name: 'authorization',
        //             prefix: 'Bearer',
        //         })
        //     ],
        //     reject: {
        //         invalidToken: false,
        //         missingToken: false
        //     }
        // })
    ]
});