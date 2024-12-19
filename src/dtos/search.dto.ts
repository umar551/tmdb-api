import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class SearchMovieDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  minRating?: number;
} 