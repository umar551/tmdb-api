import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@Entity()
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.watchlist)
  user: User;

  @ManyToOne(() => Movie, movie => movie.watchlists)
  movie: Movie;

  @Column()
  addedAt: Date;
} 