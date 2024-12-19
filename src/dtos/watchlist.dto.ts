import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToWatchlistDto {
  @ApiProperty()
  @IsNumber()
  movieId: number;
}

export class WatchlistResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  movieId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  addedAt: Date;

  @ApiProperty()
  movie?: {
    id: number;
    title: string;
    posterPath: string;
  };
} 