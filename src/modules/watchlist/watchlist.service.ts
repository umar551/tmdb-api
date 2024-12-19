import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from '../../entities/watchlist.entity';
import { Movie } from '../../entities/movie.entity';
import { AddToWatchlistDto } from '../../dtos/watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async addToWatchlist(userId: number, addToWatchlistDto: AddToWatchlistDto) {
    const movie = await this.moviesRepository.findOne({
      where: { id: addToWatchlistDto.movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if movie is already in watchlist
    const existing = await this.watchlistRepository.findOne({
      where: {
        movie: { id: movie.id },
        user: { id: userId },
      },
    });

    if (existing) {
      throw new ConflictException('Movie already in watchlist');
    }

    const watchlistItem = this.watchlistRepository.create({
      movie,
      user: { id: userId },
      addedAt: new Date(),
    });

    return this.watchlistRepository.save(watchlistItem);
  }

  async removeFromWatchlist(userId: number, movieId: number) {
    const watchlistItem = await this.watchlistRepository.findOne({
      where: {
        movie: { id: movieId },
        user: { id: userId },
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException('Movie not found in watchlist');
    }

    await this.watchlistRepository.remove(watchlistItem);
    return { success: true };
  }

  async getUserWatchlist(userId: number, page: number = 1, limit: number = 10) {
    const [items, total] = await this.watchlistRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['movie'],
      skip: (page - 1) * limit,
      take: limit,
      order: { addedAt: 'DESC' },
    });

    return {
      items: items.map(item => ({
        id: item.id,
        movieId: item.movie.id,
        addedAt: item.addedAt,
        movie: {
          id: item.movie.id,
          title: item.movie.title,
          posterPath: item.movie.posterPath,
        },
      })),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async isInWatchlist(userId: number, movieId: number): Promise<boolean> {
    const count = await this.watchlistRepository.count({
      where: {
        user: { id: userId },
        movie: { id: movieId },
      },
    });
    return count > 0;
  }
} 