import { Controller, Get, Post, Body, Query, UseGuards, Req, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MovieDto } from '../../dtos/movie.dto';
import { SearchMovieDto } from '../../dtos/search.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('movies')
@UseGuards(JwtAuthGuard)
@Controller('movies')
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number , default : 1})
  @ApiQuery({ name: 'limit', required: false, type: Number, default : 10 })
  @ApiQuery({ name: 'genre', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('genre') genre?: string,
  ) {
    return this.moviesService.findAll(page, limit, genre);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync movies with TMDB' })
  async syncWithTmdb() {
    return this.moviesService.syncWithTmdb();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by id with ratings' })
  async findOne(
    @Param('id') id: number,
    @Req() req,
  ) {
    const userId = req.user?.id;
    return this.moviesService.findOneWithRating(id, userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies' })
  async searchMovies(@Query() searchDto: SearchMovieDto) {
    return this.moviesService.searchMovies(searchDto);
  }
} 