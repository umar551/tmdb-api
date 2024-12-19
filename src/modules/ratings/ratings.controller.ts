import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, RatingResponseDto } from '../../dtos/rating.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({ status: 201, type: RatingResponseDto })
  async create(@Req() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, createRatingDto);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get average rating for a movie' })
  @ApiResponse({ status: 200, type: Number })
  async getMovieRating(@Param('movieId') movieId: number) {
    return {
      averageRating: await this.ratingsService.getMovieAverageRating(movieId),
    };
  }

  @Get('movie/:movieId/user')
  @ApiOperation({ summary: 'Get user rating for a movie' })
  @ApiResponse({ status: 200, type: RatingResponseDto })
  async getUserRating(@Req() req, @Param('movieId') movieId: number) {
    return this.ratingsService.getUserRating(req.user.id, movieId);
  }
} 