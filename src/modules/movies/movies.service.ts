import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../../entities/movie.entity';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TmdbService } from './tmdb.service';
import { SearchMovieDto } from '../../dtos/search.dto';

interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string;
  backdrop_path: string;
  original_language: string;
  adult: boolean;
  video: boolean;
  genre_ids: number[];
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private tmdbService: TmdbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(page: number = 1, limit: number = 10, genre?: string) {
    const cacheKey = `movies_${page}_${limit}_${genre}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.ratings', 'rating');

    if (genre) {
      queryBuilder.where('genre.name = :genre', { genre });
    }

    const [movies, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      data: movies,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };

    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }

  async syncWithTmdb() {
    const tmdbMovies = await this.tmdbService.getPopularMovies();
    const movies = tmdbMovies.map(tmdbMovie => this.mapTmdbMovie(tmdbMovie));
    return await this.moviesRepository.save(movies);
  }

  private mapTmdbMovie(tmdbMovie: TmdbMovie): Partial<Movie> {
    return {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      overview: tmdbMovie.overview,
      releaseDate: new Date(tmdbMovie.release_date),
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      originalLanguage: tmdbMovie.original_language,
      adult: tmdbMovie.adult,
      video: tmdbMovie.video,
      genres: []
    };
  }

  async searchMovies(searchDto: SearchMovieDto) {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.ratings', 'rating');

    if (searchDto.query) {
      queryBuilder.where(
        'LOWER(movie.title) LIKE LOWER(:query) OR LOWER(movie.overview) LIKE LOWER(:query)',
        { query: `%${searchDto.query}%` }
      );
    }

    if (searchDto.genre) {
      queryBuilder.andWhere('genre.name = :genre', { genre: searchDto.genre });
    }

    if (searchDto.minRating) {
      queryBuilder
        .addSelect('AVG(rating.value)', 'avgRating')
        .groupBy('movie.id')
        .having('AVG(rating.value) >= :minRating', { minRating: searchDto.minRating });
    }

    const [movies, total] = await queryBuilder
      .skip(((searchDto.page || 1) - 1) * (searchDto.limit || 10))
      .take(searchDto.limit || 10)
      .getManyAndCount();

    return {
      data: movies,
      total,
      page: searchDto.page || 1,
      lastPage: Math.ceil(total / (searchDto.limit || 10)),
    };
  }

  async findOneWithRating(id: number, userId: number) {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return { ...movie, userRating: movie.ratings.find(rating => rating.user.id === userId)?.value };
  }
} 