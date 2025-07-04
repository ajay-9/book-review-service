import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/database';

describe('BookController', () => {
  beforeAll(async () => {
    // Initialize database for tests
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    // Clean up database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('GET /books', () => {
    it('should return list of books with 200 status', async () => {
      const response = await request(app)
        .get('/books')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return books from cache on second request', async () => {
      // First request
      const response1 = await request(app)
        .get('/books')
        .expect(200);

      // Second request should hit cache
      const response2 = await request(app)
        .get('/books')
        .expect(200);

      expect(response1.body.data).toEqual(response2.body.data);
    });
  });

  describe('POST /books', () => {
    it('should create a new book with 201 status', async () => {
      const bookData = {
        title: 'Test Book'
      };

      const response = await request(app)
        .post('/books')
        .send(bookData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(bookData.title);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/books')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 for empty title', async () => {
      const response = await request(app)
        .post('/books')
        .send({ title: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });
});
