import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/database';

describe('BookController', () => {
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

  describe('GET /books', () => {
    it('should return list of books with 200 status', async () => {
      const response = await request(app)
        .get('/books')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.offset).toBe(0);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/books?limit=5&offset=10')
        .expect(200);

      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(10);
    });
  });

  describe('POST /books', () => {
    it('should create a new book with 201 status', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/books')
        .send(bookData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(bookData.title);
      expect(response.body.data.author).toBe(bookData.author);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/books')
        .send({ title: 'Test Book' }) // Missing author
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 for empty title', async () => {
      const response = await request(app)
        .post('/books')
        .send({ title: '', author: 'Test Author' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
