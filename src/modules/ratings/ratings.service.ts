import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../../entities/rating.entity';
import { Movie } from '../../entities/movie.entity';
import { CreateRatingDto } from '../../dtos/rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(userId: number, createRatingDto: CreateRatingDto) {
    const movie = await this.moviesRepository.findOne({
      where: { id: createRatingDto.movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if user already rated this movie
    const existingRating = await this.ratingsRepository.findOne({
      where: {
        movie: { id: movie.id },
        user: { id: userId },
      },
    });

    if (existingRating) {
      throw new ConflictException('User has already rated this movie');
    }

    const rating = this.ratingsRepository.create({
      value: createRatingDto.value,
      movie,
      user: { id: userId },
      createdAt: new Date(),
    });

    return this.ratingsRepository.save(rating);
  }

  async getMovieAverageRating(movieId: number): Promise<number> {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .where('rating.movieId = :movieId', { movieId })
      .select('AVG(rating.value)', 'average')
      .getRawOne();

    return result.average ? parseFloat(result.average) : 0;
  }

  async getUserRating(userId: number, movieId: number): Promise<Rating> {
    return this.ratingsRepository.findOne({
      where: {
        user: { id: userId },
        movie: { id: movieId },
      },
    });
  }
} 