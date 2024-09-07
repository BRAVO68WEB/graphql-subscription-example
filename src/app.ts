import { execute, ExecutionArgs, subscribe } from 'graphql';
import { makeBehavior } from 'graphql-ws/lib/use/uWebSockets';
import { App } from 'uWebSockets.js';
import { yoga } from './graphql';

type EnvelopedExecutionArgs = ExecutionArgs & {
  rootValue: {
    execute: typeof execute;
    subscribe: typeof subscribe;
  };
};

const wsHandler = makeBehavior({
  execute: args => (args as EnvelopedExecutionArgs).rootValue.execute(args),
  subscribe: args => (args as EnvelopedExecutionArgs).rootValue.subscribe(args),
  onSubscribe: async (ctx, msg) => {
    const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped(ctx);

    const args: EnvelopedExecutionArgs = {
      schema,
      operationName: msg.payload.operationName,
      document: parse(msg.payload.query),
      variableValues: msg.payload.variables,
      contextValue: await contextFactory(),
      rootValue: {
        execute,
        subscribe,
      },
    };

    const errors = validate(args.schema, args.document);
    if (errors.length) return errors;
    return args;
  },
});

export const app = App()
  .any('/*', yoga)
  .ws(yoga.graphqlEndpoint, wsHandler);
