import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Review } from '../entities/Review';
import { BookService } from './BookService';

export class ReviewService {
  private reviewRepository: Repository<Review>;
  private bookService: BookService;

  constructor() {
    this.reviewRepository = AppDataSource.getRepository(Review);
    this.bookService = new BookService();
  }

  async getReviewsByBookId(bookId: string): Promise<Review[]> {
    // Verify book exists first
    const book = await this.bookService.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    return await this.reviewRepository.find({
      where: { bookId },
      order: { reviewerName: 'ASC' } // Order by reviewerName
    });
  }

  async createReview(bookId: string, reviewData: Partial<Review>): Promise<Review> {
    // Verify book exists
    const book = await this.bookService.getBookById(bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    // Validate rating
    if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = this.reviewRepository.create({
      ...reviewData,
      bookId
    });

    return await this.reviewRepository.save(review);
  }
}
