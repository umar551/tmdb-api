import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../../entities/movie.entity';
import { Genre } from '../../entities/genre.entity';
import { Rating } from '../../entities/rating.entity';
import { Watchlist } from '../../entities/watchlist.entity';
import { TmdbService } from './tmdb.service';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Genre, Rating, Watchlist]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService],
})
export class MoviesModule {} 