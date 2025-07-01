import { DataSource } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

import { Book } from "./entities/Books";
import { Review } from "./entities/Review";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "book_reviews",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [Book, Review],
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: 'migrations',
});
