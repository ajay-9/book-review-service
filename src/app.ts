import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import { config } from 'dotenv';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { BookController } from './controllers/BookController';
import { ReviewController } from './controllers/ReviewController';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './utils/swagger';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers
const bookController = new BookController();
const reviewController = new ReviewController();

// Routes - All 4 required endpoints
app.get('/books', bookController.getAllBooks);
app.post('/books', bookController.createBook);
app.get('/books/:id/reviews', reviewController.getReviewsByBookId);
app.post('/books/:id/reviews', reviewController.createReview);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Book Review API'
  });
});

// Swagger documentation
setupSwagger(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Initialize Redis (non-blocking if fails)
    await initializeRedis();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
