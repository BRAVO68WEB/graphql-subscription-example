import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { createPubSub, createSchema, YogaInitialContext } from "graphql-yoga";
import { timeSubscription } from "../resolvers/dev.resolver";
import { fetchBooksQuery, fetchBookQuery, addBookMutation, fetchBooksSubscription, removeBookMutation, fetchBookSubscription, fetchLikesForBookSubscription, likeBookMutation, unlikeBookMutation } from "../resolvers/book.resolver";

const typeDefs = loadSchemaSync("./**/*.graphql", {
    loaders: [new GraphQLFileLoader()],
});

export const pubSub = createPubSub<{
  'books:updated': [];
}>();

export interface Context extends YogaInitialContext {
  pubSub: typeof pubSub;
  jwt?: string;
}

export const schema = createSchema<Context>({
  resolvers: {
      Query: {
        books: fetchBooksQuery,
        book: fetchBookQuery,
      },
      Subscription: {
        time: timeSubscription,
        fetchBooks: fetchBooksSubscription,
        fetchBook: fetchBookSubscription,
        fetchLikesForBook: fetchLikesForBookSubscription,
      },
      Mutation: {
        addBook: addBookMutation,
        removeBook: removeBookMutation,
        likeBook: likeBookMutation,
        unlikeBook: unlikeBookMutation,
      },
  },
  typeDefs,
});


  