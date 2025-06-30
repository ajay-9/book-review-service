import request from 'supertest';
import app from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { BookService } from '../../src/services/BookService';

describe('ReviewController', () => {
  let bookId: string;
  const bookService = new BookService();

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Create a test book for reviews
    const book = await bookService.createBook({
      title: 'Test Book for Reviews',
      author: 'Test Author'
    });
    bookId = book.id;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('GET /books/:id/reviews', () => {
    it('should return reviews for existing book with 200 status', async () => {
      const response = await request(app)
        .get(`/books/${bookId}/reviews`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      
      const response = await request(app)
        .get(`/books/${fakeId}/reviews`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Book not found');
    });
  });

  describe('POST /books/:id/reviews', () => {
    it('should create a new review with 201 status', async () => {
      const reviewData = {
        reviewerName: 'Test Reviewer',
        rating: 5,
        comment: 'Great book!'
      };

      const response = await request(app)
        .post(`/books/${bookId}/reviews`)
        .send(reviewData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewerName).toBe(reviewData.reviewerName);
      expect(response.body.data.rating).toBe(reviewData.rating);
      expect(response.body.data.bookId).toBe(bookId);
    });

    it('should return 400 for invalid rating', async () => {
      const reviewData = {
        reviewerName: 'Test Reviewer',
        rating: 6, // Invalid rating
        comment: 'Invalid rating'
      };

      const response = await request(app)
        .post(`/books/${bookId}/reviews`)
        .send(reviewData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Rating must be between 1 and 5');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post(`/books/${bookId}/reviews`)
        .send({ rating: 5 }) // Missing reviewerName
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const reviewData = {
        reviewerName: 'Test Reviewer',
        rating: 5
      };

      const response = await request(app)
        .post(`/books/${fakeId}/reviews`)
        .send(reviewData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Book not found');
    });
  });
});
