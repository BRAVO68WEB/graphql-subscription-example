import { createYoga } from "graphql-yoga";
import { Context, pubSub, schema } from "../schema";
// import { useJWT, extractFromHeader, createInlineSigningKeyProvider } from "@graphql-yoga/plugin-jwt";

export const yoga = createYoga<Context>({
    schema,
    logging: true,
    context: { pubSub },
    graphiql: {
        subscriptionsProtocol: 'WS', // use WebSockets instead of SSE
    },
    plugins: [
        // useJWT({
        //     singingKeyProviders: [
        //         createInlineSigningKeyProvider('secret'),
        //     ],
        //     extendContext: true,
        //     tokenLookupLocations: [
        //         extractFromHeader({
        //             name: 'authorization',
        //             prefix: 'Bearer',
        //         }),
        //         extractFromHeader({ 
        //             name: 'x-api-key', 
        //             prefix: 'API-Access' 
        //         }),
        //     ],
        //     reject: {
        //         invalidToken: true,
        //         missingToken: true,
        //     }
        // })
    ]
});