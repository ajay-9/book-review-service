import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Book } from './Books';

@Entity('reviews')
@Index(['bookId']) // Index for optimization as required
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  reviewerName!: string;

  @Column({ type: 'int', width: 1 })
  rating!: number;

  @Column({ type: 'uuid' })
  @Index() // Index on bookId for optimization
  bookId!: string;

  @ManyToOne(() => Book, book => book.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book!: Book;
}
