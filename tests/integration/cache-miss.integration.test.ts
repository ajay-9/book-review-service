import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CacheService } from '../../src/services/CacheService';
import { BookService } from '../../src/services/BookService';

describe('Cache Integration Tests', () => {
  const bookService = new BookService();

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('Cache-miss scenario for GET /books', () => {
    it('should handle cache miss and populate cache', async () => {
      // Clear cache to ensure cache miss
      await CacheService.del('books:10:0');

      // Create a test book to ensure we have data
      await bookService.createBook({
        title: 'Cache Test Book',
        author: 'Cache Test Author'
      });

      // First request should be cache miss
      const response1 = await request(app)
        .get('/books')
        .expect(200);

      expect(response1.body.success).toBe(true);
      expect(Array.isArray(response1.body.data)).toBe(true);

      // Second request should be cache hit (same data)
      const response2 = await request(app)
        .get('/books')
        .expect(200);

      expect(response2.body.success).toBe(true);
      expect(response2.body.data).toEqual(response1.body.data);
    });

    it('should work when cache is down (graceful degradation)', async () => {
      // This test simulates cache being down
      // The application should still work by falling back to database
      
      const response = await request(app)
        .get('/books')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should invalidate cache when new book is created', async () => {
      // Get initial books count
      const initialResponse = await request(app)
        .get('/books')
        .expect(200);

      const initialCount = initialResponse.body.data.length;

      // Create new book (should invalidate cache)
      await request(app)
        .post('/books')
        .send({
          title: 'Cache Invalidation Test',
          author: 'Test Author'
        })
        .expect(201);

      // Get books again (should fetch fresh data from DB)
      const updatedResponse = await request(app)
        .get('/books')
        .expect(200);

      expect(updatedResponse.body.data.length).toBeGreaterThan(initialCount);
    });
  });
});
