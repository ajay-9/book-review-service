import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Book } from './Books';

@Entity('reviews')
@Index(['bookId', 'createdAt']) // Index for optimization as required
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index() // Index on bookId for optimization
  bookId!: string;

  @Column({ type: 'varchar', length: 255 })
  reviewerName!: string;

  @Column({ type: 'int', width: 1 })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  @Index() // Index on createdAt for sorting
  createdAt!: Date;

  @ManyToOne(() => Book, (book: Book) => book.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book!: Book;
}
