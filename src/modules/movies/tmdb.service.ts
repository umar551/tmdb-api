import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('TMDB_API_KEY');
  }

  async getPopularMovies(page: number = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/discover/movie`,
        {
          params: {
            include_adult: false,
            include_video: false,
            language: 'en-US',
            page,
            sort_by: 'popularity.desc'
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'accept': 'application/json'
          }
        }
      );
      return response.data.results;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to fetch movies from TMDB',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 