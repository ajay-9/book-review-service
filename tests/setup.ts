import { config } from 'dotenv';

// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
config();
