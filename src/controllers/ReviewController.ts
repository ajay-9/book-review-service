import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  /**
   * @swagger
   * /books/{id}/reviews:
   *   get:
   *     summary: Get reviews for a book
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of reviews
   *       404:
   *         description: Book not found
   */
  getReviewsByBookId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const reviews = await this.reviewService.getReviewsByBookId(id);
      
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Book not found') {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews'
      });
    }
  };

  /**
   * @swagger
   * /books/{id}/reviews:
   *   post:
   *     summary: Create a review for a book
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - reviewerName
   *               - rating
   *             properties:
   *               reviewerName:
   *                 type: string
   *               rating:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *               comment:
   *                 type: string
   *     responses:
   *       201:
   *         description: Review created successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Book not found
   */
  createReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { reviewerName, rating, comment } = req.body;

      // Validation
      if (!reviewerName || !rating) {
        res.status(400).json({
          success: false,
          error: 'Reviewer name and rating are required'
        });
        return;
      }

      if (rating < 1 || rating > 5) {
        res.status(400).json({
          success: false,
          error: 'Rating must be between 1 and 5'
        });
        return;
      }

      const review = await this.reviewService.createReview(id, {
        reviewerName,
        rating,
        comment
      });

      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Book not found') {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to create review'
      });
    }
  };
}
