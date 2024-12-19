import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Genre } from './genre.entity';
import { Watchlist } from './watchlist.entity';
import { Rating } from './rating.entity';


@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tmdbId: number;

  @Column()
  title: string;

  @Column()
  originalTitle: string;

  @Column('text')
  overview: string;

  @Column()
  releaseDate: Date;

  @Column('decimal', { precision: 4, scale: 3 })
  voteAverage: number;

  @Column()
  voteCount: number;

  @Column()
  popularity: number;

  @Column()
  posterPath: string;

  @Column()
  backdropPath: string;

  @Column()
  originalLanguage: string;

  @Column()
  adult: boolean;

  @Column()
  video: boolean;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Rating, rating => rating.movie)
  ratings: Rating[];

  @OneToMany(() => Watchlist, watchlist => watchlist.movie)
  watchlists: Watchlist[];
} 