import { Request, Response } from 'express';
import { BookService } from '../services/BookService';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  /**
   * @swagger
   * /books:
   *   get:
   *     summary: Get all books
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *     responses:
   *       200:
   *         description: List of books
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   */
  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const books = await this.bookService.getAllBooks(limit, offset);
      
      res.status(200).json({
        success: true,
        data: books,
        pagination: {
          limit,
          offset,
          count: books.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch books'
      });
    }
  };

  /**
   * @swagger
   * /books:
   *   post:
   *     summary: Create a new book
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - author
   *             properties:
   *               title:
   *                 type: string
   *               author:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Book created successfully
   *       400:
   *         description: Validation error
   */
  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, author, description } = req.body;

      // Validation
      if (!title || !author) {
        res.status(400).json({
          success: false,
          error: 'Title and author are required'
        });
        return;
      }

      const book = await this.bookService.createBook({
        title,
        author,
        description
      });

      res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create book'
      });
    }
  };
}
