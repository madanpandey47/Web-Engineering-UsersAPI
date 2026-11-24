import { integer, isbn13, money, string, trim } from './rules.js';

export const createBookSchema = {
  title:       { required: true,  check: string({ max: 200 }), transform: trim },
  author:      { required: true,  check: string({ max: 100 }), transform: trim },
  isbn:        { required: false, check: isbn13() },
  price:       { required: true,  check: money({ min: 0, max: 10_000 }) },
  stock:       { required: false, check: integer({ min: 0, max: 100_000 }) },
  description: { required: false, check: string({ max: 1000 }), transform: trim },
};

export const updateBookSchema = createBookSchema;
