import { map, pipe, Repeater } from 'graphql-yoga';

import type { Context } from '../schema';
import { BookService, IBook } from '../services/book.service';

export const fetchBooksSubscription = {
  subscribe: (_: any, __: any, context: Context) =>
    pipe(
      Repeater.merge([
        undefined,
        context.pubSub.subscribe('books:updated'),
      ]),
      map(() => BookService.getBooks()),
    ),
  resolve: (books: IBook[]) => books,
};

export const fetchBookSubscription = {
  subscribe: (_: any, { id }: { id: string }, context: Context) =>
    pipe(
      Repeater.merge([
        undefined,
        context.pubSub.subscribe('books:updated'),
      ]),
      map(() => BookService.getBook(id)),
    ),
  resolve: (book: IBook | null) => book,
};

export const fetchLikesForBookSubscription = {
  subscribe: (_: any, { id }: { id: string }, context: Context) =>
    pipe(
      Repeater.merge([
        undefined,
        context.pubSub.subscribe('books:updated'),
      ]),
      map(() => BookService.getLikesForBook(id)),
    ),
  resolve: (links: number | null) => links ?? 0,
};

export const likeBookMutation = (_: any, { id }: { id: string }, context: Context) => {
  const likedBook = BookService.likeBook(id);

  context.pubSub.publish('books:updated');

  return likedBook;
}

export const unlikeBookMutation = (_: any, { id }: { id: string }, context: Context) => {
  const unlikedBook = BookService.unlikeBook(id);

  context.pubSub.publish('books:updated');

  return unlikedBook;
}

export const addBookMutation = (_: any, { title, author }: { title: string, author: string }, context: Context) => {
  const addedBook = BookService.addBook(
    title,
    author,
  )

  context.pubSub.publish('books:updated');

  return addedBook;
}

export const removeBookMutation = (_: any, { id }: { id: string }, context: Context) => {
  const book = BookService.removeBook(id);

  context.pubSub.publish('books:updated');

  return book;
}

export const fetchBooksQuery = () => BookService.getBooks();
export const fetchBookQuery = (_: any, { id }: { id: string }) => BookService.getBook(id);