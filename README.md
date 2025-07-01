# Book Review Service API

A robust RESTful API service for managing books and reviews, built with **Express.js**, **TypeScript**, **PostgreSQL**, and **Redis**. This service provides comprehensive book and review management with caching, proper error handling, and extensive test coverage.

- **RESTful API**: 4 endpoints for book and review management
- **Database**: PostgreSQL with TypeORM for data persistence
- **Caching**: Redis integration with cache-first strategy and graceful fallback
- **Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Comprehensive unit and integration tests
- **Error Handling**: Robust error handling with proper HTTP status codes

## 🛠 Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis with ioredis
- **Testing**: Jest + supertest
- **Documentation**: Swagger/OpenAPI

### Prerequisites

- **Node.js** (>= 18.0.0)
- **PostgreSQL** (>= 12.0)
- **Redis** (>= 6.0)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-review-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files based on the examples:

```bash
# Copy example environment files
Create `.env` file:
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=book_reviews

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Cache Configuration
CACHE_TTL=300
```

### 4. Database Setup

#### Create PostgreSQL Database

```bash
Create database
psql -U postgres -c "CREATE DATABASE book_reviews;"
```

#### Run Migrations

```bash
# Run database migrations
npm run migration:run
```

### 5. Start Redis

```bash
brew services start postgresql redis # macOS
sudo systemctl start postgresql redis # Linux
```

## Running the Application

### Development Mode

```bash
# Start with auto-reload
npm run dev
```

The API will be available at:
- **API Base URL**: `http://localhost:3000/api/v1`
- **API Documentation**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/api/v1/health`

## 🧪 Running Tests

### All Tests

```bash
npm test
```
### Run specific test suites

```bash
npm run test:unit
npm run test:integration
```




### Indexes
- `reviews.bookId` - **Primary optimization index** for fetching reviews by book


## 🔄 Caching Strategy

### Cache-First Approach

1. **Cache Hit**: Return data directly from Redis
2. **Cache Miss**: Fetch from PostgreSQL, populate cache
3. **Cache Down**: Graceful fallback to database only

### Error Handling

- Redis connection failures don't break the API
- Cache operations failure logs warnings but continues
- Graceful degradation to database-only mode

## 📚 API Usage Examples

### Create a Book

```bash
curl -X POST http://localhost:3000/books
-H "Content-Type: application/json"
-d '{"title": "Test Book"}'
```

### Get All Books

```bash
curl http://localhost:3000/books
```

### Create a Review

```bash
curl -X POST http://localhost:3000/books/{book-id}/reviews
-H "Content-Type: application/json"
-d '{"reviewerName": "Name123", "rating": 5}'
```

### Get Reviews for a Book

```bash
curl http://localhost:3000/books/{book-id}/reviews
```

## 🛡️ Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Performance Considerations

### Database Optimization
- **Index on reviews.bookId**: Optimized for fetching reviews by book 
- **Foreign key constraints**: Ensures data integrity between books and reviews
- **Connection pooling**: TypeORM manages PostgreSQL connections efficiently

### Caching Strategy
- **Cache-first approach**: GET /books checks Redis before database 
- **Graceful degradation**: Service continues when Redis is down

### Application Performance
- **Async/await patterns**: Non-blocking I/O operations throughout
- **Error boundaries**: Isolated error handling prevents cascading failures
- **TypeScript compilation**: Compile-time optimizations and type safety

### Overall Optimizations
- **Index implementation**: `CREATE INDEX IDX_REVIEWS_BOOK_ID ON reviews(bookId)`
- **Cache-miss handling**: Database fallback with cache population
- **Error handling**: Robust fallback strategies for external service failures
- **Migration-based schema**: Version-controlled database changes for consistency


## 🚀 Deployment Considerations


### Environment Variables

Ensure all required environment variables are set:

- Database connection details
- Redis connection details
- Application port and environment
- Cache TTL settings

### Database Migrations

Always run migrations before starting the application:

```bash
npm run migration:run
```