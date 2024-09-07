import { createYoga } from "graphql-yoga";
import { Context, pubSub, schema } from "../schema";

export const yoga = createYoga<Context>({
    schema,
    logging: true,
    context: { pubSub },
    graphiql: {
        subscriptionsProtocol: 'WS', // use WebSockets instead of SSE
    },
});