import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Review API',
      version: '1.0.0',
      description: 'Book Review service API',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              format: 'uuid' 
            },
            title: { 
              type: 'string' 
            }
          },
          required: ['id', 'title']
        },
        Review: {
          type: 'object',
          properties: {
            id: { 
              type: 'string', 
              format: 'uuid' 
            },
            reviewerName: { 
              type: 'string' 
            },
            rating: { 
              type: 'integer', 
              minimum: 1, 
              maximum: 5 
            },
            bookId: { 
              type: 'string', 
              format: 'uuid' 
            }
          },
          required: ['id', 'reviewerName', 'rating', 'bookId']
        }
      }
    }
  },
  apis: ['./src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('📚 Swagger documentation available at /api-docs');
};
