import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Books';
import { CacheService } from './CacheService';

export class BookService {
  private bookRepository: Repository<Book>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async getAllBooks(limit: number = 10, offset: number = 0): Promise<Book[]> {
    const cacheKey = `books:${limit}:${offset}`;
    
    // Try cache first - cache-first strategy as required
    const cached = await CacheService.get<Book[]>(cacheKey);
    if (cached) {
      console.log('Cache hit for books');
      return cached;
    }

    // Cache miss - fetch from database
    console.log('Cache miss - fetching from database');
    const books = await this.bookRepository.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' }
    });

    // Populate cache
    await CacheService.set(cacheKey, books);
    
    return books;
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    const book = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(book);
    
    // Invalidate books cache when new book is added
    await CacheService.invalidatePattern('books:*');
    
    return savedBook;
  }

  async getBookById(id: string): Promise<Book | null> {
    return await this.bookRepository.findOne({ where: { id } });
  }
}
