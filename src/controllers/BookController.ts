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
   *                     $ref: '#/components/schemas/Book'
   */
  getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();
      
      res.status(200).json({
        success: true,
        data: books
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
   *     summary: Add a new book
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *     responses:
   *       201:
   *         description: Book created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Book'
   *       400:
   *         description: Validation error
   */
  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.body;

      if (!title) {
        res.status(400).json({
          success: false,
          error: 'Title is required'
        });
        return;
      }

      const book = await this.bookService.createBook({ title });

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
