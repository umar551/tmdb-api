import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  tmdbRating: number;

  @ApiProperty()
  posterPath: string;

  @ApiProperty()
  averageRating?: number;

  @ApiProperty({ type: [String] })
  genres: string[];
} 