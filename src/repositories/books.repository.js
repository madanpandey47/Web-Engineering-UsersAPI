import { InMemoryRepository } from './in-memory.repository.js';

export class BooksRepository extends InMemoryRepository {
  findByIsbn(isbn) {
    if (!isbn) return null;
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    return this.findOne((book) => book.isbn && book.isbn.replace(/[-\s]/g, '') === cleanIsbn);
  }
}
