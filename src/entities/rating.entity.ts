import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 2, scale: 1 })
  value: number;

  @ManyToOne(() => User, user => user.ratings)
  user: User;

  @ManyToOne(() => Movie, movie => movie.ratings)
  movie: Movie;

  @Column()
  createdAt: Date;
} 