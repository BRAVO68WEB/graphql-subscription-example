import { nanoid } from "napi-nanoid";

export interface IBookRaw {
    title: string;
    author: string;
}

export type IBook = {
    id: string;
    likes: number;
} & IBookRaw;

const RawBooks: IBookRaw[] = [
    {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
    },
    {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
    },
    {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
    },
    {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
    }
]

const Books: IBook[] = RawBooks.map((book) => ({
    id: nanoid(),
    likes: 0,
    ...book,
}));

export class BookService {
    public static getBooks(): IBook[] {
        return Books;
    }

    public static getBook(id: string): IBook | null {
        return Books.find((book) => book.id === id) || null;
    }

    public static addBook(title: string, author: string): IBook {
        const id = nanoid();

        Books.push({
            id,
            title,
            author,
            likes: 0,
        });

        return {
            id,
            title,
            author,
            likes: 0,
        };
    }

    public static removeBook(id: string): IBook | null {
        const bookIndex = Books.findIndex((book) => book.id === id);
        if (bookIndex === -1) {
            return null;
        }

        const [book] = Books.splice(bookIndex, 1);

        return book;
    }

    public static likeBook(id: string): IBook | null {
        const book = Books.find((book) => book.id === id);
        if (!book) {
            return null;
        }

        book.likes += 1;

        return book;
    }

    public static unlikeBook(id: string): IBook | null {
        const book = Books.find((book) => book.id === id);
        if (!book) {
            return null;
        }

        book.likes -= 1;

        return book;
    }

    public static getLikesForBook(id: string): number {
        const book = Books.find((book) => book.id === id);
        if (!book) {
            return 0;
        }

        return book.likes;
    }
}
