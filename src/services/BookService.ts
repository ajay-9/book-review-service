import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Books';
import { CacheService } from './CacheService';

export class BookService {
  private bookRepository: Repository<Book>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async getAllBooks(): Promise<Book[]> {
    const cacheKey = 'books:all';
    
    // Try cache first 
    const cached = await CacheService.get<Book[]>(cacheKey);
    if (cached) {
      console.log('Cache hit for books');
      return cached;
    }

    // Cache miss - fetch from database
    console.log('Cache miss - fetching from database');
     const books = await this.bookRepository.find();

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
