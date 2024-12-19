import { 
  Controller, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  Get, 
  Query 
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto, WatchlistResponseDto } from '../../dtos/watchlist.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('watchlist')
@Controller('watchlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add movie to watchlist' })
  @ApiResponse({ status: 201, type: WatchlistResponseDto })
  async addToWatchlist(
    @Req() req,
    @Body() addToWatchlistDto: AddToWatchlistDto,
  ) {
    return this.watchlistService.addToWatchlist(req.user.id, addToWatchlistDto);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Remove movie from watchlist' })
  @ApiResponse({ status: 200, description: 'Movie removed from watchlist' })
  async removeFromWatchlist(
    @Req() req,
    @Param('movieId') movieId: number,
  ) {
    return this.watchlistService.removeFromWatchlist(req.user.id, movieId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user watchlist' })
  @ApiResponse({ status: 200, type: [WatchlistResponseDto] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserWatchlist(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.watchlistService.getUserWatchlist(req.user.id, page, limit);
  }

  @Get(':movieId/status')
  @ApiOperation({ summary: 'Check if movie is in watchlist' })
  @ApiResponse({ status: 200, type: Boolean })
  async checkWatchlistStatus(
    @Req() req,
    @Param('movieId') movieId: number,
  ) {
    return {
      isInWatchlist: await this.watchlistService.isInWatchlist(req.user.id, movieId),
    };
  }
} 