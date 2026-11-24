import { conflict, notFound } from '../utils/http-error.js';
import { paginate, parsePagination, sortItems } from '../utils/query.js';

const SORTABLE_FIELDS = ['title', 'author', 'price', 'createdAt'];

const withDefaults = (book) => ({
  ...book,
  isbn: book.isbn ?? null,
  stock: book.stock ?? 0,
  description: book.description ?? null,
});

export class BooksService {
  constructor(booksRepository) {
    this.books = booksRepository;
  }

  async list(query = {}) {
    let items = await this.books.findAll();

    if (typeof query.q === 'string' && query.q.trim()) {
      const needle = query.q.trim().toLowerCase();
      items = items.filter((b) =>
        `${b.title} ${b.author} ${b.isbn ?? ''}`.toLowerCase().includes(needle),
      );
    }

    items = sortItems(items, query.sort ?? 'title', SORTABLE_FIELDS);
    const page = paginate(items, parsePagination(query));
    return page;
  }

  async getById(id) {
    const book = await this.books.findById(id);
    if (!book) throw notFound(`Book ${id} does not exist`);
    return book;
  }

  async create(data) {
    if (data.isbn) {
      await this.#assertIsbnAvailable(data.isbn);
    }
    const book = await this.books.create(withDefaults(data));
    return book;
  }

  async update(id, changes) {
    await this.getById(id);
    if (changes.isbn) {
      await this.#assertIsbnAvailable(changes.isbn, id);
    }
    return await this.books.update(id, changes);
  }

  async remove(id) {
    await this.getById(id);
    await this.books.delete(id);
  }

  async #assertIsbnAvailable(isbn, exceptId) {
    const existing = await this.books.findByIsbn(isbn);
    if (existing && existing.id !== exceptId) {
      throw conflict(`Book with ISBN ${isbn} is already registered`);
    }
  }
}
