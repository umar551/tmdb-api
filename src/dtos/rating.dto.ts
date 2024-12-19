import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  value: number;

  @ApiProperty()
  @IsNumber()
  movieId: number;
}

export class RatingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  movieId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
} 