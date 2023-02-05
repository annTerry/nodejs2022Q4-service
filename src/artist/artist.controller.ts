import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from 'src/common/types';

@Controller('artist')
export class ArtistController {
  artistService = new ArtistService();

  @Get()
  getAllArtists(): string {
    return JSON.stringify(this.artistService.getAllArtists());
  }
  @Get(':id')
  getUserById(@Param('id') id: string): string {
    const dbResponse = this.artistService.getArtist(id);
    if (!dbResponse.data) {
      throw new HttpException(dbResponse.message, dbResponse.code);
    }
    return JSON.stringify(dbResponse.data);
  }
  @Post()
  async create(@Body() artist: Artist) {
    const result = this.artistService.create(artist);
    if (result === 400) throw new HttpException('Data missing', result);
  }
  @Put(':id')
  async edit(@Param('id') id: string, @Body() artist: Artist) {
    const result = this.artistService.changeArtist(id, artist);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
  @Delete(':id')
  @HttpCode(204)
  delUserById(@Param('id') id: string) {
    const result = this.artistService.removeArtist(id);
    if (result.code !== 200)
      throw new HttpException(result.message, result.code);
  }
}
